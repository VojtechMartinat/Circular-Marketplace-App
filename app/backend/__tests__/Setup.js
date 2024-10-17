const { Sequelize } = require('sequelize');
const Task = require('../models/'); //TODO add path to final models

// Setup in-memory database with Sequelize using SQLite
const sequelize = new Sequelize('sqlite::memory:', {
    logging: false, // Disable logging to make the test output cleaner
});

// Sync database before running __tests__
beforeAll(async () => {
    await sequelize.authenticate(); // Connect to the in-memory DB
    await sequelize.sync(); // Synchronize all models with the database
});

afterAll(async () => {
    await sequelize.close(); // Close the connection after __tests__
});

beforeEach(async () => {
    // Clear data from the Task table before each test
    await Task.destroy({ where: {} });
});

module.exports = sequelize;
