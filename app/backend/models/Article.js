const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connect')
const User = require('./User');
const Tag = require('./Tag');
const Order = require("./Order");

class Article extends Model {}

Article.init(
    {
        articleID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
        },
        userID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: User,
                key: 'userID',
            },
        },
        orderID: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: Order,
                key: 'orderID',
            }
        },
        articleTitle: {
            type: DataTypes.STRING,
        },
        description: {
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
            type: DataTypes.ENUM('uploaded','sold','archived','collected')
        },
    },
    {
        sequelize,
        modelName: 'Article',
    },
);

//console.log(Article === sequelize.models.Article);
Order.hasMany(Article);
Article.belongsTo(Order, { foreignKey: 'orderID' });

User.hasMany(Article);
Article.belongsTo(User, { foreignKey: 'userID' });

module.exports = Article;
