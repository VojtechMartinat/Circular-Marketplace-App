// models/Wishlist.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connect'); // Make sure this is the correct path
const User = require('./User'); // Import User model
const Article = require('./Article'); // Import Article model

module.exports = (sequelize) => {
    class Wishlist extends Model {
    }

    Wishlist.init(
        {
            userID: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: User,
                    key: 'userID',
                },
            },
            articleID: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: Article,
                    key: 'articleID',
                },
            },
            totalPrice: {
                type: DataTypes.DOUBLE,
            },
        },
        {
            sequelize,
            modelName: 'Wishlist',
        },
    );

    return Wishlist; // Ensure the model is exported
};
