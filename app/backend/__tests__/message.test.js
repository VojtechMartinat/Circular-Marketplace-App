const request = require('supertest');
const { sequelize } = require('../config/Setup');
const app = require('../server');

process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, test, expect, describe, afterEach } = require('@jest/globals');

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Drops existing tables and recreates them
});

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
    await sequelize.models.Message.destroy({ where: {}, force: true });
    const newUser = {
        userID: 1,
        username: 'user1',
        password: 'password',
        email: 'user1@example.com',
        wallet: 100.0 };
    await request(app).post('/api/v1/users').send(newUser)

    const newUser2= {
        userID: 2,
        username: 'user2',
        password: 'password2',
        email: 'user2@example.com',
        wallet: 100.0 };
    await request(app).post('/api/v1/users').send(newUser2)

    const newUser3 = {
        userID: 3,
        username: 'user3',
        password: 'password',
        email: 'user3@example.com',
        wallet: 100.0 };
    await request(app).post('/api/v1/users').send(newUser3)

    const newMessage = {
        senderID: 1,
        receiverID: 2,
        message: 'Hello, how are you?'
    };
    await request(app).post('/api/v1/messages').send(newMessage);
});

afterEach(async () => {
    await sequelize.models.Message.destroy({ where: {}, force: true });
});

describe('Message Controller Tests with Sequelize', () => {
    test('GET /api/v1/messages - Should return all messages', async () => {
        const res = await request(app).get('/api/v1/messages');
        expect(res.statusCode).toBe(200);
        expect(res.body.messages.length).toBe(1);
    });

    test('POST /api/v1/messages - Should create a new message', async () => {
        const newMessage = {
            senderID: 1,
            receiverID: 3,
            message: 'Hi user3!'
        };
        const res = await request(app).post('/api/v1/messages').send(newMessage);
        expect(res.statusCode).toBe(201);
        expect(res.body.message.senderID).toBe(1);
    });

    test('GET /api/v1/messages/:id - Should return a message by ID', async () => {

        const newMessage = {
            senderID: 1,
            receiverID: 3,
            message: 'Test message'
        };
        const postRes = await request(app).post('/api/v1/messages').send(newMessage);
        const messageID = postRes.body.message.messageID;

        const res = await request(app).get(`/api/v1/messages/${messageID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message.message).toBe('Test message');
    });

    test('GET /api/v1/messages/:id - Should return error if message is not found', async () => {
        const res = await request(app).get('/api/v1/messages/999');
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid UUID: 999');
    });

    test('PATCH /api/v1/messages/:id - Should update message information', async () => {
        const newMessage = {
            senderID: 1,
            receiverID: 3,
            message: 'Initial message'
        };
        const postRes = await request(app).post('/api/v1/messages').send(newMessage);
        const messageID = postRes.body.message.messageID;

        const updatedData = { message: 'Updated message' };
        const res = await request(app).patch(`/api/v1/messages/${messageID}`).send(updatedData);

        expect(res.statusCode).toBe(200);
    });

    test('DELETE /api/v1/messages/:id - Should delete a message', async () => {
        const newMessage = {
            senderID: 1,
            receiverID: 3,
            message: 'Message to delete'
        };
        const postRes = await request(app).post('/api/v1/messages').send(newMessage);
        const messageID = postRes.body.message.messageID;

        const res = await request(app).delete(`/api/v1/messages/${messageID}`);
        expect(res.statusCode).toBe(200);
    });

    test('GET /api/v1/messages/:senderID/:receiverID - Should return messages between two users', async () => {
        const message1 = {
            senderID: 1,
            receiverID: 3,
            message: 'Hey there!'
        };
        const message2 = {
            senderID: 3,
            receiverID: 1,
            message: 'Hello!'
        };
        await request(app).post('/api/v1/messages').send(message1);
        await request(app).post('/api/v1/messages').send(message2);

        const res = await request(app).get(`/api/v1/messages/1/3`);
        expect(res.statusCode).toBe(200);
        expect(res.body.messages.length).toBe(2);
        const res2 = await request(app).get(`/api/v1/messages/3/1`);
        expect(res2.statusCode).toBe(200);
        expect(res2.body.messages.length).toBe(2);

    });
});
