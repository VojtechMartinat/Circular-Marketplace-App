const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Photo extends Model {}
const definePhotoModel = (sequelize) => {

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
    return Photo;
};

module.exports = definePhotoModel;


console.log(Photo === sequelize.models.Photo);