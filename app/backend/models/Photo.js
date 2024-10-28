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
        },
        image: {
            type: DataTypes.BLOB,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'Photo',
    },
);


module.exports = Photo;