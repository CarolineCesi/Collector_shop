const request = require('supertest');
const { app } = require('../../src/index');
const db = require('../../src/db');

// Ces tests attendent que Docker soit lancé
describe('Utilisateur Service - Integration Tests (Concrete)', () => {

    afterAll(async () => {
        await db.pool.end();
    });

    describe('GET /u1', () => {
        it('should fetch the pre-loaded user u1', async () => {
            const response = await request(app).get('/u1');
            expect(response.status).toBe(200);
            expect(response.body.id).toBe('u1');
            expect(response.body.name).toContain('Alex');
        });
    });

    describe('POST /login', () => {
        it('should sync/create a user in the real database', async () => {
            const uniqueId = 'it_user_' + Date.now();
            const payload = {
                keycloak_id: uniqueId,
                email: uniqueId + '@test.com',
                name: 'IT User'
            };

            const response = await request(app)
                .post('/login')
                .send(payload);

            expect(response.status).toBe(201);
            expect(response.body.id).toBe(uniqueId);

            // Vérifier en base
            const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [uniqueId]);
            expect(rows.length).toBe(1);
        });
    });

    describe('Favorites Integration', () => {
        it('should add a real favorite for u1', async () => {
            const itemId = 'i_' + Date.now();
            const response = await request(app)
                .post('/u1/favorites')
                .send({
                    item_id: itemId,
                    item_data: { title: 'Integration Test Favorite' }
                });

            expect(response.status).toBe(201);

            // Vérifier en base
            const { rows } = await db.query('SELECT * FROM favorites WHERE user_id = $1 AND item_id = $2', ['u1', itemId]);
            expect(rows.length).toBe(1);
        });
    });
});
