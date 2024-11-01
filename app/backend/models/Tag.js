// models/Tag.js
const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Tag extends Model {}

    Tag.init(
        {
            tagID: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
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
