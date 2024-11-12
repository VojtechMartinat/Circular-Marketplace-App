const request = require('supertest');
const { sequelize, Article } = require('./Setup.js');
const app = require('../server');
const setupAssociations = require('../models/associations');

process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, test, expect, describe} = require('@jest/globals');

beforeAll(async () => {
    // Sync models with in-memory database before running tests
    await sequelize.sync({ force: true }); // Drops existing tables and recreates them
    await setupAssociations();
    console.log('Tables created successfully!');
});

afterAll(async () => {
    // Close the Sequelize connection after tests are done
    await sequelize.close();
});

beforeAll(async () => {
    // Sync models with in-memory database before running tests
    await sequelize.sync({ force: true }); // Drops and recreates all tables
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('Tables:', tables);  // Log all tables to verify they exist
});

describe('Article Controller Tests with Sequelize', () => {

    test('POST /api/v1/articles - Should create a new article', async () => {
        const newArticle = {
            articleID: '1',
            userID: null,  // Test with no userID (or ensure user exists first)
            articleTitle: 'Table',
            description: 'xxxx',
            tagID: 100.0,
            price: 20,
            dateAdded: '2024-10-10',
            state: 'uploaded'
        };

        const res = await request(app)
            .post('/api/v1/articles')
            .send(newArticle);
        console.log(res.body); // Log the response body to inspect the error details
        expect(res.statusCode).toBe(201);

    });
});
