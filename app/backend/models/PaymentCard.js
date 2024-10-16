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
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'PaymentCard', // We need to choose the model name
    },
);

// the defined model is the class itself
console.log(PaymentCard === sequelize.models.PaymentCard); // true