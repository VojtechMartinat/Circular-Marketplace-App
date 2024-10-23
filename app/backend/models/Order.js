const { Sequelize, DataTypes, Model } = require('sequelize');
const User = require('./User');
const PaymentCard = require('./PaymentCard');
const Article = require('./Article');
const sequelize = new Sequelize('sqlite::memory:');

class Order extends Model {}

Order.init(
    {
        // Model attributes are defined here
        orderID: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        userID: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: User,
                key: 'userID',
            },
        },
        articleID: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: Article,
                key: 'articleID',
            },
        },
        paymentMethodID: {
            type: DataTypes.STRING,
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
            type: DataTypes.ENUM('delivery', 'colletion')
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

//console.log(Order === sequelize.models.Order);

Order.hasMany(Article, { foreignKey: 'articleID' });
Article.belongsTo(Order);

User.hasMany(Order);
Order.belongsTo(User, { foreignKey: 'userID' });

Order.belongsTo(PaymentCard, { foreignKey: 'paymentMethodID' });
module.exports = Order;