
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
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
                key: 'userID',
            },
        },
        orderID: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: Order,
                key: 'orderID',
            }
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
        dateAdded: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        state: {
            type: DataTypes.ENUM('uploaded','sold','archived','collected')
        },
    },
    {
        sequelize,
        modelName: 'Article',
    },
);

    return Article; // Return the defined model
};
