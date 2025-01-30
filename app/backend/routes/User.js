const express = require('express');
const router = express.Router();

const {getAllUsers, createUser, getUser, updateUser, deleteUser, userArticles, userOrders, loginUser, userRating} = require('../controllers/users');

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
router.route('/:id/orders').get(userOrders);
router.route('/:id/articles').get(userArticles);
router.route('/:id/reviews').get(userRating)

module.exports = router;
