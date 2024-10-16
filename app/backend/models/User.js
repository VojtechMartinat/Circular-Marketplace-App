const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class User extends Model {}

User.init(
    {
        // Model attributes are defined here
        userID: {
            type: DataTypes.STRING,
            allowNull: false,
            // allowNull defaults to true
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
            type: DataTypes.MONEY,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        rating: {
            type: DataTypes.INT,
            allowNull: true,
        }


    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'User', // We need to choose the model name
    },
);

// the defined model is the class itself
console.log(User === sequelize.models.User); // true