const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connect')

class Tag extends Model {}

Tag.init(
    {
       tagID: {
           type: DataTypes.UUID,
           allowNull: false,
           primaryKey: true,
           defaultValue : DataTypes.UUIDV4
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