const request = require('supertest');
const { sequelize} = require('../config/Setup');
const app = require('../server');
const {TaskLog} = require('../models/initialise')
const {Task} = require('../models/initialise')

process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, afterEach, test, expect, describe } = require('@jest/globals');

describe('TaskLog Controller Tests', () => {
    beforeAll(async () => {
        // Sync database and clear previous entries
        await sequelize.sync({ force: true });
    });

    beforeEach(async () => {
        const task1 = { taskID: 1, description: 'Sample Task' }
        const res1 = await request(app).post('/api/v1/users').send(task1);
        console.log(task.statusCode)
        // Insert a TaskLog linked to the existing Task
        await TaskLog.create({
            taskID: task.taskID, // Use the real taskID
            timeTaken: 5000
        });
        // Add sample task logs before each test
        await TaskLog.create({ taskID: 1, timeTaken: 1200 });
    });

    afterEach(async () => {
        // Clear TaskLog table after each test
        await TaskLog.destroy({ where: {} });
    });

    afterAll(async () => {
        // Close database connection
        await sequelize.close();
    });

    test('Should retrieve all task logs', async () => {
        const res = await request(app).get('/api/v1/tasklogs');
        console.log()
        expect(res.status).toBe(200);
        expect(res.body.taskLogs).toBeInstanceOf(Array);
        expect(res.body.taskLogs.length).toBe(2);
        expect(res.body.taskLogs[0]).toHaveProperty('logID');
        expect(res.body.taskLogs[0]).toHaveProperty('taskID');
        expect(res.body.taskLogs[0]).toHaveProperty('timeTaken');
    });
});
