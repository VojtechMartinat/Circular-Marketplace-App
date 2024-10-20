const { Sequelize } = require('sequelize');
const defineUserModel = require('../models/User');
const defineArticleModel = require('../models/Article');
const defineOrderModel = require('../models/order');
const defineCardModel = require('../models/PaymentCard');
const definePhotoModel = require('../models/Photo');
const defineTagModel = require('../models/Tag');
const defineWishlistModel = require('../models/Wishlist');


// Initialize Sequelize with in-memory SQLite
const sequelize = new Sequelize('sqlite::memory:', {
    logging: false, // Disable logging for cleaner test output
});

// Define the User model by calling the function and passing sequelize
const User = defineUserModel(sequelize); // Must invoke the model definition
const Article = defineArticleModel(sequelize);
const Order = defineOrderModel(sequelize);
const PaymentCard = defineCardModel(sequelize);
const Photo = definePhotoModel(sequelize);
const Tag = defineTagModel(sequelize);
const Wishlist = defineWishlistModel(sequelize);




// Sync database before running tests
beforeAll(async () => {
    await sequelize.authenticate(); // Connect to the in-memory DB
    await sequelize.sync(); // Synchronize all models with the database
});

afterAll(async () => {
    await sequelize.close(); // Close the connection after tests
});

beforeEach(async () => {
    // Clear data from the User table before each test
    await User.destroy({ where: {} }); // Clear all users
});

// Export both sequelize and User model
module.exports = { sequelize, User, Article, Order, PaymentCard, Photo, Tag, Wishlist };
