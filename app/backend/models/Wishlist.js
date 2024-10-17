const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Wishlist extends Model {}

Wishlist.init(
    {
        userID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        articleID: {
            type: DataTypes.STRING,
            allowNull: false,
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

console.log(Wishlist === sequelize.models.Wishlist);