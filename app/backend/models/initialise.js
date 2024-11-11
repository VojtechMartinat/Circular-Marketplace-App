const { Sequelize } = require('sequelize');
const sequelize = require('../database/connect');
const UserModel = require('./User');
const ArticleModel = require('./Article');
const OrderModel = require('./Order');
const PaymentCardModel = require('./PaymentCard');
const PhotoModel = require('./Photo');
const TagModel = require('./Tag');
const WishlistModel = require('./Wishlist');

const User = UserModel(sequelize);
const Article = ArticleModel(sequelize);
const Order = OrderModel(sequelize);
const PaymentCard = PaymentCardModel(sequelize);
const Photo = PhotoModel(sequelize);
const Tag = TagModel(sequelize);
const Wishlist = WishlistModel(sequelize);

module.exports = {
    User,
    Article,
    Order,
    PaymentCard,
    Photo,
    Tag,
    Wishlist,
    sequelize
};