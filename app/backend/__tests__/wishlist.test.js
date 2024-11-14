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
        // Ensure that no data remains in the database by explicitly deleting it
        await Wishlist.destroy({ where: {} });
    });

    test('GET /api/v1/wishlists - Should return all wishlists as JSON', async () => {
        const newWishlist = { userID: '1', articleID: '101', totalPrice: 100.0 };


        const res = await request(app).post('/api/v1/wishlists').send(newWishlist);
        console.log(res.body);
        expect(res.statusCode).toBe(200);
    });


});
