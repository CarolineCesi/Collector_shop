const amqp = require('amqplib');

let channel = null;

async function connectRabbitMQ() {
    try {
        const amqpUrl = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
        const connection = await amqp.connect(amqpUrl);
        channel = await connection.createChannel();
        await channel.assertQueue('messages_queue', { durable: true });
        console.log('Connected to RabbitMQ');
        return channel;
    } catch (err) {
        console.error('Failed to connect to RabbitMQ, retrying in 5s...', err);
        setTimeout(connectRabbitMQ, 5000);
    }
}

function getChannel() {
    return channel;
}

module.exports = {
    connectRabbitMQ,
    getChannel
};
