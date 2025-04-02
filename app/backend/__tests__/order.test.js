const { sequelize} = require('../config/Setup');
const request = require('supertest');
const app = require('../server');
process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, describe, test,expect, afterEach,} = require('@jest/globals');
const { jest } = require('@jest/globals');



beforeAll(async () => {
    await sequelize.sync({ force: true  });
});

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
    // Clear data from tables before each test
    await sequelize.models.User.destroy({ where: {}, force: true });
    await sequelize.models.Order.destroy({ where: {}, force: true });
    await sequelize.models.Article.destroy({ where: {}, force: true });


    // Insert necessary data for each test
    const newUser = { userID: '1', username: 'user1', password: 'password', email: 'user1@example.com', wallet: 100.0 };
    const newUser2 = { userID: '2', username: 'user2', password: 'password', email: 'user2@example.com', wallet: 100.0 };
    await request(app).post('/api/v1/users').send(newUser)
    await request(app).post('/api/v1/users').send(newUser2)
    const newArticle = { articleID: '1',
        userID: 1,
        articleTitle: 'Table',
        description: 'xxxx',
        tagID: 100.0,
        price: 20,
        dateAdded: '2024-10-10',
        state: 'uploaded' };
    const newArticle2 = { articleID: '2',
        userID: 1,
        articleTitle: 'Chair',
        description: 'xxxx',
        tagID: 100.0,
        price: 30,
        dateAdded: '2024-10-10',
        state: 'uploaded' };
    await request(app).post('/api/v1/articles').send(newArticle2)
    await request(app).post('/api/v1/articles').send(newArticle)
    const newCard = {
        paymentMethodID: 1,
        userID: '1',
        cardHolder: 'John Doe',
        sortCode: 123456,
        cardNumber: 1234567812345678,
        ExpiryDate: '2025-12-01',
    };
    await request(app)
        .post('/api/v1/paymentcards')
        .send(newCard);

});

afterEach(async () => {
    // Ensure no data remains in the database by truncating tables again
    await sequelize.models.User.destroy({ where: {}, force: true });
    await sequelize.models.Order.destroy({ where: {}, force: true });
    await sequelize.models.Article.destroy({ where: {}, force: true });
    await sequelize.models.PaymentCard.destroy({ where: {}, force: true });
});

