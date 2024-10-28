const { Sequelize, DataTypes, Model } = require('sequelize');
const Tag = require('./Tag');
const Article = require('./Article');
const sequelize = require('../database/connect')

class Article_Tag extends Model {}

Article_Tag.init(
    {
        tagID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Tag,
                key: 'tagID',
            },
        },
        articleID: {
            type: DataTypes.BIGINT,
            allowNull: false,
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
        modelName: 'Article_Tag',
    },
);


module.exports = Article_Tag;