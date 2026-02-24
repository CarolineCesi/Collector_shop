CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(50) PRIMARY KEY,
    user1_id VARCHAR(50) NOT NULL,
    user2_id VARCHAR(50) NOT NULL,
    meta_data JSONB
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id VARCHAR(50) REFERENCES conversations(id),
    message_data JSONB
);

-- Insert Mock Conversations
INSERT INTO conversations (id, user1_id, user2_id, meta_data)
VALUES 
(
    'c1', 
    'u1', 
    'u2', 
    '{"userId": "u2", "userName": "RetroVault", "userAvatar": "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxsZXIlMjBwcm9maWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODcxNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080", "itemImage": "https://images.unsplash.com/photo-1576884456974-5d4f358a61c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyYXJlJTIwdmludGFnZSUyMHNuZWFrZXIlMjBzaG9lfGVufDF8fHx8MTc3MTg3MTQ2NHww&ixlib=rb-4.1.0&q=80&w=1080", "itemTitle": "Nike Air Jordan 1 Original", "lastMessage": "Is the price negotiable?", "lastMessageTime": "2m ago", "unreadCount": 1}'::jsonb
),
(
    'c2', 
    'u1', 
    'u3', 
    '{"userId": "u3", "userName": "ToyGalaxy", "userAvatar": "https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODUyMjg4fDA&ixlib=rb-4.1.0&q=80&w=1080", "itemImage": "https://images.unsplash.com/photo-1759680190851-199358b2cd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx2aW50YWdlJTIwYWN0aW9uJTIwZmlndXJlJTIwdG95fGVufDF8fHx8MTc3MTgyNzc0OXww&ixlib=rb-4.1.0&q=80&w=1080", "itemTitle": "Star Wars Kenner Figure", "lastMessage": "I''ll ship it tomorrow morning!", "lastMessageTime": "1d ago", "unreadCount": 0}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Insert Mock Messages
INSERT INTO messages (conversation_id, message_data)
VALUES 
('c1', '{"id": "m11", "senderId": "u2", "text": "Hi! I m interested in the Jordans.", "timestamp": "10:30 AM"}'::jsonb),
('c1', '{"id": "m12", "senderId": "me", "text": "Hello! Thanks for your interest. They are available.", "timestamp": "10:32 AM"}'::jsonb),
('c1', '{"id": "m13", "senderId": "u2", "text": "Is the price negotiable? I can offer $8,000.", "timestamp": "10:35 AM", "isOffer": true, "offerAmount": "$8,000"}'::jsonb),

('c2', '{"id": "m21", "senderId": "me", "text": "Just purchased! Can you pack it securely?", "timestamp": "Yesterday"}'::jsonb),
('c2', '{"id": "m22", "senderId": "u3", "text": "Absolutely, lots of bubble wrap. I''ll ship it tomorrow morning!", "timestamp": "Yesterday"}'::jsonb);

