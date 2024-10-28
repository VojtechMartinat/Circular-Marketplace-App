const express = require('express');
const router = express.Router();

const {getAllOrders, createOrders, getOrder, updateOrder, deleteOrder} = require('../controllers/Order');

router.route('/').get(getAllOrders).post(createOrders);
router.route('/:id').get(getOrder).patch(updateOrder).delete(deleteOrder);

module.exports = router;
