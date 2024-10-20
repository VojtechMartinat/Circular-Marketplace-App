const request = require('supertest');
const { sequelize, PaymentCard } = require('./Setup'); // Import correctly
const app = require('../server'); // Import the app

beforeAll(async () => {
    await sequelize.sync();
});

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
    await PaymentCard.destroy({ where: {} }); // Clear data before each test
});

describe('PaymentCard Model Tests with Sequelize', () => {

    test('GET /api/v1/paymentcards - Should return all payment cards', async () => {
        await PaymentCard.bulkCreate([
            { paymentMethod: 'Visa', userID: '1', cardHolder: 'John Doe', sortCode: 123456, cardNumber: 1234567812345678, ExpiryDate: '2025-12-01' },
            { paymentMethod: 'MasterCard', userID: '2', cardHolder: 'Jane Doe', sortCode: 654321, cardNumber: 8765432187654321, ExpiryDate: '2026-06-01' },
        ]);

        const res = await request(app).get('/api/v1/paymentcards');
        expect(res.statusCode).toBe(200);
        expect(res.body.paymentCards.length).toBe(2);
        expect(res.body.paymentCards[0].paymentMethod).toBe('Visa');
    });

    test('POST /api/v1/paymentcards - Should create a new payment card', async () => {
        const newCard = { paymentMethod: 'Visa', userID: '1', cardHolder: 'John Doe', sortCode: 123456, cardNumber: 1234567812345678, ExpiryDate: '2025-12-01' };
        const res = await request(app).post('/api/v1/paymentcards').send(newCard);
        expect(res.statusCode).toBe(201);
        expect(res.body.cardHolder).toBe('John Doe');
    });

    test('DELETE /api/v1/paymentcards/:id - Should delete a payment card', async () => {
        const card = await PaymentCard.create({ paymentMethod: 'Visa', userID: '1', cardHolder: 'John Doe', sortCode: 123456, cardNumber: 1234567812345678, ExpiryDate: '2025-12-01' });
        const res = await request(app).delete(`/api/v1/paymentcards/${card.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Payment card deleted successfully');
    });

});
