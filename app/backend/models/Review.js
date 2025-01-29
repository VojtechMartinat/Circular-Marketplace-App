
const { DataTypes, Model } = require('sequelize');


module.exports = (sequelize) => {
    class Review extends Model {}

    Review.init(
        {
            reviewID: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue : DataTypes.UUIDV4
            },
            rating: {
                type: DataTypes.INTEGER,
            },
            comment: {
                type: DataTypes.STRING,
            },
            userID: {
                type: DataTypes.UUID,
                allowNull: false,
            },


        },
        {
            sequelize,
            modelName: 'Review',
        },
    );

    return Review;
};
