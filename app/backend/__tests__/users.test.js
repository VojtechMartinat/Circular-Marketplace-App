const request = require('supertest');
const { sequelize, User } = require('./Setup.js');
const app = require('../server');


beforeAll(async () => {
    await sequelize.sync();
});

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
    await User.destroy({ where: {} });
});

describe('User Controller Tests with Sequelize', () => {

    test('GET /api/v1/users - Should return all users as JSON', async () => {
        await User.bulkCreate([
            { userID: '1', username: 'john_doe', password: '1234', email: 'john@example.com', wallet: 100.0 },
            { userID: '2', username: 'jane_doe', password: '5678', email: 'jane@example.com', wallet: 150.0 },
        ]);

        const res = await request(app).get('/api/v1/users');

        expect(res.statusCode).toBe(200);
        expect(res.body.users.length).toBe(2);
        expect(res.body.users[0].username).toBe('john_doe');
        expect(res.body.users[1].email).toBe('jane@example.com');
    });

    test('GET /api/v1/users - Should return an empty array if no users exist', async () => {
        await User.destroy({ where: {} });

        const res = await request(app).get('/api/v1/users');

        expect(res.statusCode).toBe(200);
        expect(res.body.users).toEqual([]);
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
        expect(res.body.username).toBe('mike_doe');
        expect(res.body.email).toBe('mike@example.com');
    });

    test('GET /api/v1/users/:id - Should return 404 if user is not found', async () => {
        const res = await request(app).get('/api/v1/users/999');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('User not found');
    });

    test('DELETE /api/v1/users/:id - Should delete the user if they exist', async () => {

        const user = await User.create({
            userID: '4',
            username: 'delete_me',
            password: 'password',
            email: 'delete@example.com',
            wallet: 50.0,
        });


        const res = await request(app).delete(`/api/v1/users/4`);


        expect(res.statusCode).toBe(200); // Expect successful deletion
        expect(res.body.message).toBe('User deleted successfully');
    });

    test('PUT /api/v1/users/:id - Should update user information', async () => {

        const user = await User.create({
            userID: '5',
            username: 'update_me',
            password: 'password',
            email: 'update@example.com',
            wallet: 75.0,
        });


        const updatedData = {
            email: 'updated@example.com',
        };

        const res = await request(app)
            .put(`/api/v1/users/${user.userID}`)
            .send(updatedData);


        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe('updated@example.com'); // Ensure email is updated
    });


});
