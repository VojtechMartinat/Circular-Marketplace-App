const { Sequelize, DataTypes, Model } = require('sequelize');
const User = require('./User');
const Article = require('./Article');
const sequelize = require('../database/connect')

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
    },
    {
        sequelize,
        modelName: 'Wishlist',
    },
);


module.exports = Wishlist;