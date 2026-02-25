const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3002;
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://keycloak:8080';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'collector-shop';

app.use(cors());
app.use(express.json());

// JWKS client for Keycloak token verification
const client = jwksClient({
    jwksUri: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`,
    cache: true,
    rateLimit: true
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            console.error('Error getting signing key:', err.message);
            return callback(err);
        }
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

// Middleware: verify Keycloak JWT token
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, getKey, {
        algorithms: ['RS256'],
        issuer: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`
    }, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err.message);
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = decoded;
        req.userId = decoded.sub; // Keycloak user ID
        next();
    });
}

// Routes

// Login - Keycloak handles authentication, this endpoint creates/syncs user in our DB
app.post('/login', async (req, res) => {
    try {
        const { keycloak_id, name, email } = req.body;

        if (!keycloak_id || !email) {
            return res.status(400).json({ error: 'keycloak_id and email are required' });
        }

        // Check if user exists
        const { rows: existing } = await db.query('SELECT * FROM users WHERE id = $1', [keycloak_id]);

        if (existing.length > 0) {
            const user = existing[0];
            delete user.password;
            user.stats = user.stats || { sold: 0, active: 0, followers: 0 };
            return res.json(user);
        }

        // Create new user in our DB with Keycloak ID
        const handle = '@' + (name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
        const joined = 'Member since ' + new Date().getFullYear();
        const stats = { sold: 0, active: 0, followers: 0 };

        const { rows } = await db.query(
            `INSERT INTO users (id, name, email, password, handle, joined, rating, reviews_count, stats) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
             RETURNING id, name, email, handle, avatar, cover, bio, joined, location, rating, reviews_count, stats`,
            [keycloak_id, name || 'User', email, 'keycloak-managed', handle, joined, 0, 0, stats]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Register - kept for backward compatibility, Keycloak handles actual registration
app.post('/register', async (req, res) => {
    try {
        const { keycloak_id, name, email } = req.body;

        if (!keycloak_id || !name || !email) {
            return res.status(400).json({ error: 'keycloak_id, name and email are required' });
        }

        // Check if user exists
        const { rows: existing } = await db.query('SELECT id FROM users WHERE id = $1 OR email = $2', [keycloak_id, email]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const handle = '@' + name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const joined = 'Member since ' + new Date().getFullYear();
        const stats = { sold: 0, active: 0, followers: 0 };

        const { rows } = await db.query(
            `INSERT INTO users (id, name, email, password, handle, joined, rating, reviews_count, stats) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
             RETURNING id, name, email, handle, avatar, cover, bio, joined, location, rating, reviews_count, stats`,
            [keycloak_id, name, email, 'keycloak-managed', handle, joined, 0, 0, stats]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get User Profile by ID
app.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);

        if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

        const user = rows[0];
        delete user.password;
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
        const id = req.params.id;
        const { rows } = await db.query('SELECT item_data FROM favorites WHERE user_id = $1', [id]);
        const favorites = rows.map(r => r.item_data);
        res.json(favorites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Check if an item is in user's favorites
app.get('/:id/favorites/:itemId', async (req, res) => {
    try {
        const { id, itemId } = req.params;
        const { rows } = await db.query('SELECT id FROM favorites WHERE user_id = $1 AND item_id = $2', [id, itemId]);
        res.json({ isFavorite: rows.length > 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add item to favorites
app.post('/:id/favorites', async (req, res) => {
    try {
        const userId = req.params.id;
        const { item_id, item_data } = req.body;
        if (!item_id || !item_data) {
            return res.status(400).json({ error: 'item_id and item_data are required' });
        }

        // Check if already favorited
        const { rows: existing } = await db.query('SELECT id FROM favorites WHERE user_id = $1 AND item_id = $2', [userId, item_id]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Item already in favorites' });
        }

        await db.query(
            'INSERT INTO favorites (user_id, item_id, item_data) VALUES ($1, $2, $3)',
            [userId, item_id, item_data]
        );
        res.status(201).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Remove item from favorites
app.delete('/:id/favorites/:itemId', async (req, res) => {
    try {
        const { id, itemId } = req.params;
        await db.query('DELETE FROM favorites WHERE user_id = $1 AND item_id = $2', [id, itemId]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get User's listings (kept for backward compat)
app.get('/:id/listings', async (req, res) => {
    try {
        const id = req.params.id;
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
