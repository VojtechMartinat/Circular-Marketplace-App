const { Sequelize, DataTypes, Model } = require('sequelize');
const User = require('./User');
const sequelize = require('../database/connect')

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