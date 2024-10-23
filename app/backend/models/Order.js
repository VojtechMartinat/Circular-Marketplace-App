const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Order extends Model {}
const defineOrderModel = (sequelize) => {
    Order.init(
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
                type: DataTypes.DOUBLE,
            },
            collectionMethod: {
                type: DataTypes.ENUM('delivery', 'colletion')
            },
            orderStatus: {
                type: DataTypes.ENUM('confirmed', 'dispatched', 'collected'),
            },


        },
        {
            sequelize,
            modelName: 'Order',
        },
    );
    return Order;

};

module.exports = defineOrderModel;

console.log(Order === sequelize.models.Order);