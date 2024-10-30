const request = require('supertest');
const { sequelize, Tag } = require('./Setup');
const app = require('../server');

beforeAll(async () => {
    await sequelize.sync();
});

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
    await Tag.destroy({ where: {} });
});

describe('Tag Controller Tests', () => {

    test('GET /api/v1/tags - Should return all tags as JSON', async () => {
        await Tag.bulkCreate([
            { tagID: '100', tagTitle: 'Furniture' },
            { tagID: '101', tagTitle: 'Electronics' },
        ]);

        const res = await request(app).get('/api/v1/tags');
        expect(res.statusCode).toBe(200);
        expect(res.body.tag.length).toBe(2);
        expect(res.body.tag[0].tagTitle).toBe('Furniture');
        expect(res.body.tag[1].tagTitle).toBe('Electronics');
    });

    test('POST /api/v1/tags - Should create a new tag', async () => {
        const newTag = { tagID: '102', tagTitle: 'Books' };
        const res = await request(app).post('/api/v1/tags').send(newTag);
        expect(res.statusCode).toBe(201);
        expect(res.body.tag.tagID).toBe('102');
        expect(res.body.tag.tagTitle).toBe('Books');
    });

    test('GET /api/v1/tags/:id - Should return a specific tag by ID', async () => {
        await Tag.create({ tagID: '100', tagTitle: 'Furniture' });
        const res = await request(app).get('/api/v1/tags/100');
        expect(res.statusCode).toBe(200);
        expect(res.body.tag.tagID).toBe('100');
        expect(res.body.tag.tagTitle).toBe('Furniture');
    });

    test('PUT /api/v1/tags/:id - Should update a tag title', async () => {
        const tag = await Tag.create({ tagID: '101', tagTitle: 'Old Title' });
        const updatedData = { tagTitle: 'Updated Title' };
        const res = await request(app).put(`/api/v1/tags/${tag.tagID}`).send(updatedData);
        expect(res.statusCode).toBe(200);
        expect(res.body.tag.tagTitle).toBe('Updated Title');
    });

    test('DELETE /api/v1/tags/:id - Should delete the tag if it exists', async () => {
        const tag = await Tag.create({ tagID: '102', tagTitle: 'Books' });
        const res = await request(app).delete(`/api/v1/tags/${tag.tagID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Tag deleted successfully');
    });

    test('GET /api/v1/tags/:id - Should return 404 if tag is not found', async () => {
        const res = await request(app).get('/api/v1/tags/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Tag not found');
    });

});
