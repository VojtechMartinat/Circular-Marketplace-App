const express = require('express');
const router = express.Router();

const {getAllWishlists, createWishlists, getWishlist, updateWishlist, deleteWishlist} = require('../controllers/Wishlist');

router.route('/').get(getAllWishlists).post(createWishlists);
router.route('/:id').get(getWishlist).patch(updateWishlist).delete(deleteWishlist);

module.exports = router;
