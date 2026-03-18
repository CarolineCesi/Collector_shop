const request = require('supertest');
const app = require('./index');
const db = require('./db');

// Mock DB
jest.mock('./db', () => ({
    query: jest.fn()
}));

describe('Catalogue Service Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /products', () => {
        it('should return trending items', async () => {
            const mockItems = [
                { id: '1', title: 'Item 1', category: 'Cat 1', price: 10, trend_score: 100, images: ['img1'], user_id: 'u1' }
            ];
            db.query.mockResolvedValue({ rows: mockItems });

            const response = await request(app).get('/products');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].price).toBe('$10');
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM items ORDER BY trend_score DESC LIMIT 10'));
        });

        it('should handle errors', async () => {
            db.query.mockRejectedValue(new Error('DB Error'));
            const response = await request(app).get('/products');
            expect(response.status).toBe(500);
        });
    });

    describe('GET /products/exclusive', () => {
        it('should return item1 detail', async () => {
            db.query.mockResolvedValue({ rows: [{ id: 'item1', title: 'Exclusive', price: 50, images: [] }] });
            const response = await request(app).get('/products/exclusive');
            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Exclusive');
        });

        it('should return 404 if not found', async () => {
            db.query.mockResolvedValue({ rows: [] });
            const response = await request(app).get('/products/exclusive');
            expect(response.status).toBe(404);
        });
    });

    describe('GET /products/user/:userId', () => {
        it('should return items for a specific user', async () => {
            db.query.mockResolvedValue({ rows: [{ id: 'u_item', title: 'User Item', price: 30, images: [] }] });
            const response = await request(app).get('/products/user/u123');
            expect(response.status).toBe(200);
            expect(response.body[0].title).toBe('User Item');
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE user_id = $1'), ['u123']);
        });

        it('should handle errors', async () => {
            db.query.mockRejectedValue(new Error('DB Error'));
            const response = await request(app).get('/products/user/u123');
            expect(response.status).toBe(500);
        });
    });

    describe('GET /products/:id', () => {
        it('should return product by id', async () => {
            db.query.mockResolvedValue({ rows: [{ id: 'test_id', title: 'Test', price: 20, images: [] }] });
            const response = await request(app).get('/products/test_id');
            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Test');
        });

        it('should return 404 if product not found', async () => {
            db.query.mockResolvedValue({ rows: [] });
            const response = await request(app).get('/products/unknown');
            expect(response.status).toBe(404);
        });

        it('should handle errors', async () => {
            db.query.mockRejectedValue(new Error('DB Error'));
            const response = await request(app).get('/products/test_id');
            expect(response.status).toBe(500);
        });
    });

    describe('POST /products', () => {
        const newItem = {
            title: 'New Item',
            category: 'Tech',
            price: 15,
            user_id: 'user123',
            images: ['img1'],
            seller: { name: 'Seller' }
        };

        it('should create a new product', async () => {
            db.query.mockResolvedValue({ rows: [{ ...newItem, id: 'new_id', price: 15 }] });
            const response = await request(app)
                .post('/products')
                .send(newItem);

            expect(response.status).toBe(201);
            expect(response.body.title).toBe('New Item');
            expect(response.body.price).toBe('$15');
        });

        it('should trigger fraud warning for very high price', async () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            db.query.mockResolvedValue({ rows: [{ ...newItem, id: 'rich_id', price: 20000 }] });
            const response = await request(app)
                .post('/products')
                .send({ ...newItem, price: 20000 });
            
            expect(response.status).toBe(201);
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Alerte Fraude: Prix trop élevé'));
            consoleSpy.mockRestore();
        });

        it('should reject if missing user_id', async () => {
            const { user_id, ...invalidItem } = newItem;
            const response = await request(app).post('/products').send(invalidItem);
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('user_id is required');
        });

        it('should reject if missing required fields', async () => {
            const response = await request(app).post('/products').send({ title: 'No price' });
            expect(response.status).toBe(400);
        });

        it('should reject if price is negative', async () => {
            const response = await request(app).post('/products').send({ ...newItem, price: -5 });
            expect(response.status).toBe(400);
        });

        it('should detect fraud if price < 1', async () => {
            const response = await request(app).post('/products').send({ ...newItem, price: 0.5 });
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('prix est trop bas');
        });

        it('should handle DB errors', async () => {
            db.query.mockRejectedValue(new Error('DB Error'));
            const response = await request(app).post('/products').send(newItem);
            expect(response.status).toBe(500);
        });
    });
});
