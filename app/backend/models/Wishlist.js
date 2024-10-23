const { Sequelize, DataTypes, Model } = require('sequelize');
const User = require('./User');
const Article = require('./Article');
const sequelize = new Sequelize('sqlite::memory:');

class Wishlist extends Model {}

Wishlist.init(
    {
        userID: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: User,
                key: 'userID',
            },
        },
        articleID: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: Article,
                key: 'articleID',
            },
        },
        totalPrice: {
            type: DataTypes.DOUBLE,
        },
    },
    {
        sequelize,
        modelName: 'Wishlist',
    },
);

//console.log(Wishlist === sequelize.models.Wishlist);

Wishlist.hasMany(Article, { foreignKey: 'articleID' });
Article.belongsTo(Wishlist);

Wishlist.belongsTo(User, { foreignKey: 'userID' });
module.exports = Wishlist;