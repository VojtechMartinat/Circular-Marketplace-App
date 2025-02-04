const express = require('express');
const router = express.Router();

const {getAllUsers, createUser, getUser, updateUser, deleteUser, userArticles, userOrders, userTopUp} = require('../controllers/users');

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
router.route('/:id/orders').get(userOrders);
router.route('/:id/articles').get(userArticles);
router.route('/:id/topup').post(userTopUp);
module.exports = router;
