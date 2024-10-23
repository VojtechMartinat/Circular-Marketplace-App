const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');


const defineUserModel = (sequelize) => {
    class User extends Model {}
    User.init(
        {
            userID: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            wallet: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            location: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: 'User',
        },
    );

    return User; // Return the model after it's initialized
};

module.exports = defineUserModel;
