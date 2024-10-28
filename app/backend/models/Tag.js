const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connect')

class Tag extends Model {}

Tag.init(
    {
       tagID: {
           type: DataTypes.BIGINT,
           allowNull: false,
           primaryKey: true,
       },
       tagTitle: {
           type: DataTypes.STRING,
           allowNull: false,
       },
    },
    {
        sequelize,
        modelName: 'Tag',
    },
);


module.exports = Tag;