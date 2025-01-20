const request = require('supertest');
const { sequelize, Article } = require('../config/Setup');
const app = require('../server');

process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, test, expect, describe, afterEach} = require('@jest/globals');

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Drops existing tables and recreates them
});

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
    // Sync models with in-memory database before running tests
    await sequelize.models.User.destroy({ where: {}, force: true });
    const newUser = {
        userID: 1,
        username: 'user1',
        password: 'password',
        email: 'user1@example.com',
        wallet: 100.0 };
    await request(app).post('/api/v1/users').send(newUser)


});

afterEach(async () => {
    // Ensure no data remains in the database by truncating tables again
    await sequelize.models.User.destroy({ where: {}, force: true });
});


describe('Article Controller Tests with Sequelize', () => {

    test('GET /api/v1/articles - Should return an empty array if no articles exist', async () => {
        const res = await request(app).get('/api/v1/articles');
        expect(res.statusCode).toBe(200);
        expect(res.body.article).toEqual([]);  // Should return an empty array
    });

    test('GET /api/v1/articles - Should return all articles as JSON', async () => {
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

        const res3 = await request(app).get('/api/v1/articles');

        expect(res3.statusCode).toBe(200);
        expect(res3.body.article.length).toBe(2);

    });

    test('GET /api/v1/articles/:id - Should return an article by ID', async () => {
        const newArticle2 = { articleID: '2',
            userID: 1,
            articleTitle: 'Chair',
            description: 'xxxx',
            price: 30,
            dateAdded: '2024-10-10',
            state: 'uploaded' };
        await request(app).post('/api/v1/articles').send(newArticle2)

        const res = await request(app).get(`/api/v1/articles/${newArticle2.articleID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.article.userID).toBe(1);
    });




    test('POST /api/v1/articles - Should create a new article', async () => {
        const newArticle2 = { articleID: '2',
            userID: 1,
            articleTitle: 'Chair',
            description: 'xxxx',
            price: 30,
            dateAdded: '2024-10-10',
            state: 'uploaded' };
        const res = await request(app).post('/api/v1/articles').send(newArticle2)

        expect(res.statusCode).toBe(201);
    });

    test('GET /api/v1/articles/:id - Should return error if article is not found', async () => {
        const res = await request(app).get('/api/v1/articles/999');  // Non-existent user ID
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('No article with id : 999');
    });

    test('DELETE /api/v1/articles/:id - Should delete the article if they exist', async () => {
        const newArticle2 = { articleID: '2',
            userID: 1,
            articleTitle: 'Chair',
            description: 'xxxx',
            price: 30,
            dateAdded: '2024-10-10',
            state: 'uploaded' };
        await request(app).post('/api/v1/articles').send(newArticle2)

        const res = await request(app).delete(`/api/v1/articles/${newArticle2.articleID}`);
        expect(res.statusCode).toBe(200);
    });

    test('PUT /api/v1/articles/:id - Should update article information', async () => {
        const newArticle2 = { articleID: '2',
            userID: 1,
            articleTitle: 'Chair',
            description: 'xxxx',
            price: 30,
            dateAdded: '2024-10-10',
            state: 'uploaded' };
        await request(app).post('/api/v1/articles').send(newArticle2)

        const updatedData = {
            price: 40,
        };

        const res = await request(app)
            .patch(`/api/v1/users/${newArticle2.articleID}`)
            .send(updatedData);

        expect(res.statusCode).toBe(200);
    });

    //TODO article - tag link table tests
});
