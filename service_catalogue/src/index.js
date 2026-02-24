const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
// Récupérer les "Trending Items"
app.get('/products', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM items ORDER BY trend_score DESC LIMIT 10');
        // Format image to send only the first one as a string for the grid, just simulating the frontend needs.
        const formatted = rows.map(r => ({
            id: r.id,
            title: r.title,
            category: r.category,
            price: r.price,
            image: r.images[0] || '',
            sellerRating: r.seller.rating || 0,
            reviewsCount: r.seller.reviews || 0
        }));
        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Récupérer le détail d'un item exclusif (Item1)
app.get('/products/exclusive', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM items WHERE id = $1', ['item1']);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Récupérer le détail d'un produit par ID
app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM items WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Service Catalogue listening on port ${PORT}`);
});
