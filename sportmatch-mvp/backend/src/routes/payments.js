const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// Create payment (initiate payment)
router.post('/create', authenticate, paymentController.createPayment);

// VNPay callbacks
router.get('/vnpay/callback', paymentController.vnpayCallback);
router.post('/vnpay/ipn', paymentController.vnpayIPN);

// Momo callbacks
router.get('/momo/callback', paymentController.momoCallback);
router.post('/momo/notify', paymentController.momoNotify);

// Get payment status
router.get('/:id', authenticate, paymentController.getPaymentStatus);

module.exports = router;
