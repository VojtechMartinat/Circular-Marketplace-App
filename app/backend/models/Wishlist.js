const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Wishlist extends Model {}
const defineWishlistModel = (sequelize) => {

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
return Wishlist;
};

module.exports = defineWishlistModel;


console.log(Wishlist === sequelize.models.Wishlist);