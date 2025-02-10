
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
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5
                }
            },
            comment: {
                type: DataTypes.STRING,
                validate: {
                    is: /^(?=.*[a-zA-Z0-9]).{1,5000}$/,
                }
            },
            userID: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            reviewer: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            articleID: {
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
