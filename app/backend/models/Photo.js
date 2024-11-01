const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
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
                    // Reference the Article model later
                    model: 'Articles', // Use the model name as a string
                    key: 'articleID',
                }
            },
        },
        {
            sequelize,
            modelName: 'Photo',
        },
    );

    return Photo; // Return the initialized model
};
