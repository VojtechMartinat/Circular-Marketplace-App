const request = require('supertest');
const { sequelize, PaymentCard } = require('./Setup'); // Import correctly
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
        await sequelize.models.Wishlist.destroy({ where: {}, force: true });
        await sequelize.models.PaymentCard.destroy({ where: {}, force: true });


        // Insert necessary data for each test
        const newUser = { userID: '1', username: 'user1', password: 'password', email: 'user1@example.com', wallet: 100.0 };
        await request(app).post('/api/v1/users').send(newUser);
    });

    afterEach(async () => {
        // Ensure no data remains in the database by truncating tables again
        await sequelize.models.User.destroy({ where: {}, force: true });
        await sequelize.models.Wishlist.destroy({ where: {}, force: true });
        await sequelize.models.PaymentCard.destroy({ where: {}, force: true });


    });

    test('GET /api/v1/paymentcards - Should return all payment cards', async () => {
        // New payment card data
        const newCard = {
            userID: '1',
            cardHolder: 'John Doe',
            sortCode: 123456,
            cardNumber: 1234567812345678,
            ExpiryDate: '2025-12-01',
        };

        // Await the POST request to ensure it's completed before continuing
        const postRes = await request(app)
            .post('/api/v1/paymentcards')
            .send(newCard);

        // Log the POST response to verify it's correct
        // Check the POST request response
        expect(postRes.statusCode).toBe(201);

        // Fetch all payment cards to confirm the new card was added
        const getRes = await request(app).get('/api/v1/paymentcards');

        // Assertions on the GET response
        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.card).toHaveLength(1);
        expect(getRes.body.card[0].cardHolder).toBe('John Doe');
    });
    test('GET /api/v1/paymentcards - Should return an empty array if no cards exist', async () => {
        // Clear all records directly using Sequelize
        await sequelize.models.PaymentCard.destroy({ where: {}, force: true });

        // Fetch all payment cards to ensure the table is empty
        const res = await request(app).get('/api/v1/paymentcards');
        const paymentcards = await sequelize.models.PaymentCard.findAll();
        console.log('Remaining records:', paymentcards); // Should be empty


        // Assertions on the response
        expect(res.statusCode).toBe(200);
        expect(res.body.card).toHaveLength(0);
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

        const cardID = postRes.body.paymentCard.paymentMethodID;
        const getRes = await request(app).get(`/api/v1/paymentcards/${cardID}`);

        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.card.paymentMethodID).toBe(cardID);
        expect(getRes.body.card.cardHolder).toBe('John Doe');
    });

    test('PUT /api/v1/paymentcards/:id - Should update an existing payment card', async () => {
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

        const cardID = postRes.body.paymentCard.paymentMethodID;
        const updatedData = { cardHolder: 'Jane Doe' };

        const updateRes = await request(app)
            .put(`/api/v1/paymentcards/${cardID}`)
            .send(updatedData);

        expect(updateRes.statusCode).toBe(200);
        expect(updateRes.body.paymentCard.cardHolder).toBe('Jane Doe');

        const getRes = await request(app).get(`/api/v1/paymentcards/${cardID}`);
        expect(getRes.body.card.cardHolder).toBe('Jane Doe');
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

        const cardID = postRes.body.card[0].paymentMethodID;

        const deleteRes = await request(app).delete(`/api/v1/paymentcards/${cardID}`);
        expect(deleteRes.statusCode).toBe(204);

        const getRes = await request(app).get(`/api/v1/paymentcards/${cardID}`);
        expect(getRes.statusCode).toBe(404); // Not Found
    });

    test('POST /api/v1/paymentcards - Should return 400 for invalid input', async () => {
        const invalidCard = {
            paymentMethod: 'Visa',
            userID: '1',
            cardHolder: '', // Missing cardHolder
            sortCode: 123456,
            cardNumber: 'invalid', // Invalid card number
            ExpiryDate: '2025-12-01',
        };

        const res = await request(app)
            .post('/api/v1/paymentcards')
            .send(invalidCard);

        expect(res.statusCode).toBe(400); // Bad Request
        expect(res.body.error).toBeDefined();
    });

    test('GET /api/v1/paymentcards/:id - Should return 404 for a non-existent card', async () => {
        const res = await request(app).get('/api/v1/paymentcards/nonexistent-id');
        expect(res.statusCode).toBe(404);
    });

    test('PUT /api/v1/paymentcards/:id - Should return 404 for updating a non-existent card', async () => {
        const res = await request(app)
            .put('/api/v1/paymentcards/nonexistent-id')
            .send({ cardHolder: 'Non Existent' });

        expect(res.statusCode).toBe(404);
    });

    test('DELETE /api/v1/paymentcards/:id - Should return 404 for deleting a non-existent card', async () => {
        const res = await request(app).delete('/api/v1/paymentcards/nonexistent-id');
        expect(res.statusCode).toBe(404);
    });

});
