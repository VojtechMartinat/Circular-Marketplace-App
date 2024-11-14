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
const PaymentCard = PaymentCardModel(sequelize);
const Order = OrderModel(sequelize);
const Article = ArticleModel(sequelize);
const Photo = PhotoModel(sequelize);
const Wishlist = WishlistModel(sequelize);
const Tag = TagModel(sequelize);

User.hasMany(Wishlist, {foreignKey: 'userID'});
Wishlist.belongsTo(User, {foreignKey: 'userID'});

Article.hasMany(Wishlist, {foreignKey: 'articleID'});
Wishlist.belongsTo(Article, {foreignKey: 'articleID'});

Order.hasMany(Article, { foreignKey: 'orderID' });
Article.belongsTo(Order, { foreignKey: 'orderID' });

User.hasMany(Order, { foreignKey: 'userID' });
Order.belongsTo(User, { foreignKey: 'userID' });

Order.belongsTo(PaymentCard, { foreignKey: 'paymentMethodID' });

User.hasMany(Article, { foreignKey: 'userID' });
Article.belongsTo(User, { foreignKey: 'userID' });

Article.hasMany(Photo, {foreignKey: 'articleID' });
Photo.belongsTo(Article, { foreignKey: 'articleID' });

User.hasMany(PaymentCard, { foreignKey: 'userID' });
PaymentCard.belongsTo(User, { foreignKey: 'userID' });

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