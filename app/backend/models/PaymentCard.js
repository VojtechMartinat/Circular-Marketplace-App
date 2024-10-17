const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class PaymentCard extends Model {}

PaymentCard.init(
    {
        paymentMethod: {
            type: DataTypes.STRING,
        },
        userID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cardHolder: {
            type: DataTypes.STRING,
        },
        sortCode: {
            type: DataTypes.INTEGER,
        },
        cardNumber: {
            type: DataTypes.INTEGER,
        },
        ExpiryDate: {
            type: DataTypes.DATE,
        },

    },
    {
        sequelize,
        modelName: 'PaymentCard',
    },
);

console.log(PaymentCard === sequelize.models.PaymentCard);