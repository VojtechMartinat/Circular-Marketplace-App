const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Tag extends Model {}

const defineTagModel = (sequelize) => {

    Tag.init(
        {
            tagID: {
                type: DataTypes.STRING,
                allowNull: false,
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
    return Tag;
};

module.exports = defineTagModel;

console.log(Tag === sequelize.models.Tag);