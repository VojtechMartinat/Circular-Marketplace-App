const { DataTypes, Model } = require('sequelize');

// Export a function that takes the sequelize instance and returns the model
module.exports = (sequelize) => {
    class PaymentCard extends Model {}

    PaymentCard.init(
        {
            paymentMethodID: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            userID: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'Users', // Use the name of the model as defined in the User model
                    key: 'userID',
                },
            },
            cardHolder: {
                type: DataTypes.STRING,
            },
            sortCode: {
                type: DataTypes.INTEGER,
            },
            cardNumber: {
                type: DataTypes.STRING, // Change to STRING for card numbers to accommodate leading zeros
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
