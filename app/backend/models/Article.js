const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Article extends Model {}

Article.init(
    {
        articleID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        articleTitle: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        tagID: {
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
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'Article', // We need to choose the model name
    },
);

// the defined model is the class itself
console.log(Article === sequelize.models.Article); // true