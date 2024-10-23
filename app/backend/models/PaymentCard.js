const { Sequelize, DataTypes, Model } = require('sequelize');
const User = require('./User');
const sequelize = new Sequelize('sqlite::memory:');

class PaymentCard extends Model {}

PaymentCard.init(
    {
        paymentMethodID: {
            type: DataTypes.STRING,
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

User.hasMany(PaymentCard);
PaymentCard.belongsTo(User, { foreignKey: 'userID' });


//console.log(PaymentCard === sequelize.models.PaymentCard);

module.exports = PaymentCard;