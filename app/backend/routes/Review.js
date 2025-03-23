const express = require('express');
const router = express.Router();

const {getAllReviews,createReview,getReview,updateReview,deleteReview} = require('../controllers/reviews');

router.route('/').get(getAllReviews).post(createReview);
router.route('/:id').get(getReview).patch(updateReview).delete(deleteReview);

module.exports = router;