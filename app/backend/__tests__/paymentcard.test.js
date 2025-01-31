const request = require('supertest');
const { sequelize} = require('../config/Setup');// Import correctly
const app = require('../server'); // Import the app
process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, describe, test,expect,} = require('@jest/globals');



beforeAll(async () => {
    await sequelize.sync();
});

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
    await PaymentCard.destroy({ where: {} }); // Clear data before each test
});

describe('PaymentCard Controller Tests', () => {

    test('GET /api/v1/paymentcards - Should return all payment cards', async () => {
        // Replace bulkCreate with individual POST requests
        await request(app).post('/api/v1/paymentcards').send({
            paymentMethod: 'Visa', userID: '1', cardHolder: 'John Doe', sortCode: 123456, cardNumber: 1234567812345678, ExpiryDate: '2025-12-01'
        });
        await request(app).post('/api/v1/paymentcards').send({
            paymentMethod: 'MasterCard', userID: '2', cardHolder: 'Jane Doe', sortCode: 654321, cardNumber: 8765432187654321, ExpiryDate: '2026-06-01'
        });

        const res = await request(app).get('/api/v1/paymentcards');
        expect(res.statusCode).toBe(200);
        expect(res.body.card.length).toBe(2);
        expect(res.body.card[0].paymentMethod).toBe('Visa');
    });

    test('POST /api/v1/paymentcards - Should create a new payment card', async () => {
        const newCard = {
            paymentMethod: 'Visa', userID: '1', cardHolder: 'John Doe', sortCode: 123456, cardNumber: 1234567812345678, ExpiryDate: '2025-12-01'
        };
        const res = await request(app).post('/api/v1/paymentcards').send(newCard);
        expect(res.statusCode).toBe(201);
        expect(res.body.card.cardHolder).toBe('John Doe');
    });

    test('GET /api/v1/paymentcards/:id - Should return a single payment card by ID', async () => {
        const cardResponse = await request(app).post('/api/v1/paymentcards').send({
            paymentMethod: 'Visa', userID: '3', cardHolder: 'Alice Doe', sortCode: 111111, cardNumber: 1111222233334444, ExpiryDate: '2027-08-01'
        });
        const res = await request(app).get(`/api/v1/paymentcards/${cardResponse.body.card.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.card.cardHolder).toBe('Alice Doe');
    });

    test('PUT /api/v1/paymentcards/:id - Should update an existing payment card', async () => {
        const cardResponse = await request(app).post('/api/v1/paymentcards').send({
            paymentMethod: 'Visa', userID: '4', cardHolder: 'Mark Doe', sortCode: 333333, cardNumber: 5555666677778888, ExpiryDate: '2028-09-01'
        });
        const res = await request(app).put(`/api/v1/paymentcards/${cardResponse.body.card.id}`).send({ cardHolder: 'Mark Smith' });
        expect(res.statusCode).toBe(200);
        expect(res.body.card[0]).toBe(1); // Sequelize returns the number of rows updated
    });

    test('DELETE /api/v1/paymentcards/:id - Should delete a payment card', async () => {
        const cardResponse = await request(app).post('/api/v1/paymentcards').send({
            paymentMethod: 'Visa', userID: '5', cardHolder: 'John Smith', sortCode: 444444, cardNumber: 9999888877776666, ExpiryDate: '2029-10-01'
        });
        const res = await request(app).delete(`/api/v1/paymentcards/${cardResponse.body.card.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Payment card deleted successfully');

        const deletedCard = await PaymentCard.findOne({ where: { id: cardResponse.body.card.id } });
        expect(deletedCard).toBeNull();
    });

});
