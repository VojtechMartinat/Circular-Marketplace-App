const User = require('./User');
const Order = require('./Order');
const Article = require('./Article');
const PaymentCard = require('./PaymentCard');

// Define associations here
Order.hasMany(Article, { foreignKey: 'orderID' });
Article.belongsTo(Order, { foreignKey: 'orderID' });

User.hasMany(Order, { foreignKey: 'userID' });
Order.belongsTo(User, { foreignKey: 'userID' });

Order.belongsTo(PaymentCard, { foreignKey: 'paymentMethodID' });

User.hasMany(Article, { foreignKey: 'userID' });
Article.belongsTo(User, { foreignKey: 'userID' });

module.exports = function setupAssociations() {
}