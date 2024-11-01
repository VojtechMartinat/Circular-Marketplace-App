// models/Wishlist.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connect'); // Make sure this is the correct path
const User = require('./User'); // Import User model
const Article = require('./Article'); // Import Article model

class Wishlist extends Model {}

Wishlist.init(
    {
        userID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: User,
                key: 'userID',
            },
        },
        articleID: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: Article,
                key: 'articleID',
            },
        },
        totalPrice: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Wishlist',
    },
);

module.exports = Wishlist; // Ensure the model is exported
