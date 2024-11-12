const { DataTypes, Model } = require('sequelize');
const Tag = require('./Tag');
const Article = require('./Article');

module.exports = (sequelize) => {
    class Article_Tag extends Model {}

    Article_Tag.init(
        {
            tagID: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            articleID: {
                type: DataTypes.UUID,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Article_Tag',
        },
    );

    return Article_Tag; // Return the defined model
};
