const request = require('supertest');
const { sequelize, Photo } = require('./Setup');
const app = require('../server');
process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, describe, test,expect,} = require('@jest/globals');


beforeAll(async () => {
    await sequelize.sync();
});

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
    await Photo.destroy({ where: {} });
});

describe('Photo Controller Tests', () => {

    test('GET /api/v1/photos - Should return all photos', async () => {
        await request(app).post('/api/v1/photos').send({ photoID: '1', articleID: '123' });
        await request(app).post('/api/v1/photos').send({ photoID: '2', articleID: '456' });

        const res = await request(app).get('/api/v1/photos');
        expect(res.statusCode).toBe(200);
        expect(res.body.photo.length).toBe(2);
        expect(res.body.photo[0].photoID).toBe('1');
    });

    test('POST /api/v1/photos - Should create a new photo', async () => {
        const newPhoto = { photoID: '1', articleID: '123' };
        const res = await request(app).post('/api/v1/photos').send(newPhoto);
        expect(res.statusCode).toBe(201);
        expect(res.body.photo.photoID).toBe('1');
    });

    test('GET /api/v1/photos/:id - Should return a single photo by ID', async () => {
        const createResponse = await request(app).post('/api/v1/photos').send({ photoID: '1', articleID: '123' });
        const photoID = createResponse.body.photo.photoID;

        const res = await request(app).get(`/api/v1/photos/${photoID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.photo.photoID).toBe('1');
    });

    test('DELETE /api/v1/photos/:id - Should delete a photo', async () => {
        const createResponse = await request(app).post('/api/v1/photos').send({ photoID: '1', articleID: '123' });
        const photoID = createResponse.body.photo.photoID;

        const res = await request(app).delete(`/api/v1/photos/${photoID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.photo).toBeUndefined();
    });

});