describe('Order Controller Tests', () => {


    test('GET /api/v1/orders - Should return an empty array if no orders exist', async () => {
        const res = await request(app).get('/api/v1/orders');
        expect(res.statusCode).toBe(200);
        expect(res.body.orders).toEqual([]);
    });


    test('GET /api/v1/orders - Should return all orders', async () => {
        const res1 = await request(app).post('/api/v1/orders').send({
            userID: 2,
            paymentMethodID: 1,
            dateOfPurchase: '2024-10-01',
            collectionMethod: 'delivery',
            orderStatus: 'confirmed',
            articles: [{ articleID: '1' }],
        })
        const res2 = await request(app).post('/api/v1/orders').send({
            userID: 2,
            paymentMethodID: 1,
            dateOfPurchase: '2024-10-01',
            collectionMethod: 'delivery',
            orderStatus: 'confirmed',
            articles: [{ articleID: '2' }],
        })
        const res = await request(app).get('/api/v1/orders');
        expect(res.statusCode).toBe(200);
        expect(res.body.orders).toBeDefined(); // Ensure orders is defined
        expect(res.body.orders.length).toBe(2);
    });

    test('GET /api/v1/orders/:id - Should return a single order by ID', async () => {
        const res1 = await request(app).post('/api/v1/orders').send({
            userID: 2,
            paymentMethodID: 1,
            dateOfPurchase: '2024-10-01',
            collectionMethod: 'delivery',
            orderStatus: 'confirmed',
            articles: [{ articleID: '1' }],
        });

        const res = await request(app).get(`/api/v1/orders/${res1.body.order.orderID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.order.userID).toBe('2');
    });

    test('POST /api/v1/orders - Should create a new order', async () => {
        const res1 = await request(app).post('/api/v1/orders').send({
            userID: 2,
            paymentMethodID: 1,
            dateOfPurchase: '2024-10-01',
            collectionMethod: 'delivery',
            orderStatus: 'confirmed',
            articles: [{ articleID: '1' }],
        })

        expect(res1.statusCode).toBe(201);
        expect(res1.body.order.totalPrice).toBe(22);
    });

    test('GET /api/v1/orders/:id - Should return error  if order is not found', async () => {
        const res = await request(app).get('/api/v1/orders/9999');  // Non-existent ID
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('No order with id : 9999');
    });


    test('DELETE /api/v1/orders/:id - Should delete an order', async () => {
        const res1 = await request(app).post('/api/v1/orders').send({
            userID: 2,
            paymentMethodID: 1,
            dateOfPurchase: '2024-10-01',
            collectionMethod: 'delivery',
            orderStatus: 'confirmed',
            articles: [{ articleID: '1' }],
        })

        const res = await request(app).delete(`/api/v1/orders/${res1.body.order.orderID}`);
        expect(res.statusCode).toBe(200);
    });

    test('PUT /api/v1/orders/:id - Should update an existing order', async () => {
        const res1 = await request(app).post('/api/v1/orders').send({
            userID: 2,
            paymentMethodID: 1,
            dateOfPurchase: '2024-10-01',
            collectionMethod: 'delivery',
            orderStatus: 'confirmed',
            articles: [{ articleID: '1' }],
        })

        const res = await request(app).patch(`/api/v1/orders/${res1.body.order.orderID}`).send({ orderStatus: 'shipped' });
        expect(res.statusCode).toBe(200);
        const res2 = await request(app).get(`/api/v1/orders`);
        expect(res2.body.orders[0].orderStatus).toBe('shipped');
    });

    test('Nonexisting article for order', async () => {
        const res1 = await request(app).post('/api/v1/orders').send({
            userID: 1,
            paymentMethodID: 1,
            dateOfPurchase: '2024-10-01',
            collectionMethod: 'delivery',
            orderStatus: 'confirmed',
            articles: [{ articleID: '3' }],
        })
        expect(res1.statusCode).toBe(500);
    });

    test('Referenced article assigned to another order already', async () => {

        await request(app).post('/api/v1/orders').send({
            userID: 2,
            paymentMethodID: 1,
            dateOfPurchase: '2024-10-01',
            collectionMethod: 'delivery',
            orderStatus: 'confirmed',
            articles: [{ articleID: '1' }],
        })
        const res2 = await request(app).post('/api/v1/orders').send({
            userID: 2,
            paymentMethodID: 1,
            dateOfPurchase: '2024-12-01',
            collectionMethod: 'delivery',
            orderStatus: 'confirmed',
            articles: [{ articleID: '1' }],
        })
        expect(res2.statusCode).toBe(500);

    });

        test('Should return articles for a valid order ID', async () => {
            const order = await request(app).post('/api/v1/orders').send({
                userID: 2,
                paymentMethodID: 1,
                dateOfPurchase: '2024-10-01',
                collectionMethod: 'delivery',
                orderStatus: 'confirmed',
                articles: [{ articleID: '1' }],
            })
            const res = await request(app).get(`/api/v1/orders/${order.body.order.orderID}/articles`);
            expect(res.statusCode).toBe(200);
            expect(res.body.articles[0].articleID).toBe(1);
            expect(res.body.articles[0].articleTitle).toBe('Table');
        });

    test('GET /api/v1/orders/:id/article - Should return the article if order exists', async () => {
        // Create an order
        const orderResponse = await request(app).post('/api/v1/orders').send({
            userID: 2,
            paymentMethodID: 1,
            dateOfPurchase: '2024-10-01',
            collectionMethod: 'delivery',
            orderStatus: 'confirmed',
            articles: [{ articleID: '1' }],
        });

        const newOrder = orderResponse.body;

        const res = await request(app).get(`/api/v1/orders/${newOrder.order.orderID}/articles`);

        expect(res.statusCode).toBe(200);
        expect(res.body.articles[0].articleTitle).toBe('Table');
        expect(res.body.articles[0].price).toBe(20.0);
    });


});
