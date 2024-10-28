const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connect')

class User extends Model {}

User.init(
    {

        userID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        wallet: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        rating: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        }


    },
    {
        sequelize,
        modelName: 'User',
    },
);


module.exports = User;
