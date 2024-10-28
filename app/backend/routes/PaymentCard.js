const express = require('express');
const router = express.Router();

const {getAllPaymentCards, createPaymentCards, getPaymentCard, updatePaymentCard, deletePaymentCard} = require('../controllers/PaymentCard');

router.route('/').get(getAllPaymentCards).post(createPaymentCards);
router.route('/:id').get(getPaymentCard).patch(updatePaymentCard).delete(deletePaymentCard);

module.exports = router;
