const request = require('supertest');
const { sequelize, Wishlist } = require('./Setup.js');
const app = require('../server');
const relations = require('../models/initialise');

process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, afterEach, test, expect, describe } = require('@jest/globals');

describe('Wishlist Controller Tests', () => {

    beforeAll(async () => {
        // Sync models with in-memory database before running tests
        await sequelize.sync({ force: true }); // Drops existing tables and recreates them

    });

    afterAll(async () => {
        // Close the Sequelize connection after tests are done
        await sequelize.close();
    });

    beforeEach(async () => {
        await sequelize.sync({ force: true }); // Resync to clear data for each test
    });

    afterEach(async () => {
<<<<<<< HEAD
        // Ensure that no data remains in the database by explicitly deleting it
        await Wishlist.destroy({ where: {} });
=======
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

        await request(app).delete(`/api/v1/wishlists/${res.body.id}`);


>>>>>>> 7a9c9ca (all comments acted on)
    });

    test('GET /api/v1/wishlists - Should return all wishlists as JSON', async () => {
        const newWishlist = { userID: '1', articleID: '101', totalPrice: 100.0 };

<<<<<<< HEAD
=======
        const res2 = await request(app).get('/api/v1/wishlists');
        expect(res2.statusCode).toBe(200);
        expect(res2.body.wishlist.length).toBe(1);
    });

    test('GET /api/v1/wishlists/:id - Should return a wishlist by ID', async () => {
        const newWishlist = { userID: '1', articleID: '101', totalPrice: 100.0 };
        const postRes = await request(app).post('/api/v1/wishlists').send(newWishlist);

        const res = await request(app).get(`/api/v1/wishlists/${postRes.body.wishlist.id}`);

        await request(app).get('/api/v1/wishlists');
>>>>>>> 7a9c9ca (all comments acted on)

        const res = await request(app).post('/api/v1/wishlists').send(newWishlist);
        console.log(res.body);
        expect(res.statusCode).toBe(200);
    });


});
