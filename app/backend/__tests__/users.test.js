const request = require('supertest');
const app = require('../server');
const sequelize = require('./Setup');
const Task = require('../models/User.js');

beforeAll(async () => {
    await sequelize.sync();
});

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
    await Task.destroy({ where: {} }); // Clear data before each test
});

describe('Task Controller Tests with Sequelize', () => {

    test('GET /api/v1/users - Should return all users as JSON', async () => {
        // Insert some users into the database for testing
        await User.bulkCreate([
            { userID: '1', username: 'john_doe', password: '1234', email: 'john@example.com', wallet: 100.0 },
            { userID: '2', username: 'jane_doe', password: '5678', email: 'jane@example.com', wallet: 150.0 },
        ]);

        // Simulate GET request to fetch all users
        const res = await request(app).get('/api/v1/users');

        // Check the response status and structure
        expect(res.statusCode).toBe(200);
        expect(res.body.users.length).toBe(2); // Should return 2 users
        expect(res.body.users[0].username).toBe('john_doe');
        expect(res.body.users[1].email).toBe('jane@example.com');
    });
});
