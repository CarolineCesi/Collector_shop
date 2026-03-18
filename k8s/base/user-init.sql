CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    handle VARCHAR(100) NOT NULL,
    avatar VARCHAR(500),
    cover VARCHAR(500),
    bio TEXT,
    joined VARCHAR(50),
    location VARCHAR(100),
    rating NUMERIC(2,1),
    reviews_count INTEGER DEFAULT 0,
    stats JSONB
);

CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id),
    item_id VARCHAR(50),
    item_data JSONB
);

CREATE TABLE IF NOT EXISTS user_listings (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id),
    item_id VARCHAR(50),
    item_data JSONB
);

-- Insert Mock Data
INSERT INTO users (id, name, email, password, handle, avatar, cover, bio, joined, location, rating, reviews_count, stats)
VALUES (
    'u1', 
    'Alex Collector', 
    'alex@example.com',
    '$2b$10$placeholder_hashed_password_seed_data',
    '@alex_vintage', 
    'https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODUyMjg4fDA&ixlib=rb-4.1.0&q=80&w=1080', 
    'https://images.unsplash.com/photo-1598452628649-d272a47d9047?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjb29sJTIwdmludGFnZSUyMGNvbGxlY3RvciUyMGl0ZW18ZW58MXx8fHwxNzcxODcxNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'Passionate about 80s tech and vintage cameras. Always hunting for the next rare find.',
    'Member since 2021',
    'San Francisco, CA',
    4.9,
    120,
    '{"sold": 45, "active": 12, "followers": 892}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Mock Favorites
INSERT INTO favorites (user_id, item_id, item_data)
VALUES 
('u1', 'f1', '{"id": "f1", "title": "Leica M6 Rangefinder Film Camera Black Body", "price": "$2,890", "image": "https://images.unsplash.com/photo-1598452628649-d272a47d9047?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29sJTIwdmludGFnZSUyMGNvbGxlY3RvciUyMGl0ZW18ZW58MXx8fHwxNzcxODcxNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080", "badge": "Low Stock"}'::jsonb),
('u1', 'f2', '{"id": "f2", "title": "First Edition Pokémon Charizard Holo (PSA 8)", "price": "$5,400", "image": "https://images.unsplash.com/photo-1759680190851-199358b2cd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYWN0aW9uJTIwZmlndXJlJTIwdG95fGVufDF8fHx8MTc3MTgyNzc0OXww&ixlib=rb-4.1.0&q=80&w=1080", "badge": "On Sale"}'::jsonb),
('u1', 'f3', '{"id": "f3", "title": "Eames Lounge Chair & Ottoman (1970s Rosewood)", "price": "$6,200", "image": "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxzZWxsZXIlMjBwcm9maWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODcxNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080", "badge": null}'::jsonb),
('u1', 'f4', '{"id": "f4", "title": "Rolex Submariner 5513 Meters First", "price": "$14,500", "image": "https://images.unsplash.com/photo-1576884456974-5d4f358a61c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyYXJlJTIwdmludGFnZSUyMHNuZWFrZXIlMjBzaG9lfGVufDF8fHx8MTc3MTg3MTQ2NHww&ixlib=rb-4.1.0&q=80&w=1080", "badge": "Dropping Soon"}'::jsonb);

-- Mock Listings
INSERT INTO user_listings (user_id, item_id, item_data)
VALUES
('u1', 'l1', '{"id": "l1", "title": "Sony Walkman WM-F5 Sports Yellow", "price": "$350", "image": "https://images.unsplash.com/photo-1605134550917-5fe8cf25a125?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZXRybyUyMGdhbWUlMjBjb25zb2xlJTIwdGVjaHxlbnwxfHx8fDE3NzE4NzE0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080", "status": "Active", "views": 124, "likes": 18}'::jsonb),
('u1', 'l2', '{"id": "l2", "title": "Vintage Levis 501 Big E (1960s)", "price": "$1,200", "image": "https://images.unsplash.com/photo-1576884456974-5d4f358a61c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyYXJlJTIwdmludGFnZSUyMHNuZWFrZXIlMjBzaG9lfGVufDF8fHx8MTc3MTg3MTQ2NHww&ixlib=rb-4.1.0&q=80&w=1080", "status": "Active", "views": 342, "likes": 45}'::jsonb),
('u1', 'l3', '{"id": "l3", "title": "Polaroid SX-70 Original", "price": "$450", "image": "https://images.unsplash.com/photo-1598452628649-d272a47d9047?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjb29sJTIwdmludGFnZSUyMGNvbGxlY3RvciUyMGl0ZW18ZW58MXx8fHwxNzcxODcxNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080", "status": "Sold", "views": 890, "likes": 112}'::jsonb);
