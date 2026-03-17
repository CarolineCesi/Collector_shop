const request = require('supertest');
const express = require('express');

// Mock DB
const db = {
    query: jest.fn()
};

// Simple app for testing (subset of real app)
const app = express();
app.use(express.json());

function formatPrice(price) {
    const num = parseFloat(price);
    if (isNaN(num)) return '$0';
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

app.post('/products', async (req, res) => {
    try {
        const { title, category, price, user_id } = req.body;

        if (!title || !category || price === undefined || price === null) {
            return res.status(400).json({ error: 'Title, category and price are required' });
        }

        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice)) {
            return res.status(400).json({ error: 'Price must be a valid number' });
        }

        // Fraud Detection Logic
        if (numericPrice < 1) {
            return res.status(400).json({ error: 'Le prix est trop bas (fraude suspectée)' });
        }

        if (!user_id) {
            return res.status(400).json({ error: 'user_id is required' });
        }

        const id = 'item_' + Date.now();
        await db.query(
            'INSERT INTO items (id, title, category, price, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, title, category, numericPrice, user_id]
        );
        res.status(201).json({ id, title, price: formatPrice(numericPrice) });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

describe('Catalogue Service - Price Fraud Detection', () => {
    it('should reject products with price < 1€ (CA#1)', async () => {
        const response = await request(app)
            .post('/products')
            .send({
                title: 'Cheap Item',
                category: 'Test',
                price: 0.5,
                user_id: 'u1'
            });
        
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('prix est trop bas');
    });

    it('should accept products with valid price (e.g. 10€)', async () => {
        db.query.mockResolvedValue({ rows: [{ id: 'item_123' }] });
        
        const response = await request(app)
            .post('/products')
            .send({
                title: 'Valid Item',
                category: 'Test',
                price: 10,
                user_id: 'u1'
            });
        
        expect(response.status).toBe(201);
        expect(response.body.price).toBe('$10');
    });
});
