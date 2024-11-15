const { Sequelize } = require('sequelize');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

let sequelize;

if (isTest) {
    // Use SQLite in-memory database for testing
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',  // In-memory SQLite database
        logging: false,       // Disable logging for tests (optional)
    });
} else {
    // PostgreSQL configuration for production or development
    sequelize = new Sequelize('devdb',process.env.DB_USER,process.env.DB_PASS,{
        host: 'database-2.cv06umom2foy.eu-west-1.rds.amazonaws.com',
        dialect: "postgres"
    })
}

module.exports = sequelize;
