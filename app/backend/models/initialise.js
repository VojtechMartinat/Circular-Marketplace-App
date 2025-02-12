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

User.hasMany(Wishlist, {foreignKey: 'userID', onDelete: 'CASCADE'});
Wishlist.belongsTo(User, {foreignKey: 'userID', onDelete: 'CASCADE'});

Article.hasMany(Wishlist, {foreignKey: 'articleID', onDelete: 'CASCADE'});
Wishlist.belongsTo(Article, {foreignKey: 'articleID', onDelete: 'CASCADE'});

Order.hasMany(Article, { foreignKey: 'orderID' , onDelete: 'CASCADE'});
Article.belongsTo(Order, { foreignKey: 'orderID' , onDelete: 'CASCADE'});

User.hasMany(Order, { foreignKey: 'userID', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userID' , onDelete: 'CASCADE'});

Order.belongsTo(PaymentCard, { foreignKey: 'paymentMethodID' , onDelete: 'CASCADE'});

User.hasMany(Article, { foreignKey: 'userID' , onDelete: 'CASCADE'});
Article.belongsTo(User, { foreignKey: 'userID' , onDelete: 'CASCADE'});

Article.hasMany(Photo, {foreignKey: 'articleID' , onDelete: 'CASCADE'});
Photo.belongsTo(Article, { foreignKey: 'articleID' , onDelete: 'CASCADE'});

User.hasMany(PaymentCard, { foreignKey: 'userID' , onDelete: 'CASCADE'});
PaymentCard.belongsTo(User, { foreignKey: 'userID' , onDelete: 'CASCADE'});

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