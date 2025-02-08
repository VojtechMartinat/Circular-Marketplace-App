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
            id: {
                type: DataTypes.UUID, // Use UUID for unique identification
                defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs
                primaryKey: true, // Mark this as the primary key
                allowNull: false,
                unique: true,
            },
            userID: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            articleID: {
                type: DataTypes.UUID,
                allowNull: true,
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
