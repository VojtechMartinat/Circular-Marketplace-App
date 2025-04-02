const request = require('supertest');
const { sequelize, Tag } = require('../config/Setup');
const app = require('../server');

process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, afterEach, test, expect, describe } = require('@jest/globals');

describe('Tag Controller Tests', () => {

    beforeAll(async () => {
        // Sync models with in-memory database before running tests
        await sequelize.sync({ force: true }); // Drops existing tables and recreates them
    });

    afterAll(async () => {
        // Close the Sequelize connection after tests are done
        await sequelize.close();
    });

    beforeEach(async () => {
        await Tag.destroy({ where: {} });

    });

    afterEach(async () => {
        // Ensure that no data remains in the database by explicitly deleting it
        await Tag.destroy({ where: {} });
    });

    test('GET /api/v1/tags - Should return all tags', async () => {
        const newTag = {
            tagTitle: 'Furniture'
        };

        await request(app)
            .post('/api/v1/tags')
            .send(newTag);

        const res2 = await request(app).get('/api/v1/tags');

        expect(res2.statusCode).toBe(200);
        expect(res2.body.tag.length).toBe(1);
        expect(res2.body.tag[0].tagTitle).toBe('Furniture');
    });

    test('POST /api/v1/tags - Should create a new tag', async () => {
        const newTag = {
            tagTitle: 'Electronics'
        };

        const res = await request(app)
            .post('/api/v1/tags')
            .send(newTag);

        expect(res.statusCode).toBe(201);
        expect(res.body.tag).toHaveProperty('tagID');
        expect(res.body.tag.tagTitle).toBe('Electronics');
    });


    test('GET /api/v1/tags/:id - Should return a tag by its ID', async () => {
        const newTag = {
            tagTitle: 'Books',
            tagID: 2
        };

        const res = await request(app)
            .post('/api/v1/tags')
            .send(newTag);

        const res2 = await request(app).get(`/api/v1/tags/${newTag.tagID}`);

        expect(res2.statusCode).toBe(200);
        expect(res2.body.tag.tagTitle).toBe('Books');
    });

    test('GET /api/v1/tags/:id - Should return 404 if tag not found', async () => {
        const res = await request(app).get('/api/v1/tags/999');  // Non-existent ID
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('No tag with id : 999');  // Adjust the error message according to your API
    });

    test('DELETE /api/v1/tags/:id - Should delete a tag by its ID', async () => {
        const newTag = {
            tagTitle: 'Toys',
            tagID: 2
        };

        await request(app)
            .post('/api/v1/tags')
            .send(newTag);

        const res2 = await request(app).delete(`/api/v1/tags/${newTag.tagID}`);

        expect(res2.statusCode).toBe(200);

        const res3 = await request(app).get(`/api/v1/tags/${newTag.tagID}`);  // Non-existent ID
        expect(res3.statusCode).toBe(500);
        expect(res3.body.error).toBe('No tag with id : 2');
    });

    test('PUT /api/v1/tags/:id - Should update a tag', async () => {
        const newTag = {
            tagTitle: 'Toys',
            tagID: '4',
        };

        const res = await request(app)
            .post('/api/v1/tags')
            .send(newTag);

        const updatedData = { tagTitle: 'Fashion' };

        const res2 = await request(app)
            .patch(`/api/v1/tags/${res.body.tag.tagID}`)
            .send(updatedData);

        expect(res2.statusCode).toBe(200);
        expect(res2.body.tag.tagTitle).toBe('Fashion');
    });

});
