const {DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model {}

    User.init(
        {
            userID: {
                type: DataTypes.UUID,
                allowNull: false,
                unique: true,
                primaryKey: true,
                defaultValue : DataTypes.UUIDV4,
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
                type: DataTypes.DOUBLE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'User',
        }
    );

    return User; // Return the defined model
};
