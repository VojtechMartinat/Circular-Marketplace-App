const { Sequelize, DataTypes, Model } = require('sequelize');
const Article = require('./Article');
const sequelize = require('../database/connect')

class Photo extends Model {}

Photo.init(
    {
        photoID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true,
        },
        image: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        articleID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Article,
                key: 'articleID',
            }
        },
    },
    {
        sequelize,
        modelName: 'Photo',
    },
);


module.exports = Photo;