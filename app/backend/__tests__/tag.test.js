const request = require('supertest');
const { sequelize, Tag } = require('./Setup'); // Import Sequelize and the Tag model from Setup.js
const app = require('../server'); // Import your Express app

// Sync the database before any tests run
beforeAll(async () => {
    await sequelize.sync();
});

// Close the database connection after all tests have run
afterAll(async () => {
    await sequelize.close();
});

// Clear data before each test to ensure isolation
beforeEach(async () => {
    await Tag.destroy({ where: {} });
});

describe('Tag Model Tests with Sequelize', () => {

    test('GET /api/v1/tags - Should return all tags as JSON', async () => {
        // Insert some tags into the database for testing
        await Tag.bulkCreate([
            { tagID: '100', tagTitle: 'Furniture' },
            { tagID: '101', tagTitle: 'Electronics' },
        ]);

        // Simulate GET request to fetch all tags
        const res = await request(app).get('/api/v1/tags');

        // Check the response status and structure
        expect(res.statusCode).toBe(200);
        expect(res.body.tags.length).toBe(2); // Should return 2 tags
        expect(res.body.tags[0].tagTitle).toBe('Furniture');
        expect(res.body.tags[1].tagTitle).toBe('Electronics');
    });

    test('POST /api/v1/tags - Should create a new tag', async () => {
        const newTag = { tagID: '102', tagTitle: 'Books' };

        // Simulate POST request to create a new tag
        const res = await request(app)
            .post('/api/v1/tags')
            .send(newTag); // Send new tag data

        // Check the response status and structure
        expect(res.statusCode).toBe(201); // Expect tag to be created successfully
        expect(res.body.tagID).toBe('102'); // Ensure the correct tag was created
        expect(res.body.tagTitle).toBe('Books');
    });

    test('GET /api/v1/tags/:id - Should return a specific tag by ID', async () => {
        // Insert a tag into the database for testing
        await Tag.create({ tagID: '100', tagTitle: 'Furniture' });

        // Simulate GET request to fetch the tag by ID
        const res = await request(app).get('/api/v1/tags/100');

        // Check the response status and structure
        expect(res.statusCode).toBe(200);
        expect(res.body.tagID).toBe('100');
        expect(res.body.tagTitle).toBe('Furniture');
    });

    test('PUT /api/v1/tags/:id - Should update a tag title', async () => {
        // Insert a tag to be updated
        const tag = await Tag.create({ tagID: '101', tagTitle: 'Old Title' });

        const updatedData = { tagTitle: 'Updated Title' };

        // Simulate PUT request to update the tag title
        const res = await request(app)
            .put(`/api/v1/tags/${tag.tagID}`)
            .send(updatedData);

        // Check the response status and structure
        expect(res.statusCode).toBe(200);
        expect(res.body.tagTitle).toBe('Updated Title'); // Ensure title is updated
    });

    test('DELETE /api/v1/tags/:id - Should delete the tag if it exists', async () => {
        // Insert a tag for deletion
        const tag = await Tag.create({ tagID: '102', tagTitle: 'Books' });

        // Simulate DELETE request to delete the tag by ID
        const res = await request(app).delete(`/api/v1/tags/${tag.tagID}`);

        // Check the response
        expect(res.statusCode).toBe(200); // Expect successful deletion
        expect(res.body.message).toBe('Tag deleted successfully');
    });

    test('GET /api/v1/tags/:id - Should return 404 if tag is not found', async () => {
        const res = await request(app).get('/api/v1/tags/999'); // Non-existent tag ID
        expect(res.statusCode).toBe(404); // Expect 404 not found
        expect(res.body.error).toBe('Tag not found');
    });

});
