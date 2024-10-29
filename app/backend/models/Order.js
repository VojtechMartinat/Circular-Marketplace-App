const { Sequelize, DataTypes, Model } = require('sequelize');
const User = require('./User');
const PaymentCard = require('./PaymentCard');
const Article = require('./Article');
const sequelize = require('../database/connect')

class Order extends Model {}

Order.init(
    {
        // Model attributes are defined here
        orderID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        userID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: User,
                key: 'userID',
            },
        },

        paymentMethodID: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: PaymentCard,
                key: 'paymentMethodID',
            },
        },
        dateOfPurchase: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        totalPrice: {
            type: DataTypes.DOUBLE,
        },
        collectionMethod: {
            type: DataTypes.ENUM('delivery', 'collection')
        },
        orderStatus: {
            type: DataTypes.ENUM('purchased', 'shipped', 'collected'),
        },
    },
    {
        sequelize,
        modelName: 'Order',
    },
);



module.exports = Order;