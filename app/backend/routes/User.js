const express = require('express');
const router = express.Router();

const {getAllUsers, createUser, getUser, updateUser, deleteUser, userArticles, userOrders, loginUser, userRating,
    userWrittenReviews, userReviews, userTopUp, getInteractedUsers
} = require('../controllers/users');
const {getUserWishlists} = require("../controllers/wishlists");

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
router.route('/:id/orders').get(userOrders);
router.route('/:id/articles').get(userArticles);
router.route('/:id/rating').get(userRating);
router.route('/:id/writtenreviews').get(userWrittenReviews)
router.route('/:id/reviews').get(userReviews);
router.route('/:id/topup').post(userTopUp);
router.route('/:id/chats').get(getInteractedUsers);
router.route('/:id/wishlists').get(getUserWishlists); // Get all wishlists of a user

module.exports = router;
