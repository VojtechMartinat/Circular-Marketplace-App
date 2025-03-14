
const { DataTypes, Model } = require('sequelize');
const User = require('./User');
const Order = require('./Order');

module.exports = (sequelize) => {
    class Article extends Model {}

Article.init(
    {
        articleID: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue : DataTypes.UUIDV4
        },
        userID: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        orderID: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        articleTitle: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },

        state: {
            type: DataTypes.ENUM('uploaded','sold','archived','collected')
        },
        shippingType: {
            type: DataTypes.ENUM('shipping', 'collection', 'both'),
            allowNull: false,
            defaultValue: 'both'
        },

    },
    {
        sequelize,
        modelName: 'Article',
    },
);

    return Article; // Return the defined model
};
