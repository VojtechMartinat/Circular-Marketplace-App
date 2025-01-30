const { Sequelize } = require('sequelize');
const sequelize = require('../database/connect');


const UserModel = require('./User');
const ArticleModel = require('./Article');
const OrderModel = require('./Order');
const PaymentCardModel = require('./PaymentCard');
const PhotoModel = require('./Photo');
const TagModel = require('./Tag');
const WishlistModel = require('./Wishlist');
const TaskModel = require('./Task');
const TaskLogModel = require('./TaskLog')

const User = UserModel(sequelize);
const PaymentCard = PaymentCardModel(sequelize);
const Order = OrderModel(sequelize);
const Article = ArticleModel(sequelize);
const Photo = PhotoModel(sequelize);
const Wishlist = WishlistModel(sequelize);
const Tag = TagModel(sequelize);
const Task = TaskModel(sequelize);
const TaskLog = TaskLogModel(sequelize);

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

TaskLog.belongsTo(Task, {foreignKey: 'taskID'})
Task.hasMany(TaskLog,{foreignKey: 'taskID'})
module.exports = {
    User,
    Article,
    Order,
    PaymentCard,
    Photo,
    Tag,
    Wishlist,
    Task,
    TaskLog,
    sequelize

};