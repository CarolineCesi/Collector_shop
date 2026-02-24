const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Routes

// Register new user
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Check if user exists
        const { rows: existing } = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const id = 'u' + Date.now(); // Simple ID generation
        const handle = '@' + name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const joined = 'Member since ' + new Date().getFullYear();
        const stats = { sold: 0, active: 0, followers: 0 };

        const { rows } = await db.query(
            `INSERT INTO users (id, name, email, password, handle, joined, rating, reviews_count, stats) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
             RETURNING id, name, email, handle, avatar, cover, bio, joined, location, rating, reviews_count, stats`,
            [id, name, email, password, handle, joined, 0, 0, stats]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login user
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];
        // Don't send password back
        delete user.password;

        user.stats = user.stats || { sold: 0, active: 0, followers: 0 };
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get User Profile by ID (or 'me' which maps to mock user)
app.get('/:id', async (req, res) => {
    try {
        const id = req.params.id === 'me' ? 'u1' : req.params.id; // Mock mapping 'me' to 'u1'
        const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);

        if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

        const user = rows[0];
        // Parse stats correctly
        res.json({
            ...user,
            stats: user.stats || { sold: 0, active: 0, followers: 0 }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get User's favorites
app.get('/:id/favorites', async (req, res) => {
    try {
        const id = req.params.id === 'me' ? 'u1' : req.params.id;

        // Return favorites directly. In a real app we'd join with the items table in service_catalogue, 
        // but here we'll simulate the frontend need by returning the stored payloads directly or IDs.
        // For simplicity in this mock integration, we store the full denormalized favorite items.
        const { rows } = await db.query('SELECT item_data FROM favorites WHERE user_id = $1', [id]);

        const favorites = rows.map(r => r.item_data);
        res.json(favorites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get User's listings
app.get('/:id/listings', async (req, res) => {
    try {
        const id = req.params.id === 'me' ? 'u1' : req.params.id;

        // Similar to favorites, we'll store mock denormalized listings to avoid cross-service queries for now.
        const { rows } = await db.query('SELECT item_data FROM user_listings WHERE user_id = $1', [id]);

        const listings = rows.map(r => r.item_data);
        res.json(listings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, () => {
    console.log(`Service Utilisateur listening on port ${PORT}`);
});
