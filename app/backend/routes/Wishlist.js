const express = require('express');
const router = express.Router();

const {getAllWishlists, createWishlist, getWishlist, updateWishlist, deleteWishlist} = require('../controllers/wishlists');
const {updateUser} = require("../controllers/users");

router.route('/').get(getAllWishlists).post(createWishlist);
router.route('/:id').get(getWishlist).put(updateUser).patch(updateWishlist).delete(deleteWishlist);

module.exports = router;
