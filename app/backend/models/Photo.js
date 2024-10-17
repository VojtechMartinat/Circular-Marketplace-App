const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Photo extends Model {}

Photo.init(
    {
        photoID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        articleID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Photo',
    },
);

console.log(Photo === sequelize.models.Photo);