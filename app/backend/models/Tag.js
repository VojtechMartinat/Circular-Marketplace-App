const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Tag extends Model {}

Tag.init(
    {
       tagID: {
           type: DataTypes.STRING,
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

//console.log(Tag === sequelize.models.Tag);

module.exports = Tag;