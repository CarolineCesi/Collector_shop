CREATE TABLE IF NOT EXISTS items (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    condition VARCHAR(100),
    description TEXT,
    images JSONB,
    seller JSONB,
    user_id VARCHAR(50),
    trend_score INTEGER DEFAULT 0
);

-- Insert Mock Items if table is empty
INSERT INTO items (id, title, category, price, condition, description, images, seller, user_id, trend_score)
VALUES 
('item1', 'Nike Air Jordan 1 Original (1985) Chicago', 'Sneakers', 8500.00, 'Mint Condition', 'An incredibly rare find...', '["https://images.unsplash.com/photo-1576884456974-5d4f358a61c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYXJlJTIwdmludGFnZSUyMHNuZWFrZXIlMjBzaG9lfGVufDF8fHx8MTc3MTg3MTQ2NHww&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb, '{"name": "RetroVault", "avatar": "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxsZXIlMjBwcm9maWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODcxNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080", "rating": 4.9, "reviews": 124}'::jsonb, 'u1', 10),
('item2', 'Original Star Wars Kenner Action Figure (1978)', 'Toys', 1200.00, 'Mint in Box (MIB)', 'Original 1978 Kenner Star Wars action figure...', '["https://images.unsplash.com/photo-1759680190851-199358b2cd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYWN0aW9uJTIwZmlndXJlJTIwdG95fGVufDF8fHx8MTc3MTgyNzc0OXww&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb, '{"name": "ToyGalaxy", "avatar": "https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODUyMjg4fDA&ixlib=rb-4.1.0&q=80&w=1080", "rating": 5.0, "reviews": 342}'::jsonb, 'u1', 8),
('item3', 'Metropolis (1927) French One-Sheet Poster', 'Posters', 3400.00, 'Excellent (Linen Backed)', 'An authentic, original French release poster...', '["https://images.unsplash.com/photo-1759547020777-14a1ca4c3fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwbW92aWUlMjBwb3N0ZXJ8ZW58MXx8fHwxNzcxODE1NjE3fDA&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb, '{"name": "CinemaTreasures", "avatar": "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxsZXIlMjBwcm9maWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODcxNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080", "rating": 4.8, "reviews": 88}'::jsonb, NULL, 7),
('item4', 'Nintendo Entertainment System (Sealed in Box)', 'Retro Tech', 2800.00, 'Factory Sealed', 'A factory-sealed original NES Control Deck...', '["https://images.unsplash.com/photo-1605134550917-5fe8cf25a125?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGdhbWUlMjBjb25zb2xlJTIwdGVjaHxlbnwxfHx8fDE3NzE4NzE0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb, '{"name": "PixelVault", "avatar": "https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODUyMjg4fDA&ixlib=rb-4.1.0&q=80&w=1080", "rating": 4.9, "reviews": 215}'::jsonb, NULL, 9),
('item5', 'Vintage Leica M3 Camera with Summicron Lens', 'Collector Items', 4100.00, 'Excellent (Tested & Working)', 'The iconic Leica M3, considered by many as the greatest 35mm rangefinder...', '["https://images.unsplash.com/photo-1598452628649-d272a47d9047?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29sJTIwdmludGFnZSUyMGNvbGxlY3RvciUyMGl0ZW18ZW58MXx8fHwxNzcxODcxNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb, '{"name": "RetroVault", "avatar": "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxzZWxsZXIlMjBwcm9maWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODcxNDY0fDA&ixlib=rb-4.1.0&q=80&w=1080", "rating": 4.9, "reviews": 124}'::jsonb, 'u1', 6)
ON CONFLICT (id) DO NOTHING;
