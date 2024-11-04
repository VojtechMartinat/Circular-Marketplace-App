const { Sequelize, DataTypes, Model } = require('sequelize');
const User = require('./User');
const sequelize = require('../database/connect')

class PaymentCard extends Model {}

PaymentCard.init(
    {
        paymentMethodID: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue : DataTypes.UUIDV4
        },
        userID: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
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




module.exports = PaymentCard;