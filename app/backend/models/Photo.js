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


Article.hasMany(Photo);
Photo.belongsTo(Article, { foreignKey: 'articleID' });

module.exports = Photo;