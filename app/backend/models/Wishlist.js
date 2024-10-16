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
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Wishlist', // We need to choose the model name
    },
);

// the defined model is the class itself
console.log(Wishlist === sequelize.models.Wishlist); // true