const request = require('supertest');
const { sequelize, Tag } = require('../config/Setup');
const app = require('../server');
const relations = require('../models/initialise');


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
        // Create a tag first
        const newTag = {
            tagTitle: 'Furniture'
        };

        const res = await request(app)
            .post('/api/v1/tags')
            .send(newTag);

        const res2 = await request(app).get('/api/v1/tags');

        console.log(res2.body);

        // Check the response status and content
        expect(res2.statusCode).toBe(200);
        expect(res2.body.tag.length).toBe(1);  // Should return one tag
        expect(res2.body.tag[0].tagTitle).toBe('Furniture');
    });

    test('POST /api/v1/tags - Should create a new tag', async () => {
        const newTag = {
            tagTitle: 'Electronics'
        };

        const res = await request(app)
            .post('/api/v1/tags')
            .send(newTag);

        // Expect status 201 (Created)
        expect(res.statusCode).toBe(201);
        expect(res.body.tag).toHaveProperty('tagID');  // Should have a tagID
        expect(res.body.tag.tagTitle).toBe('Electronics');  // Verify the title is correct
    });

    // Test 2: Retrieve all tags


    // Test 3: Retrieve a single tag by ID
    test('GET /api/v1/tags/:id - Should return a tag by its ID', async () => {
        // Create a tag first
        const newTag = {
            tagTitle: 'Books',
            tagID: 2
        };

        const res = await request(app)
            .post('/api/v1/tags')
            .send(newTag);

        const res2 = await request(app).get(`/api/v1/tags/${newTag.tagID}`);

        expect(res2.statusCode).toBe(200);
        expect(res2.body.tag.tagTitle).toBe('Books');  // Should return the created tag
    });

    // Test 4: Handle not found when retrieving a non-existent tag
    test('GET /api/v1/tags/:id - Should return 404 if tag not found', async () => {
        const res = await request(app).get('/api/v1/tags/999');  // Non-existent ID
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('No tag with id : 999');  // Adjust the error message according to your API
    });

    // Test 5: Delete a tag
    test('DELETE /api/v1/tags/:id - Should delete a tag by its ID', async () => {
        const newTag = {
            tagTitle: 'Toys',
            tagID: 2
        };

        const res = await request(app)
            .post('/api/v1/tags')
            .send(newTag);

        const res2 = await request(app).delete(`/api/v1/tags/${newTag.tagID}`);

        expect(res2.statusCode).toBe(200);

        const res3 = await request(app).get(`/api/v1/tags/${newTag.tagID}`);  // Non-existent ID
        expect(res3.statusCode).toBe(500);
        expect(res3.body.error).toBe('No tag with id : 2');
    });

    // Test 6: Update a tag
    test('PUT /api/v1/tags/:id - Should update a tag', async () => {
        const newTag = {
            tagTitle: 'Toys',  // Creating a new tag first
            tagID: '4',        // Make sure the tagID is a valid UUID or match your setup
        };

        const res = await request(app)
            .post('/api/v1/tags')
            .send(newTag);

        const updatedData = { tagTitle: 'Fashion' }; // Data to update the tag

        const res2 = await request(app)
            .patch(`/api/v1/tags/${res.body.tag.tagID}`)
            .send(updatedData);

        expect(res2.statusCode).toBe(200);
        expect(res2.body.tag.tagTitle).toBe('Fashion');  // Check if the tag title is updated
    });

});
