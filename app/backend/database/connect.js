const { Sequelize } = require('sequelize');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

let sequelize;

if (isTest) {
    //SQLite in-memory database for testing
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,       });
} else {
    sequelize = new Sequelize(
        'postgres',
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: 'database-2.cv06umom2foy.eu-west-1.rds.amazonaws.com',
            dialect: 'postgres',
        }
    );
}

module.exports = sequelize;
