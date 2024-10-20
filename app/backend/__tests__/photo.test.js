const request = require('supertest');
const { sequelize, Photo } = require('./Setup');
const app = require('../server');

beforeAll(async () => {
    await sequelize.sync();
});

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
    await Photo.destroy({ where: {} });
});

describe('Photo Model Tests with Sequelize', () => {

    test('GET /api/v1/photos - Should return all photos', async () => {
        await Photo.bulkCreate([
            { photoID: '1', articleID: '123' },
            { photoID: '2', articleID: '456' },
        ]);

        const res = await request(app).get('/api/v1/photos');
        expect(res.statusCode).toBe(200);
        expect(res.body.photos.length).toBe(2);
    });

    test('POST /api/v1/photos - Should create a new photo', async () => {
        const newPhoto = { photoID: '1', articleID: '123' };
        const res = await request(app).post('/api/v1/photos').send(newPhoto);
        expect(res.statusCode).toBe(201);
    });

    test('DELETE /api/v1/photos/:id - Should delete a photo', async () => {
        const photo = await Photo.create({ photoID: '1', articleID: '123' });
        const res = await request(app).delete(`/api/v1/photos/${photo.id}`);
        expect(res.statusCode).toBe(200);
    });

});
