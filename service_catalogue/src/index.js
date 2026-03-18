const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper: formater un prix number en string "$X,XXX"
function formatPrice(price) {
    const num = parseFloat(price);
    if (isNaN(num)) return '$0';
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// Routes
// Récupérer les "Trending Items"
app.get('/products', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM items ORDER BY trend_score DESC LIMIT 10');
        const formatted = rows.map(r => ({
            id: r.id,
            title: r.title,
            category: r.category,
            price: formatPrice(r.price),
            priceRaw: parseFloat(r.price),
            image: (r.images && r.images[0]) || '',
            user_id: r.user_id || null
        }));
        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            error: 'Internal Server Error', 
            message: err.message,
            stack: err.stack
        });
    }
});

// Récupérer le détail d'un item exclusif (Item1)
app.get('/products/exclusive', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM items WHERE id = $1', ['item1']);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        const item = rows[0];
        item.price = formatPrice(item.price);
        res.json(item);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            error: 'Internal Server Error', 
            message: err.message,
            stack: err.stack
        });
    }
});

// Récupérer les items d'un utilisateur spécifique
app.get('/products/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { rows } = await db.query('SELECT * FROM items WHERE user_id = $1 ORDER BY trend_score DESC', [userId]);
        const formatted = rows.map(r => ({
            id: r.id,
            title: r.title,
            category: r.category,
            price: formatPrice(r.price),
            priceRaw: parseFloat(r.price),
            image: (r.images && r.images[0]) || '',
            status: 'Active',
            views: Math.floor(Math.random() * 500),
            likes: Math.floor(Math.random() * 50)
        }));
        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            error: 'Internal Server Error', 
            message: err.message,
            stack: err.stack
        });
    }
});

// Récupérer le détail d'un produit par ID
app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM items WHERE id = $1', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
        const item = rows[0];
        item.price = formatPrice(item.price);
        res.json(item);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            error: 'Internal Server Error', 
            message: err.message,
            stack: err.stack
        });
    }
});

// Créer un nouvel item dans le catalogue
app.post('/products', async (req, res) => {
    try {
        const { title, category, price, condition, description, images, seller, user_id } = req.body;

        // Validation
        if (!title || !category || price === undefined || price === null) {
            return res.status(400).json({ error: 'Title, category and price are required' });
        }

        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice) || numericPrice < 0) {
            return res.status(400).json({ error: 'Price must be a valid positive number' });
        }

        if (!user_id) {
            return res.status(400).json({ error: 'user_id is required' });
        }

        // Détection de fraude sur les prix (Exigence Direction)
        // Simulation: Si le prix est > 10000 ou < 1, on considère cela comme potentiellement frauduleux
        if (numericPrice > 10000) {
            console.warn(`Alerte Fraude: Prix trop élevé (${numericPrice}) pour l'article ${title}`);
            // En situation réelle, on pourrait marquer l'article comme "en attente de modération"
        }
        if (numericPrice < 1) {
            return res.status(400).json({ error: 'Le prix est trop bas (fraude suspectée)' });
        }

        const id = 'item_' + Date.now();
        const { rows } = await db.query(
            `INSERT INTO items (id, title, category, price, condition, description, images, seller, user_id, trend_score)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0) RETURNING *`,
            [id, title, category, numericPrice, condition || '', description || '', JSON.stringify(images || []), JSON.stringify(seller || {}), user_id]
        );
        const item = rows[0];
        item.price = formatPrice(item.price);
        res.status(201).json(item);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Service Catalogue listening on port ${PORT}`);
    });
}

module.exports = app;
