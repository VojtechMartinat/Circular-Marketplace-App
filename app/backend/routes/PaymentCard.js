const express = require('express');
const router = express.Router();

const {getAllCards, createCard, getCard, updateCard, deleteCard} = require('../controllers/paymentCards');

router.route('/').get(getAllCards).post(createCard);
router.route('/:id').get(getCard).put(updateCard).patch(updateCard).delete(deleteCard);

module.exports = router;
