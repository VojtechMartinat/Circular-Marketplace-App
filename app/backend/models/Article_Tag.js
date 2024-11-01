const { DataTypes, Model } = require('sequelize');
const Tag = require('./Tag');
const Article = require('./Article');

module.exports = (sequelize) => {
    class Article_Tag extends Model {}

    Article_Tag.init(
        {
            tagID: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: Tag,
                    key: 'tagID',
                },
            },
            articleID: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: Article,
                    key: 'articleID',
                },
            },
        },
        {
            sequelize,
            modelName: 'Article_Tag',
        },
    );

    return Article_Tag; // Return the defined model
};
