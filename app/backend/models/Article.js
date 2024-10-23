const { Sequelize, DataTypes, Model } = require('sequelize');
const User = require('./User');
const Tag = require('./Tag');
const sequelize = new Sequelize('sqlite::memory:');

class Article extends Model {}

Article.init(
    {
        articleID: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        userID: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: User,
                key: 'userID',
            },
        },
        articleTitle: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        tagID: {
            type: DataTypes.STRING,
            references: {
                model: Tag,
                key: 'tagID',
            }
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
            type: DataTypes.ENUM('uploaded','sold','archived','collected')
        },
    },
    {
        sequelize,
        modelName: 'Article',
    },
);

//console.log(Article === sequelize.models.Article);
Article.hasMany(Tag, { foreignKey: 'tagID' });
Tag.belongsTo(Article);

User.hasMany(Article);
Article.belongsTo(User, { foreignKey: 'userID' });

module.exports = Article;
