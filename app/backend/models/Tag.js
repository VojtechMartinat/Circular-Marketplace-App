// models/Tag.js
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Tag extends Model {}

    Tag.init(
        {
            tagID: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            tagTitle: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Tag',
        }
    );

    return Tag; // Return the defined model
};
