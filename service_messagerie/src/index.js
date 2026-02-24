const express = require('express');
const cors = require('cors');
const db = require('./db');
const { connectRabbitMQ, getChannel } = require('./rabbitmq');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Main handler for fetching all conversations for a user
app.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId === 'me' ? 'u1' : req.params.userId;

        // Fetch conversations where user is either participant
        const { rows: convs } = await db.query(
            'SELECT * FROM conversations WHERE user1_id = $1 OR user2_id = $1',
            [userId]
        );

        // Since we are mocking other relations to avoid complex microservice synchronous calls for now,
        // we store full conversation metadata in the db explicitly.
        const conversations = [];

        for (const conv of convs) {
            // Fetch messages for this conversation
            const { rows: msgs } = await db.query(
                'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY id ASC',
                [conv.id]
            );

            conversations.push({
                ...conv.meta_data,
                id: conv.id,
                messages: msgs.map(m => m.message_data)
            });
        }

        res.json(conversations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to send a new message via RabbitMQ
app.post('/', async (req, res) => {
    try {
        const { conversationId, senderId, text, isOffer, offerAmount } = req.body;

        const messagePayload = {
            conversationId,
            senderId,
            text,
            isOffer,
            offerAmount,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Simple formatting
        };

        const channel = getChannel();
        if (channel) {
            channel.sendToQueue('messages_queue', Buffer.from(JSON.stringify(messagePayload)));
            res.status(202).json({ success: true, message: 'Message queued for processing' });
        } else {
            res.status(503).json({ error: 'Message broker unavailable' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function startServer() {
    const channel = await connectRabbitMQ();

    // Background worker to process incoming messages from RabbitMQ
    if (channel) {
        channel.consume('messages_queue', async (msg) => {
            if (msg !== null) {
                try {
                    const messageContent = JSON.parse(msg.content.toString());
                    console.log('Processing new message:', messageContent);

                    const messageData = {
                        id: 'm' + Date.now(), // Generate rough incremental ID
                        senderId: messageContent.senderId,
                        text: messageContent.text,
                        timestamp: messageContent.timestamp,
                        isOffer: messageContent.isOffer,
                        offerAmount: messageContent.offerAmount
                    };

                    // Insert into Database
                    await db.query(
                        'INSERT INTO messages (conversation_id, message_data) VALUES ($1, $2)',
                        [messageContent.conversationId, messageData]
                    );

                    // Update last message in conversation
                    const lastMessageText = messageContent.text;
                    const metaDataUpdateQuery = `
                        UPDATE conversations 
                        SET meta_data = jsonb_set(
                            jsonb_set(meta_data, '{lastMessage}', $1::jsonb),
                            '{lastMessageTime}', $2::jsonb
                        )
                        WHERE id = $3
                    `;

                    await db.query(metaDataUpdateQuery, [
                        `"${lastMessageText}"`,
                        `"${messageContent.timestamp}"`,
                        messageContent.conversationId
                    ]);

                    channel.ack(msg);
                } catch (error) {
                    console.error('Error processing message from queue', error);
                    // Depending on the logic, we might NACK it to retry, or ACK it to discard
                    channel.ack(msg);
                }
            }
        });
    }

    app.listen(PORT, () => {
        console.log(`Service Messagerie listening on port ${PORT}`);
    });
}

startServer();
