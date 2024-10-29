const request = require('supertest');
const { createArticle, getAllArticles, getArticle, updateArticle, deleteArticle } = require('../controllers/articles');
const { sequelize, Article } = require('./Setup.js');
const app = require('../server');

beforeAll(async () => {
    await sequelize.sync();
});

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
    await Article.destroy({ where: {} }); // Clear data before each test
});

describe('Article Controller Tests with Sequelize', () => {

    test('GET /api/v1/articles - Should return all articles as JSON', async () => {
        await request(app)
            .post('/api/v1/articles')
            .send({
                articleID: '1',
                userID: '123',
                articleTitle: 'Table',
                description: 'xxxx',
                tagID: 100.0,
                price: 20,
                dateAdded: '2024-10-10',
                state: 'uploaded'
            });

        await request(app)
            .post('/api/v1/articles')
            .send({
                articleID: '2',
                userID: '1345',
                articleTitle: 'Chair',
                description: 'xxxx',
                tagID: 100.0,
                price: 10,
                dateAdded: '2024-10-10',
                state: 'sold'
            });

        const res = await request(app).get('/api/v1/articles');

        expect(res.statusCode).toBe(200);
        expect(res.body.article.length).toBe(2);
        expect(res.body.article[0].userID).toBe('123');
        expect(res.body.article[0].price).toBe(20);
    });

    test('GET /api/v1/articles - Should return an empty array if no articles exist', async () => {
        // Ensure the database is empty
        await Article.destroy({ where: {} });

        // Simulate GET request to fetch all
        const res = await request(app).get('/api/v1/articles');

        // Check the response status and structure
        expect(res.statusCode).toBe(200);
        expect(res.body.article).toEqual([]); // Should return an empty array
    });

    test('POST /api/v1/articles - Should create a new article', async () => {
        const newArticle = {
            articleID: '1',
            userID: '123',
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

        expect(res.statusCode).toBe(201);
        expect(res.body.article.userID).toBe('123');
        expect(res.body.article.articleTitle).toBe('Table');
    });

    test('GET /api/v1/articles/:id - Should return 404 if article is not found', async () => {
        const res = await request(app).get('/api/v1/articles/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('No article with id : 999');
    });

    test('DELETE /api/v1/articles/:id - Should delete the article if it exists', async () => {
        const article = await Article.create({
            articleID: '1',
            userID: '123',
            articleTitle: 'Table',
            description: 'xxxx',
            tagID: 100.0,
            price: 20,
            dateAdded: '2024-10-10',
            state: 'uploaded'
        });

        const res = await request(app).delete(`/api/v1/articles/${article.articleID}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.article).toBeNull();
    });

    test('PUT /api/v1/articles/:id - Should update article information', async () => {
        // Insert to be updated
        const article = await Article.create({
            articleID: '1',
            userID: '123',
            articleTitle: 'Table',
            description: 'xxxx',
            tagID: 100.0,
            price: 20,
            dateAdded: '2024-10-10',
            state: 'uploaded'
        });

        // Update the description
        const updatedData = {
            description: 'New description',
        };

        const res = await request(app)
            .put(`/api/v1/articles/${article.articleID}`)
            .send(updatedData);

        expect(res.statusCode).toBe(200);
        expect(res.body.article.description).toBe('New description');
    });
});
