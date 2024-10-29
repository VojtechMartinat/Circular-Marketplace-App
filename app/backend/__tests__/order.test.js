const { sequelize, Order } = require('./Setup');
const { createOrder, getAllOrders, getOrder, updateOrder, deleteOrder } = require('../controllers/orders');
const request = require('supertest');
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

describe('Order Controller Tests', () => {

    test('GET /api/v1/orders - Should return all orders', async () => {
        // Replace bulkCreate with createOrder controller calls
        await request(app).post('/api/v1/orders').send({
            orderID: '1', userID: '123', articleID: '456', paymentMethod: 'Visa', dateOfPurchase: '2024-10-01', totalPrice: 100.0, collectionMethod: 'delivery', orderStatus: 'confirmed'
        });
        await request(app).post('/api/v1/orders').send({
            orderID: '2', userID: '456', articleID: '789', paymentMethod: 'MasterCard', dateOfPurchase: '2024-10-02', totalPrice: 200.0, collectionMethod: 'delivery', orderStatus: 'dispatched'
        });

        const res = await request(app).get('/api/v1/orders');
        expect(res.statusCode).toBe(200);
        expect(res.body.order.length).toBe(2);
    });

    test('POST /api/v1/orders - Should create a new order', async () => {
        const newOrder = { orderID: '3', userID: '789', articleID: '101', paymentMethod: 'Visa', dateOfPurchase: '2024-10-03', totalPrice: 150.0, collectionMethod: 'pickup', orderStatus: 'pending' };
        const res = await request(app).post('/api/v1/orders').send(newOrder);
        expect(res.statusCode).toBe(201);
        expect(res.body.order.orderID).toBe('3');
    });

    test('GET /api/v1/orders/:id - Should return a single order by ID', async () => {
        const orderResponse = await request(app).post('/api/v1/orders').send({
            orderID: '4', userID: '234', articleID: '567', paymentMethod: 'Amex', dateOfPurchase: '2024-10-04', totalPrice: 180.0, collectionMethod: 'delivery', orderStatus: 'confirmed'
        });
        const res = await request(app).get(`/api/v1/orders/${orderResponse.body.order.orderID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.order.orderID).toBe('4');
    });

    test('PUT /api/v1/orders/:id - Should update an existing order', async () => {
        const orderResponse = await request(app).post('/api/v1/orders').send({
            orderID: '5', userID: '345', articleID: '678', paymentMethod: 'PayPal', dateOfPurchase: '2024-10-05', totalPrice: 120.0, collectionMethod: 'pickup', orderStatus: 'pending'
        });
        const res = await request(app).put(`/api/v1/orders/${orderResponse.body.order.orderID}`).send({ orderStatus: 'dispatched' });
        expect(res.statusCode).toBe(200);
        expect(res.body.order[0]).toBe(1);
    });

    test('DELETE /api/v1/orders/:id - Should delete an order', async () => {
        const orderResponse = await request(app).post('/api/v1/orders').send({
            orderID: '6', userID: '456', articleID: '789', paymentMethod: 'Visa', dateOfPurchase: '2024-10-06', totalPrice: 90.0, collectionMethod: 'delivery', orderStatus: 'confirmed'
        });
        const res = await request(app).delete(`/api/v1/orders/${orderResponse.body.order.orderID}`);
        expect(res.statusCode).toBe(200);
        const deletedOrder = await Order.findOne({ where: { orderID: '6' } });
        expect(deletedOrder).toBeNull();
    });

});
