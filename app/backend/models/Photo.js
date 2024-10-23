const { Sequelize, DataTypes, Model } = require('sequelize');
const Article = require('./Article');
const sequelize = new Sequelize('sqlite::memory:');

class Photo extends Model {}

Photo.init(
    {
        photoID: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        articleID: {
            type: DataTypes.STRING,
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

//console.log(Photo === sequelize.models.Photo);

Article.hasMany(Photo);
Photo.belongsTo(Article, { foreignKey: 'articleID' });

module.exports = Photo;