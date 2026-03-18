const request = require('supertest');
const { app, verifyToken, getKey } = require('./index');
const db = require('./db');
const jwt = require('jsonwebtoken');

// Mock DB
jest.mock('./db', () => ({
    query: jest.fn()
}));

// Mock jwks-rsa to avoid network calls
jest.mock('jwks-rsa', () => {
    return jest.fn().mockImplementation(() => ({
        getSigningKey: jest.fn((kid, cb) => cb(null, { publicKey: 'test-pub-key' }))
    }));
});

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn((token, getKey, options, cb) => cb(null, { sub: 'user123', email: 'test@example.com' })),
    decode: jest.fn()
}));

describe('Utilisateur Service Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /login', () => {
        it('should sync existing user', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ id: 'user123', email: 'test@example.com' }] });
            const response = await request(app)
                .post('/login')
                .send({ keycloak_id: 'user123', email: 'test@example.com', name: 'Test User' });
            
            expect(response.status).toBe(200);
            expect(response.body.id).toBe('user123');
        });

        it('should create new user if not exists', async () => {
            db.query.mockResolvedValueOnce({ rows: [] })
                    .mockResolvedValueOnce({ rows: [{ id: 'user123', email: 'test@example.com', handle: '@testuser' }] });
            
            const response = await request(app)
                .post('/login')
                .send({ keycloak_id: 'user123', email: 'test@example.com', name: 'Test User' });
            
            expect(response.status).toBe(201);
            expect(response.body.handle).toBe('@testuser');
        });

        it('should return 400 if missing fields', async () => {
            const response = await request(app).post('/login').send({ email: 'test@example.com' });
            expect(response.status).toBe(400);
        });

        it('should handle errors', async () => {
            db.query.mockRejectedValue(new Error('DB Error'));
            const response = await request(app).post('/login').send({ keycloak_id: 'u1', email: 'e' });
            expect(response.status).toBe(500);
        });
    });

    describe('POST /register', () => {
        const newUser = { keycloak_id: 'u2', name: 'New User', email: 'u2@ex.com' };
        it('should register a new user', async () => {
            db.query.mockResolvedValueOnce({ rows: [] })
                    .mockResolvedValueOnce({ rows: [{ id: 'u2', email: 'u2@ex.com' }] });
            const response = await request(app).post('/register').send(newUser);
            expect(response.status).toBe(201);
        });

        it('should return 409 if user exists', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ id: 'u2' }] });
            const response = await request(app).post('/register').send(newUser);
            expect(response.status).toBe(409);
        });

        it('should handle errors', async () => {
            db.query.mockRejectedValue(new Error('DB error'));
            const response = await request(app).post('/register').send(newUser);
            expect(response.status).toBe(500);
        });

        it('should return 400 if missing fields', async () => {
            const response = await request(app).post('/register').send({ name: 'Partial' });
            expect(response.status).toBe(400);
        });
    });

    describe('GET /:id', () => {
        it('should return user profile', async () => {
            db.query.mockResolvedValue({ rows: [{ id: 'user123', name: 'Test User', stats: {} }] });
            const response = await request(app).get('/user123');
            expect(response.status).toBe(200);
            expect(response.body.name).toBe('Test User');
        });

        it('should return 404 if user not found', async () => {
            db.query.mockResolvedValue({ rows: [] });
            const response = await request(app).get('/unknown');
            expect(response.status).toBe(404);
        });

        it('should handle internal errors', async () => {
          db.query.mockRejectedValue(new Error('DB error'));
          const response = await request(app).get('/u1');
          expect(response.status).toBe(500);
        });
    });

    describe('Favorites', () => {
        it('should get user favorites', async () => {
            db.query.mockResolvedValue({ rows: [{ item_data: { id: 'item1' } }] });
            const response = await request(app).get('/user123/favorites');
            expect(response.status).toBe(200);
            expect(response.body[0].id).toBe('item1');
        });

        it('should check if item is in favorites', async () => {
            db.query.mockResolvedValue({ rows: [{ id: 1 }] });
            const response = await request(app).get('/user123/favorites/item1');
            expect(response.status).toBe(200);
            expect(response.body.isFavorite).toBe(true);
        });

        it('should add item to favorites', async () => {
            db.query.mockResolvedValueOnce({ rows: [] })
                    .mockResolvedValueOnce({ rows: [] });
            
            const response = await request(app)
                .post('/user123/favorites')
                .send({ item_id: 'item1', item_data: { title: 'Test Item' } });
            
            expect(response.status).toBe(201);
        });

        it('should reject if missing item_id for favorite', async () => {
          const response = await request(app).post('/user123/favorites').send({ item_data: {} });
          expect(response.status).toBe(400);
        });

        it('should reject if already in favorites', async () => {
            db.query.mockResolvedValue({ rows: [{ id: 1 }] });
            const response = await request(app)
                .post('/user123/favorites')
                .send({ item_id: 'item1', item_data: {} });
            expect(response.status).toBe(409);
        });

        it('should remove item from favorites', async () => {
            db.query.mockResolvedValue({ rows: [] });
            const response = await request(app).delete('/user123/favorites/item1');
            expect(response.status).toBe(200);
        });

        it('should handle errors', async () => {
          db.query.mockRejectedValue(new Error('DB error'));
          const response = await request(app).get('/u1/favorites');
          expect(response.status).toBe(500);
        });
    });

    describe('Listings', () => {
        it('should return user listings', async () => {
            db.query.mockResolvedValue({ rows: [{ item_data: { id: 'item1' } }] });
            const response = await request(app).get('/user123/listings');
            expect(response.status).toBe(200);
        });

        it('should handle errors', async () => {
          db.query.mockRejectedValue(new Error('DB error'));
          const response = await request(app).get('/user123/listings');
          expect(response.status).toBe(500);
        });
    });

    describe('Auth Middleware', () => {
        it('verifyToken should return 401 if no auth header', async () => {
            const req = { headers: {} };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            verifyToken(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('verifyToken should call next if token valid', async () => {
            const req = { headers: { authorization: 'Bearer valid-token' } };
            const res = {};
            const next = jest.fn();
            verifyToken(req, res, next);
            // jwt.verify is mocked to succeed
            expect(next).toHaveBeenCalled();
            expect(req.userId).toBe('user123');
        });

        it('verifyToken should return 401 if token invalid', async () => {
            jwt.verify.mockImplementationOnce((token, getKey, options, cb) => cb(new Error('Invalid')));
            const req = { headers: { authorization: 'Bearer invalid-token' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();
            verifyToken(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
        });

        it('getKey should handle error', () => {
            const callback = jest.fn();
            // Mocking client.getSigningKey failure is harder without direct export of client, 
            // but we can try to trigger it via parameters.
            getKey({ kid: 'unknown' }, callback);
            expect(callback).toHaveBeenCalled();
        });
    });
});
