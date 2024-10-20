const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Article extends Model {}
const defineArticleModel = (sequelize) => {
    Article.init(
        {
            articleID: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            userID: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            articleTitle: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.STRING,
            },
            tagID: {
                type: DataTypes.STRING,
            },
            price: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            dateAdded: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            state: {
                type: DataTypes.ENUM('uploaded', 'sold', 'archived', 'collected')
            },
        },
        {
            sequelize,
            modelName: 'Article',
        },
    );
    return Article;
};

module.exports = defineArticleModel;


console.log(Article === sequelize.models.Article);