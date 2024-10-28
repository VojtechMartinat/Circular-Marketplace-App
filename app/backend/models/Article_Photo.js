const { Sequelize, DataTypes, Model} = require('sequelize');
const Article = require('./Article');
const Photo = require('./Photo');
const sequelize = require('../database/connect');

class Article_Photo extends Model {}

Article_Photo.init(
    {
        photoID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Photo,
                key: 'photoID',
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
    },
    {
        sequelize,
        modelName: 'Article_Photo',
    }
);

module.exports = Article_Photo;