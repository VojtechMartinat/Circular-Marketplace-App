const {DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model {}

    User.init(
        {
            userID: {
                type: DataTypes.STRING(30),
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            username: {
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
            }
        },
        {
            sequelize,
            modelName: 'User',
        }
    );

    return User; // Return the defined model
};
