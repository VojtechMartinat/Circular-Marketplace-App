const express = require('express');
const router = express.Router();

const {getAllOrders, createOrder, getOrder, updateOrder, deleteOrder, getOrderArticles} = require('../controllers/orders');

router.route('/').get(getAllOrders).post(createOrder);
router.route('/:id').get(getOrder).patch(updateOrder).delete(deleteOrder);
router.route('/:id/articles').get(getOrderArticles);

module.exports = router;