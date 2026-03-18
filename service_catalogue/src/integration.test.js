const request = require('supertest');
const app = require('./index');
const db = require('./db');

// Ces tests attendent que Docker soit lancé
describe('Catalogue Service - Integration Tests (Concrete)', () => {
    
    afterAll(async () => {
        await db.pool.end();
    });

    describe('GET /products', () => {
        it('should return real products from the database', async () => {
            const response = await request(app).get('/products');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            if (response.body.length > 0) {
                expect(response.body[0]).toHaveProperty('id');
                expect(response.body[0]).toHaveProperty('title');
                expect(response.body[0].price).toMatch(/^\$/);
            }
        });
    });

    describe('POST /products', () => {
        it('should insert a real product into the database', async () => {
            const uniqueTitle = 'Integration Test Item ' + Date.now();
            const newItem = {
                title: uniqueTitle,
                category: 'Test',
                price: 99,
                user_id: 'u1',
                images: [],
                seller: { name: 'Tester' }
            };

            const response = await request(app)
                .post('/products')
                .send(newItem);

            expect(response.status).toBe(201);
            expect(response.body.title).toBe(uniqueTitle);

            // Vérifier en base
            const { rows } = await db.query('SELECT * FROM items WHERE title = $1', [uniqueTitle]);
            expect(rows.length).toBe(1);
            expect(parseFloat(rows[0].price)).toBe(99);
        });
    });

    describe('GET /products/:id', () => {
        it('should fetch item1 which is pre-loaded', async () => {
            const response = await request(app).get('/products/item1');
            expect(response.status).toBe(200);
            expect(response.body.id).toBe('item1');
        });
    });
});
