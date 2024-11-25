const request = require('supertest');
const { sequelize, Wishlist } = require('./Setup.js');
const app = require('../server');
process.env.DEBUG = 'sequelize:*';

process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, afterEach, test, expect, describe } = require('@jest/globals');
const { Article, User } = require('./Setup');

describe('Wishlist Controller Tests', () => {
    beforeAll(async () => {
        // Sync models with in-memory database before running tests
        await sequelize.sync({});
    });

    afterAll(async () => {
        // Close the Sequelize connection after tests are done
        await sequelize.close();
    });

    beforeEach(async () => {
        // Clear data from tables before each test
        await sequelize.models.User.destroy({ where: {}, force: true });
        await sequelize.models.Article.destroy({ where: {}, force: true });
        await sequelize.models.Wishlist.destroy({ where: {}, force: true });

        // Insert necessary data for each test
        const newUser = { userID: '1', username: 'user1', password: 'password', email: 'user1@example.com', wallet: 100.0 };
        const newArticle = { articleID: '101', userID: '1', price: 100.0, articleTitle: 'Article 1', description: 'Description', dateAdded: new Date() };
        await request(app).post('/api/v1/users').send(newUser);
        await request(app).post('/api/v1/articles').send(newArticle);
    });

    afterEach(async () => {
        // Ensure no data remains in the database by truncating tables again
        await sequelize.models.User.destroy({ where: {}, force: true });
        await sequelize.models.Article.destroy({ where: {}, force: true });
        await sequelize.models.Wishlist.destroy({ where: {}, force: true });

    });

    test('POST /api/v1/wishlists - Should create a new wishlist', async () => {
        const newWishlist = { userID: '1', articleID: '101', totalPrice: 100.0 };

        const res = await request(app).post('/api/v1/wishlists').send(newWishlist);
        expect(res.statusCode).toBe(201);
        expect(res.body.wishlist.totalPrice).toBe(100.0);

        const reset = await request(app).delete(`/api/v1/wishlists/${res.body.id}`);


    });

    test('GET /api/v1/wishlists - Should return all wishlists as JSON', async () => {

        const fetchRes = await request(app).get('/api/v1/wishlists');
        const wishlists = fetchRes.body.wishlist;
        if (wishlists && wishlists.length > 0) {
            for (const wishlist of wishlists) {
                await request(app).delete(`/api/v1/wishlists/${wishlist.id}`);
            }
        }

        const newWishlist = { userID: '1', articleID: '101', totalPrice: 100.0 };
        await request(app).post('/api/v1/wishlists').send(newWishlist);

        const res2 = await request(app).get('/api/v1/wishlists');
        expect(res2.statusCode).toBe(200);
        expect(res2.body.wishlist.length).toBe(1);
    });

    test('GET /api/v1/wishlists/:id - Should return a wishlist by ID', async () => {
        const newWishlist = { userID: '1', articleID: '101', totalPrice: 100.0 };
        const postRes = await request(app).post('/api/v1/wishlists').send(newWishlist);

        const res = await request(app).get(`/api/v1/wishlists/${postRes.body.wishlist.id}`);

        const res2 = await request(app).get('/api/v1/wishlists');

        expect(res.statusCode).toBe(200);
        expect(res.body.wishlist.totalPrice).toBe(100.0);
    });

    test('PATCH /api/v1/wishlists/:id - Should update a wishlist', async () => {
        const newWishlist = {id:'3' ,userID: '1', articleID: '101', totalPrice: 100.0 };
        const postRes = await request(app).post('/api/v1/wishlists').send(newWishlist);

        const updatedData = { totalPrice: 120.0 };
        const res = await request(app).patch(`/api/v1/wishlists/${postRes.body.wishlist.id}`).send(updatedData);
        expect(res.statusCode).toBe(200);

        const res2 = await request(app).get(`/api/v1/wishlists/${postRes.body.wishlist.id}`);
        expect(res2.body.wishlist.totalPrice).toBe(120.0);
    });

    test('DELETE /api/v1/wishlists/:id - Should delete a wishlist', async () => {
        const newWishlist = { userID: '1', articleID: '101', totalPrice: 100.0 };
        const postRes = await request(app).post('/api/v1/wishlists').send(newWishlist);

        const res = await request(app).delete(`/api/v1/wishlists/${postRes.body.wishlist.id}`);
        expect(res.statusCode).toBe(204); // No content
    });

    test('GET /api/v1/wishlists/:id - Should return 404 for non-existing wishlist', async () => {
        const res = await request(app).get('/api/v1/wishlists/999');
        console.log(res.error);
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Wishlist not found');

    });

    test('PATCH /api/v1/wishlists/:id - Should return 404 for non-existing wishlist', async () => {
        const updatedData = { totalPrice: 120.0 };
        const res = await request(app).patch('/api/v1/wishlists/9999').send(updatedData);
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Wishlist not found');
    });

    test('DELETE /api/v1/wishlists/:id - Should return 404 for non-existing wishlist', async () => {
        const res = await request(app).delete('/api/v1/wishlists/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Wishlist not found');
    });
});
