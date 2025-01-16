const request = require('supertest');
const { sequelize, Photo } = require('./Setup');
const app = require('../server');
process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, afterEach, describe, test, expect } = require('@jest/globals');


describe('Photo Controller Tests', () => {
    beforeAll(async () => {
        // Sync models with in-memory database before running tests
        await sequelize.sync({ force:  true});
    });

    afterAll(async () => {
        // Close the Sequelize connection after tests are done
        await sequelize.close();
    });

    beforeEach(async () => {
        // Clear data from tables before each test
        await sequelize.models.User.destroy({ where: {}, force: true });
        await sequelize.models.Article.destroy({ where: {}, force: true });
        await sequelize.models.Photo.destroy({ where: {}, force: true });

        // Insert necessary data for each test
        const newArticle = { articleID: '101', userID: '1', price: 100.0, articleTitle: 'Article 1', description: 'Description', dateAdded: new Date() };
        await request(app).post('/api/v1/articles').send(newArticle);
        const newUser = { userID: '1', username: 'user1', password: 'password', email: 'user1@example.com', wallet: 100.0 };
        await request(app).post('/api/v1/users').send(newUser);

    });

    afterEach(async () => {
        // Ensure no data remains in the database by truncating tables again
        await sequelize.models.Article.destroy({ where: {}, force: true });
        await sequelize.models.Photo.destroy({ where: {}, force: true });
        await sequelize.models.User.destroy({ where: {}, force: true });

    });



    test('POST /api/v1/photos - Should create a new photo', async () => {
        const path = require('path');
        const filePath = path.join(__dirname, 'test_photo.jpg'); // Path to your test photo
        console.log(filePath);

        // Perform the POST request with the file attachment
        const res = await request(app)
            .post('/api/v1/photos')
            .field('articleID', '101') // Add additional fields as form data
            .attach('image', filePath); // Attach the image file
        console.log(res.body);
        // Perform a GET request to verify the uploaded photo
        const res2 = await request(app).get('/api/v1/photos');
        console.log(res2.body);


        expect(res.body.photo.articleID).toBe('101');
        expect(res.body.photo.image).toBeDefined(); // Ensure the image was uploaded
        expect(res.statusCode).toBe(201);
    });

    test('GET /api/v1/photos - Should return all photos', async () => {
        // Create multiple photos
        await request(app).post('/api/v1/photos').send({ photoID: '1', articleID: '123' });
        await request(app).post('/api/v1/photos').send({ photoID: '2', articleID: '456' });

        const res = await request(app).get('/api/v1/photos');

        expect(res.statusCode).toBe(200);
        expect(res.body.photos.length).toBe(2); // Ensure two photos are retrieved
        expect(res.body.photos[0].photoID).toBe('1');
        expect(res.body.photos[1].photoID).toBe('2');
    });

    test('GET /api/v1/photos/:id - Should return a single photo by ID', async () => {
        // Create a photo and retrieve it by ID
        const createRes = await request(app).post('/api/v1/photos').send({ photoID: '1', articleID: '123' });
        const photoID = createRes.body.photo.photoID;

        const res = await request(app).get(`/api/v1/photos/${photoID}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.photo.photoID).toBe(photoID);
        expect(res.body.photo.articleID).toBe('123');
    });

    test('DELETE /api/v1/photos/:id - Should delete a photo by ID', async () => {
        // Create a photo and then delete it
        const createRes = await request(app).post('/api/v1/photos').send({ photoID: '1', articleID: '123' });
        const photoID = createRes.body.photo.photoID;

        const res = await request(app).delete(`/api/v1/photos/${photoID}`);

        expect(res.statusCode).toBe(204); // No content
        const fetchRes = await request(app).get(`/api/v1/photos/${photoID}`);
        expect(fetchRes.statusCode).toBe(404); // Photo should no longer exist
    });

    test('GET /api/v1/photos/:id - Should return 404 for a non-existent photo', async () => {
        const res = await request(app).get('/api/v1/photos/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Photo not found');
    });

    test('DELETE /api/v1/photos/:id - Should return 404 for a non-existent photo', async () => {
        const res = await request(app).delete('/api/v1/photos/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Photo not found');
    });

    test('PATCH /api/v1/photos/:id - Should update a photo by ID', async () => {
        // Create a photo and update it
        const createRes = await request(app).post('/api/v1/photos').send({ photoID: '1', articleID: '123' });
        const photoID = createRes.body.photo.photoID;

        const updatedData = { articleID: '456' };
        const res = await request(app).patch(`/api/v1/photos/${photoID}`).send(updatedData);

        expect(res.statusCode).toBe(200);
        expect(res.body.photo.articleID).toBe('456');

        const fetchRes = await request(app).get(`/api/v1/photos/${photoID}`);
        expect(fetchRes.body.photo.articleID).toBe('456');
    });

    test('PATCH /api/v1/photos/:id - Should return 404 for a non-existent photo', async () => {
        const updatedData = { articleID: '456' };
        const res = await request(app).patch('/api/v1/photos/999').send(updatedData);

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Photo not found');
    });
});
