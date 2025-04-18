// jest-ignore
const { Sequelize } = require('sequelize');
const sequelize = require('../database/connect');

const defineUserModel = require('../models/User');
const defineArticleModel = require('../models/Article');
const defineOrderModel = require('../models/Order');
const defineCardModel = require('../models/PaymentCard');
const definePhotoModel = require('../models/Photo');
const defineTagModel = require('../models/Tag');
const defineWishlistModel = require('../models/Wishlist');
const defineReviewModel = require('../models/Review');
process.env.NODE_ENV = 'test'; // Ensure test environment is used
const { beforeAll, afterAll, beforeEach, describe} = require('@jest/globals');

const app = require('../server');


// Define the User model by calling the function and passing sequelize
const User = defineUserModel(sequelize); // Must invoke the model definition
const Article = defineArticleModel(sequelize);
const Order = defineOrderModel(sequelize);
const PaymentCard = defineCardModel(sequelize);
const Photo = definePhotoModel(sequelize);
const Tag = defineTagModel(sequelize);
const Wishlist = defineWishlistModel(sequelize);
const Review = defineReviewModel(sequelize);

// Sync database before running tests

beforeEach(async () => {
    // Clear data from the User table before each test
    await User.destroy({ where: {} });
    await PaymentCard.destroy({ where: {} });// Clear all users
    await Article.destroy({ where: {} });
    await Order.destroy({ where: {} });
    await Tag.destroy({ where: {} });
    await Wishlist.destroy({ where: {} });
    await Photo.destroy({ where: {} });
    await Review.destroy({ where: {} });
});



// Export both sequelize and User model
module.exports = { sequelize, User, Article, Order, PaymentCard, Photo, Tag, Wishlist, Review };
