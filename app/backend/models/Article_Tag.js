const { Sequelize, DataTypes, Model } = require('sequelize');
const Tag = require('./Tag');
const Article = require('./Article');
const sequelize = require('../database/connect')

class Article_Tag extends Model {}

Article_Tag.init(
    {
        tagID: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Tag,
                key: 'tagID',
            },
        },
        articleID: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Article,
                key: 'articleID',
            },
        },
    },
    {
        sequelize,
        modelName: 'Article_Tag',
    },
);


module.exports = Article_Tag;