const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class User extends Model {}

User.init(
    {
        // Model attributes are defined here
        orderID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        articleID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateOfPurchase: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        totalPrice: {
            type: DataTypes.MONEY,
        },
        collectionMethod: {
            type: DataTypes.ENUM('delivery', 'colletion')
        },
        orderStatus: {
            type: DataTypes.ENUM('confirmed', 'depached'),
        }

    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'User', // We need to choose the model name
    },
);

// the defined model is the class itself
console.log(User === sequelize.models.User); // true