const sequelize = require('../database/connect'); // Ensure this points to your database connection
const defineUserModel = require('./User');
const defineOrderModel = require('./Order');
const defineArticleModel = require('./Article');
const definePhotoModel = require('./Photo');
const definePaymentCardModel = require('./PaymentCard');

// Instantiate each model with sequelize
const User = defineUserModel(sequelize);
const Order = defineOrderModel(sequelize);
const Article = defineArticleModel(sequelize);
const Photo = definePhotoModel(sequelize);
const PaymentCard = definePaymentCardModel(sequelize);

// Define associations here
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

module.exports = function setupAssociations() {
}