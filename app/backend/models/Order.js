const { DataTypes, Model } = require('sequelize');
const User = require('./User'); // Ensure User model is imported correctly
const PaymentCard = require('./PaymentCard'); // Ensure PaymentCard model is imported correctly

module.exports = (sequelize) => {
    class Order extends Model {}

    Order.init(
        {
            orderID: {
                type: DataTypes.BIGINT,
                allowNull: false,
                unique: true,
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
                type: DataTypes.ENUM('delivery', 'collection'),
            },
            orderStatus: {
                type: DataTypes.ENUM('purchased', 'shipped', 'collected'),
            },
        },
        {
            sequelize,
            modelName: 'Order',
        }
    );

    return Order; // Return the defined model
};
