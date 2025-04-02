const request = require('supertest');
const { sequelize} = require('../config/Setup');
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
        expect(res.body.article).toEqual([]);
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
        expect(res.body.article.userID).toBe("1");
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
        const res = await request(app).get('/api/v1/articles/999');
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

    test('GET /api/v1/articles/unsold - Should return all unsold articles', async () => {
        const newArticle = { articleID: '1',
            userID: 1,
            articleTitle: 'Chair',
            description: 'xxxx',
            price: 30,
            dateAdded: '2024-10-10',
            state: 'uploaded' };
        const newArticle2 = { articleID: '2',
            userID: 1,
            articleTitle: 'Table',
            description: 'xxxx',
            price: 20,
            dateAdded: '2024-10-10',
            state: 'sold' };
        await request(app).post('/api/v1/articles').send(newArticle)
        await request(app).post('/api/v1/articles').send(newArticle2)

        const res = await request(app).get(`/api/v1/articles/unsold`);
        expect(res.statusCode).toBe(200);
        expect(res.body.article.length).toBe(1);
    });

    test('PUT /api/v1/articles/:id - Should update an article successfully', async () => {
        // First, create an article to update
        const newArticle = {
            articleID: '123e4567-e89b-12d3-a456-426614174000',
            userID: 1,
            articleTitle: 'Old Title',
            description: 'Old description',
            price: 50.0,
            state: 'new'
        };

        await request(app).post('/api/v1/articles').send(newArticle);

        // Update the article
        const updatedArticleData = {
            articleTitle: 'Updated Title',
            description: 'Updated description',
            price: 75.0
        };

        const res = await request(app)
            .patch(`/api/v1/articles/${newArticle.articleID}`)
            .send(updatedArticleData);
        expect(res.statusCode).toBe(200);
        expect(res.body.article).toBeDefined();
    });

    test('PUT /api/v1/articles/:id - Should return 404 if article does not exist', async () => {
        const nonExistentArticleID = '00000000-0000-0000-0000-000000000000';

        const res = await request(app)
            .put(`/api/v1/articles/${nonExistentArticleID}`)
            .send({ articleTitle: 'New Title' });

        expect(res.statusCode).toBe(404);
    });

    test('GET /api/v1/articles/:id/photos - Should return photos for an article', async () => {
        // First, create an article
        const newArticle = {
            articleID: '123e4567-e89b-12d3-a456-426614174000',
            userID: 1,
            articleTitle: 'Test Article',
            description: 'Test description',
            price: 100.0,
            state: 'new'
        };
        await request(app).post('/api/v1/articles').send(newArticle);

        // Create photos for the article
        const newPhoto = {
            photoID: '456e7890-e12b-34c5-d678-901234567890',
            articleID: newArticle.articleID,
            image: 'photo1.jpg'
        };
        await request(app).post('/api/v1/photos').send(newPhoto);

        // Fetch photos for the article
        const res = await request(app).get(`/api/v1/articles/${newArticle.articleID}/photos`);

        expect(res.statusCode).toBe(200);
        expect(res.body.photos).toBeDefined();
    });

    test('GET /api/v1/articles/:id/photo - Should return a photo for an article', async () => {
        const newArticle = {
            articleID: '123e4567-e89b-12d3-a456-426614174000',
            userID: 1,
            articleTitle: 'Test Article',
            description: 'Test description',
            price: 100.0,
            state: 'new'
        };
        await request(app).post('/api/v1/articles').send(newArticle);

        const newPhoto = {
            photoID: '456e7890-e12b-34c5-d678-901234567890',
            articleID: newArticle.articleID,
            image: 'photo1.jpg'
        };
        await request(app).post('/api/v1/photos').send(newPhoto);

        const res = await request(app).get(`/api/v1/articles/${newArticle.articleID}/photo`);

        expect(res.statusCode).toBe(200);
        expect(res.body.photo).toBeDefined();
    });



});
