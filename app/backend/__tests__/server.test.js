const request = require('supertest');
const { sequelize} = require('../config/Setup');
const app = require('../server');
const { Sequelize } = require('sequelize');

process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, test, expect, describe, afterEach} = require('@jest/globals');

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Drops existing tables and recreates them
});

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
});

afterEach(async () => {
});


describe('Database Connection', () => {

    test('should synchronize the database successfully', async () => {
        await expect(sequelize.sync()).resolves.not.toThrow();
    });

    test('should throw an error if database synchronization fails', async () => {
        const { Sequelize } = require('sequelize');
        const invalidSequelize = new Sequelize('invalid_db', 'user', 'pass', { dialect: 'postgres' });

        await expect(invalidSequelize.sync()).rejects.toThrow();
    });

});

