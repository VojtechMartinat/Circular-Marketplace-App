const request = require('supertest');
const { sequelize} = require('../config/Setup');// Import correctly
const app = require('../server'); // Import the app
process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, describe, test,expect, afterEach,} = require('@jest/globals');

describe('PaymentCard Controller Tests', () => {

    beforeAll(async () => {
        // Sync models with in-memory database before running tests
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        // Close the Sequelize connection after tests are done
        await sequelize.close();
    });

    beforeEach(async () => {
        // Clear data from tables before each test
        await sequelize.models.User.destroy({ where: {}, force: true });
        await sequelize.models.PaymentCard.destroy({ where: {}, force: true });


        // Insert necessary data for each test
        const newUser = { userID: '1', username: 'user1', password: 'password', email: 'user1@example.com', wallet: 100.0 };
        await request(app).post('/api/v1/users').send(newUser);
    });

    afterEach(async () => {
        // Ensure no data remains in the database by truncating tables again
        await sequelize.models.User.destroy({ where: {}, force: true });
        await sequelize.models.PaymentCard.destroy({ where: {}, force: true });
    });

    test('GET /api/v1/paymentcards - Should return an empty array if no cards exist', async () => {

        const res = await request(app).get('/api/v1/paymentcards');

        expect(res.statusCode).toBe(200);
        expect(res.body.card).toEqual([]); // Validate it's an empty array
    });
    test('GET /api/v1/paymentcards - Should return all payment cards', async () => {
        const newCard = {
            userID: '1',
            cardHolder: 'John Doe',
            sortCode: 123456,
            cardNumber: 1234567812345678,
            ExpiryDate: '2025-12-01',
        };

        const postRes = await request(app)
            .post('/api/v1/paymentcards')
            .send(newCard);

        expect(postRes.statusCode).toBe(201);

        const getRes = await request(app).get('/api/v1/paymentcards');

        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.card).toHaveLength(1);
        expect(getRes.body.card[0].cardHolder).toBe('John Doe');
    });

    test('GET /api/v1/paymentcards/:id - Should return a specific payment card by ID', async () => {
        const newCard = {
            paymentMethod: 'Visa',
            userID: '1',
            cardHolder: 'John Doe',
            sortCode: 123456,
            cardNumber: 1234567812345678,
            ExpiryDate: '2025-12-01',
        };

        const postRes = await request(app)
            .post('/api/v1/paymentcards')
            .send(newCard);


        const cardID = postRes.body.card.paymentMethodID;
        const getRes = await request(app).get(`/api/v1/paymentcards/${cardID}`);


        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.card.paymentMethodID).toBe(cardID);
        expect(getRes.body.card.cardHolder).toBe('John Doe');
    });

    test('PUT /api/v1/paymentcards/:id - Should update an existing payment card', async () => {
        const newCard = {
            paymentMethodID: 2,
            paymentMethod: 'Visa',
            userID: '1',
            cardHolder: 'John Doe',
            sortCode: 123456,
            cardNumber: 1234567812345678,
            ExpiryDate: '2025-12-01',
        };

        const postRes = await request(app)
            .post('/api/v1/paymentcards')
            .send(newCard);

        const cardID = postRes.body.card.paymentMethodID;
        const updatedData = {cardHolder: 'Joe Doe' };

        const updateRes = await request(app)
            .patch(`/api/v1/paymentcards/${cardID}`)
            .send(updatedData);

        expect(updateRes.statusCode).toBe(200);
        expect(updateRes.body.card.cardHolder).toBe('Joe Doe');
    });

    test('DELETE /api/v1/paymentcards/:id - Should delete an existing payment card', async () => {
        const newCard = {
            userID: '1',
            cardHolder: 'John Doe',
            sortCode: 123456,
            cardNumber: 1234567812345678,
            ExpiryDate: '2025-12-01',
        };

        const postRes = await request(app)
            .post('/api/v1/paymentcards')
            .send(newCard);

        const cardID = postRes.body.card.paymentMethodID;

        const deleteRes = await request(app).delete(`/api/v1/paymentcards/${cardID}`);
        expect(deleteRes.statusCode).toBe(200);

        const getRes = await request(app).get(`/api/v1/paymentcards/${cardID}`);
        expect(getRes.body).toStrictEqual({"card": null}); // Not Found
    });

    test('POST /api/v1/paymentcards - Should return 500 for missing userID', async () => {
        const invalidCard = {
            paymentMethod: 'Visa',
            cardHolder: 'John Doe',
            sortCode: 123456,
            cardNumber: 1233343,
            ExpiryDate: '2025-12-01',
        };

        const res = await request(app)
            .post('/api/v1/paymentcards')
            .send(invalidCard);

        expect(res.statusCode).toBe(500); // Bad Request
    });

    test('GET /api/v1/paymentcards/:id - Should return 404 for a non-existent card', async () => {
        const res = await request(app).get('/api/v1/paymentcards/324343');
        expect(res.body).toStrictEqual({"card": null});
    });

    test('PUT /api/v1/paymentcards/:id - Should return 404 for updating a non-existent card', async () => {
        const res = await request(app)
            .patch('/api/v1/paymentcards/nonexistent-id')
            .send({ cardHolder: 'Non Existent' });

        expect(res.statusCode).toBe(404);
    });

    test('DELETE /api/v1/paymentcards/:id - Should return 404 for deleting a non-existent card', async () => {
        const res = await request(app).delete('/api/v1/paymentcards/23442432');
        expect(res.statusCode).toBe(404);
    });

});
