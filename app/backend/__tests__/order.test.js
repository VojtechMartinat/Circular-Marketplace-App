const request = require('supertest');
const { sequelize, Order } = require('./Setup');
const app = require('../server');

beforeAll(async () => {
    await sequelize.sync();
});

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
    await Order.destroy({ where: {} });
});

describe('Order Model Tests with Sequelize', () => {

    test('GET /api/v1/orders - Should return all orders', async () => {
        await Order.bulkCreate([
            { orderID: '1', userID: '123', articleID: '456', paymentMethod: 'Visa', dateOfPurchase: '2024-10-01', totalPrice: 100.0, collectionMethod: 'delivery', orderStatus: 'confirmed' },
            { orderID: '2', userID: '456', articleID: '789', paymentMethod: 'MasterCard', dateOfPurchase: '2024-10-02', totalPrice: 200.0, collectionMethod: 'delivery', orderStatus: 'dispatched' },
        ]);

        const res = await request(app).get('/api/v1/orders');
        expect(res.statusCode).toBe(200);
        expect(res.body.orders.length).toBe(2);
    });

    test('POST /api/v1/orders - Should create a new order', async () => {
        const newOrder = { orderID: '1', userID: '123', articleID: '456', paymentMethod: 'Visa', dateOfPurchase: '2024-10-01', totalPrice: 100.0, collectionMethod: 'delivery', orderStatus: 'confirmed' };
        const res = await request(app).post('/api/v1/orders').send(newOrder);
        expect(res.statusCode).toBe(201);
    });

    test('DELETE /api/v1/orders/:id - Should delete an order', async () => {
        const order = await Order.create({ orderID: '1', userID: '123', articleID: '456', paymentMethod: 'Visa', dateOfPurchase: '2024-10-01', totalPrice: 100.0, collectionMethod: 'delivery', orderStatus: 'confirmed' });
        const res = await request(app).delete(`/api/v1/orders/${order.id}`);
        expect(res.statusCode).toBe(200);
    });

});
