const { DataTypes, Model } = require('sequelize');
const User = require('./User');

// Export a function that takes the sequelize instance and returns the model
module.exports = (sequelize) => {
    class PaymentCard extends Model {}

    PaymentCard.init(
        {
            paymentMethodID: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            userID: {
                type: DataTypes.STRING(30),
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
            expiryDate: {
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            modelName: 'PaymentCard',
        }
    );

    return PaymentCard; // Return the defined model
};
