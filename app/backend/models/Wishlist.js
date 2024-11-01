const { Sequelize, DataTypes, Model } = require('sequelize');
const User = require('./User');
const Article = require('./Article');
const sequelize = require('../database/connect')

class Wishlist extends Model {}

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
        }
    },
    {
        sequelize,
        modelName: 'Wishlist',
    },
);


module.exports = Wishlist;