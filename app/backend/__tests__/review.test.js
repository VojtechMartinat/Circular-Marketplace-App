const request = require('supertest');
const { sequelize} = require('../config/Setup');
const app = require('../server');


process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, afterEach, test, expect, describe } = require('@jest/globals');

describe('Review Controller Tests', () => {
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
        await sequelize.models.Review.destroy({ where: {}, force: true });

        // Insert necessary data for each test
        const newUser1 = { userID: '1', username: 'user1', password: 'password', email: 'user1@example.com', wallet: 100.0 };
        const newUser2 = { userID: '2', username: 'user2', password: 'password', email: 'user2@example.com', wallet: 100.0 };
        const newArticle = { articleID: '101', userID: '1', price: 100.0, articleTitle: 'Article 1', description: 'Description', dateAdded: new Date() };
        await request(app).post('/api/v1/users').send(newUser1);
        await request(app).post('/api/v1/users').send(newUser2);
        await request(app).post('/api/v1/articles').send(newArticle);
    });

    afterEach(async () => {
        // Ensure no data remains in the database by truncating tables again
        await sequelize.models.User.destroy({ where: {}, force: true });
        await sequelize.models.Article.destroy({ where: {}, force: true });
        await sequelize.models.Review.destroy({ where: {}, force: true });

    });

    test('POST /api/v1/reviews - Should create a new review', async () => {
        const newReview = { userID: '1', articleID: '101', reviewer: '2', rating: 4, comment: 'test' };

        const res = await request(app).post('/api/v1/reviews').send(newReview);
        expect(res.statusCode).toBe(201);
        expect(res.body.review.rating).toBe(4);

        await request(app).delete(`/api/v1/reviews/${res.body.review.id}`);

    });

    test('GET /api/v1/reviews - Should return all reviews as JSON', async () => {

        const fetchRes = await request(app).get('/api/v1/reviews');
        const reviews = fetchRes.body.review;
        if (reviews && reviews.length > 0) {
            for (const review of reviews) {
                await request(app).delete(`/api/v1/reviews/${review.id}`);
            }
        }

        const newReview = { userID: '1', articleID: '101', reviewer: '2', rating: 4, comment: 'test' };
        await request(app).post('/api/v1/reviews').send(newReview);

        const res2 = await request(app).get('/api/v1/reviews');
        expect(res2.statusCode).toBe(200);
        expect(res2.body.review.length).toBe(1);
    });

    test('GET /api/v1/reviews/:id - Should return a review by ID', async () => {
        const newReview = { userID: '1', articleID: '101', reviewer: '2', rating: 4, comment: 'test' };
        const postRes = await request(app).post('/api/v1/reviews').send(newReview);

        await request(app).get(`/api/v1/reviews/${postRes.body.review.id}`);

        await request(app).get('/api/v1/reviews');

        const res2 = await request(app).get('/api/v1/reviews');
        expect(res2.statusCode).toBe(200);
        expect(res2.body.review.length).toBe(1);
    });

    test('GET /api/v1/reviews/:id - Should return a review by ID', async () => {
        const newReview = { id: '3', userID: '1', articleID: '101', reviewer: '2', rating: 4, comment: 'test' };
        const postRes = await request(app).post('/api/v1/reviews').send(newReview);


        const res2 = await request(app).get(`/api/v1/reviews/${postRes.body.review.reviewID}`);
        expect(res2.body.review.rating).toBe(4);

    });

    test('PATCH /api/v1/reviews/:id - Should update a review', async () => {
        const newReview = { reviewID: '3', userID: '1', articleID: '101', reviewer: '2', rating: 4, comment: 'test' };
        const postRes = await request(app).post('/api/v1/reviews').send(newReview);

        const updatedData = { rating: 5 };
        const res = await request(app).patch(`/api/v1/reviews/${postRes.body.review.reviewID}`).send(updatedData);
        expect(res.statusCode).toBe(200);

        const res2 = await request(app).get(`/api/v1/reviews/${postRes.body.review.reviewID}`);
        expect(res2.body.review.rating).toBe(5);
    });

    test('DELETE /api/v1/reviews/:id - Should delete a review', async () => {
        const newReview = { userID: '1', articleID: '101', reviewer: '2', rating: 4, comment: 'test' };
        const postRes = await request(app).post('/api/v1/reviews').send(newReview);

        const res = await request(app).delete(`/api/v1/reviews/${postRes.body.review.reviewID}`);
        expect(res.statusCode).toBe(204);
    });

    test('GET /api/v1/reviews/:id - Should return 404 for non-existing review', async () => {
        const res = await request(app).get('/api/v1/reviews/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('No review with id : 999');

    });

    test('PATCH /api/v1/reviews/:id - Should return 404 for non-existing review', async () => {
        const updatedData = { rating: 5 };
        const res = await request(app).patch('/api/v1/reviews/9999').send(updatedData);
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('No review with id : 9999');
    });

    test('DELETE /api/v1/reviews/:id - Should return 404 for non-existing review', async () => {
        const res = await request(app).delete('/api/v1/reviews/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('No review with id: 999');
    });
});
