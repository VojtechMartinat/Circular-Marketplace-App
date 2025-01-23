const request = require('supertest');
const { sequelize, User } = require('./Setup.js');
const app = require('../server');
const relations = require('../models/initialise');
process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, afterEach, test, expect, describe } = require('@jest/globals');
const { Tag } = require("./Setup");

describe('User Controller Tests', () => {

    beforeAll(async () => {
        // Sync models with in-memory database before running tests
        await sequelize.sync({ force: true }); // Drops existing tables and recreates them

    });

    afterAll(async () => {
        // Close the Sequelize connection after tests are done
        await sequelize.close();
    });

    beforeEach(async () => {
        await sequelize.sync({ force: true }); // Drops existing tables and recreates them

        await Tag.destroy({ where: {} });
    });

    afterEach(async () => {
        // Ensure that no data remains in the database by explicitly deleting it
        await Tag.destroy({ where: {} });
    });

    test('GET /api/v1/users - Should return an empty array if no users exist', async () => {
        const res = await request(app).get('/api/v1/users');
        expect(res.statusCode).toBe(200);
        expect(res.body.users).toEqual([]);  // Should return an empty array
    });

    test('GET /api/v1/users - Should return all users as JSON', async () => {
        const newUser = { userID: '1', username: 'john_doe', password: '1234', email: 'john@example.com', wallet: 100.0 };
        const newUser2 = { userID: '2', username: 'jane_doe', password: '5678', email: 'jane@example.com', wallet: 150.0 };

        // Create two users
        const res1 = await request(app).post('/api/v1/users').send(newUser);
        const res2 = await request(app).post('/api/v1/users').send(newUser2);

        // Get all users
        const res3 = await request(app).get('/api/v1/users');

        expect(res3.statusCode).toBe(200);
        expect(res3.body.users.length).toBe(2); // Should return two users
        expect(res3.body.users[0].username).toBe('john_doe');
        expect(res3.body.users[1].username).toBe('jane_doe');
    });



    test('POST /api/v1/users - Should create a new user', async () => {
        const newUser = {
            userID: '3',
            username: 'mike_doe',
            password: 'abcd1234',
            email: 'mike@example.com',
            wallet: 200.0
        };

        const res = await request(app)
            .post('/api/v1/users')
            .send(newUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.user.username).toBe('mike_doe');
        expect(res.body.user.email).toBe('mike@example.com');
    });

    test('GET /api/v1/users/:id - Should return 404 if user is not found', async () => {
        const res = await request(app).get('/api/v1/users/999');  // Non-existent user ID
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe('No user with id : 999');
    });

    test('DELETE /api/v1/users/:id - Should delete the user if they exist', async () => {
        const user = {
            userID: '4',
            username: 'delete_me',
            password: 'password',
            email: 'delete@example.com',
            wallet: 50.0,
        }

        const res2 = await request(app)
            .post('/api/v1/users')
            .send(user);


        const res = await request(app).delete(`/api/v1/users/${user.userID}`);


        expect(res.statusCode).toBe(200);
    });

    test('PUT /api/v1/users/:id - Should update user information', async () => {
        const user = {
            userID: '5',
            username: 'update_me',
            password: 'password',
            email: 'update@example.com',
            wallet: 75.0,
        };

        const res2 = await request(app)
            .post('/api/v1/users')
            .send(user);


        const updatedData = {
            email: 'updated@example.com',
        };

        const res = await request(app)
            .patch(`/api/v1/users/${user.userID}`)
            .send(updatedData);

        expect(res.statusCode).toBe(200);
    });
});
