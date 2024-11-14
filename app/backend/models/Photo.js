const { DataTypes, Model } = require('sequelize');
const Article = require('./Article');

module.exports = (sequelize) => {
    class Photo extends Model {}

    Photo.init(
        {
            photoID: {
                type: DataTypes.UUID,
                allowNull: false,
                unique: true,
                primaryKey: true,
                defaultValue : DataTypes.UUIDV4,
            },
            image: {
                type: DataTypes.BLOB,
                allowNull: false,
            },
            articleID: {
                type: DataTypes.UUID,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Photo',
        },
    );

    return Photo; // Return the initialized model
};
