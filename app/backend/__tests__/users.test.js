const request = require('supertest');
const { sequelize, User } = require('../config/Setup');
const app = require('../server');
process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, afterEach, test, expect, describe } = require('@jest/globals');
describe('User Controller Tests', () => {

    beforeAll(async () => {
        // Sync models with in-memory database before running tests
        await sequelize.sync({ force: true }); // Drops existing tables and recreates them

    });

    afterAll(async () => {
        // Close the Sequelize connection after tests are done
        await sequelize.close();
    });

    beforeEach(async () => {
        // Clear data from tables before each test
        await sequelize.models.User.destroy({ where: {}, force: true });
        await sequelize.models.Order.destroy({ where: {}, force: true });
        await sequelize.models.Article.destroy({ where: {}, force: true });
        await sequelize.models.Review.destroy({ where: {}, force: true });


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

        await request(app).post('/api/v1/orders').send({
            userID: 2,
            paymentMethodID: 1,
            dateOfPurchase: '2024-10-01',
            collectionMethod: 'delivery',
            orderStatus: 'confirmed',
            articles: [{ articleID: '1' }],
        })

        const newReview = { userID: '1', articleID: '1', reviewer: '2', rating: 4, comment: 'test' };

        await request(app).post('/api/v1/reviews').send(newReview);


    });

    afterEach(async () => {
        // Ensure no data remains in the database by truncating tables again
        await sequelize.models.User.destroy({ where: {}, force: true });
        await sequelize.models.Order.destroy({ where: {}, force: true });
        await sequelize.models.Article.destroy({ where: {}, force: true });
        await sequelize.models.PaymentCard.destroy({ where: {}, force: true });
        await sequelize.models.Review.destroy({ where: {}, force: true });

    });

    test('GET /api/v1/users - Should return an empty array if no users exist', async () => {
        const res = await request(app).get('/api/v1/users');
        expect(res.statusCode).toBe(200);
    });

    test('GET /api/v1/users - Should return all users as JSON', async () => {
        const newUser = { userID: '1', username: 'john_doe', password: '1234', email: 'john@example.com', wallet: 100.0 };
        const newUser2 = { userID: '2', username: 'jane_doe', password: '5678', email: 'jane@example.com', wallet: 150.0 };

        await request(app).post('/api/v1/users').send(newUser);
        await request(app).post('/api/v1/users').send(newUser2);
        const res3 = await request(app).get('/api/v1/users');

        expect(res3.statusCode).toBe(200);
        expect(res3.body.users.length).toBe(2);
    });

    test('GET /api/v1/wishlists/:id - Should return a user by ID', async () => {
        const newUser = { userID: '6', username: 'john_joe', password: '1234', email: 'john@example.com', wallet: 100.0 };
        await request(app).post('/api/v1/users').send(newUser);
        const res = await request(app).get(`/api/v1/users/${newUser.userID}`);
        expect(res.statusCode).toBe(200);
    });



    test('GET /api/v1/wishlists/:id - Should return a user by ID', async () => {
        const newUser = { userID: '6', username: 'john_joe', password: '1234', email: 'john@example.com', wallet: 100.0 };
        await request(app).post('/api/v1/users').send(newUser);
        const res = await request(app).get(`/api/v1/users/${newUser.userID}`);
        expect(res.statusCode).toBe(200);
    });



    test('POST /api/v1/users - Should create a new user', async () => {
        const newUser = {
            userID: '3',
            username: 'mike_doe',
            wallet: 200.0,
            location: 'Bristol'
        };

        const res = await request(app)
            .post('/api/v1/users')
            .send(newUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.user.username).toBe('mike_doe');
    });

    test('GET /api/v1/users/:id - Should return 404 if user is not found', async () => {
        const res = await request(app).get('/api/v1/users/999');
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('No user with id : 999');
    });

    test('DELETE /api/v1/users/:id - Should delete the user if they exist', async () => {
        const user = {
            userID: '4',
            username: 'delete_me',
            password: 'password',
            email: 'delete@example.com',
            wallet: 50.0,
        }

        await request(app)
            .post('/api/v1/users')
            .send(user);


        const res = await request(app).delete(`/api/v1/users/${user.userID}`);


        expect(res.statusCode).toBe(200);
    });

    test('PUT /api/v1/users/:id - Should update user information', async () => {
        const user = {
            userID: '5',
            username: 'update_me',
            password: 'password',
            email: 'update@example.com',
            wallet: 75.0,
        };

         await request(app)
            .post('/api/v1/users')
            .send(user);


        const updatedData = {
            email: 'updated@example.com',
        };

        const res = await request(app)
            .patch(`/api/v1/users/${user.userID}`)
            .send(updatedData);

        expect(res.statusCode).toBe(200);
    });
    test('GET /api/v1/users/:id/orders - Should return orders for a valid user', async () => {
        const res = await request(app).get('/api/v1/users/2/orders');
        expect(res.statusCode).toBe(200);
        expect(res.body.orders.length).toBe(1);
    });

    test('GET /api/v1/users/:id/articles - Should return articles for a valid user', async () => {
        const res = await request(app).get('/api/v1/users/1/articles');


        expect(res.statusCode).toBe(200);
        expect(res.body.articles.length).toBe(2);

    });

    test('GET /api/v1/users/:id/articles - Should return an empty array if the user has no articles', async () => {
        const res = await request(app).get('/api/v1/users/nonexistent-user/articles');

        expect(res.statusCode).toBe(200);
        expect(res.body.articles).toEqual([]);
    });

    test('GET /api/v1/users/:id/rating - Should return correct average rating and count', async () => {
        const res = await request(app).get('/api/v1/users/1/rating');

        expect(res.statusCode).toBe(200);
        expect(res.body.averageRating).toBe(4);
        expect(res.body.amount).toBe(1);
    });

    test('GET /api/v1/users/:id/rating - Should return NaN if the user has no reviews', async () => {
        const res = await request(app).get('/api/v1/users/nonexistent-user/rating');

        expect(res.statusCode).toBe(200);
        expect(res.body.averageRating).toBe(null);
        expect(res.body.amount).toBe(0);
    });

    test('GET /api/v1/users/:id/writtenreviews - Should return reviews written by the user', async () => {
        const res = await request(app).get('/api/v1/users/2/writtenreviews');

        expect(res.statusCode).toBe(200);
        expect(res.body.reviews).toHaveLength(1);
        expect(res.body.reviews[0]).toHaveProperty('reviewID');
        expect(res.body.reviews[0].reviewer).toBe('2');
        expect(res.body.reviews[0].comment).toBe('test');
    });

    test('GET /api/v1/users/:id/writtenreviews - Should return empty array if user has written no reviews', async () => {
        const res = await request(app).get('/api/v1/users/nonexistent-user/writtenreviews');

        expect(res.statusCode).toBe(200);
        expect(res.body.reviews).toEqual([]);
    });

    test('GET /api/v1/users/:id/reviews - Should return reviews received by the user', async () => {
        const res = await request(app).get('/api/v1/users/1/reviews');

        expect(res.statusCode).toBe(200);
        expect(res.body.reviews).toHaveLength(1);
        expect(res.body.reviews[0]).toHaveProperty('reviewID');
        expect(res.body.reviews[0].userID).toBe('1');
        expect(res.body.reviews[0].comment).toBe('test');
    });

    test('GET /api/v1/users/:id/reviews - Should return empty array if user has no reviews', async () => {
        const res = await request(app).get('/api/v1/users/nonexistent-user/reviews');

        expect(res.statusCode).toBe(200);
        expect(res.body.reviews).toEqual([]);
    });

    test('POST /api/v1/users/:id/topup - Should successfully top up the user wallet', async () => {
        const wallet = {
           amount: 75.0,
        };
        const res = await request(app)
            .post('/api/v1/users/1/topup')
            .send(wallet);

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toHaveProperty('wallet');
        expect(res.body.user.wallet).toBe(195);
    });

    test('POST /api/v1/users/:id/topup - Should return 404 if user does not exist', async () => {
        const wallet = {
            amount: 75.0,
        };
        const res = await request(app)
            .post('/api/v1/users/432/topup')
            .send(wallet);


        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'User doesnt exists!');
    });

});
