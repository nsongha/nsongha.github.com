const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');
const { body } = require('express-validator');

// All booking routes require authentication
router.use(authenticate);

// Create booking
router.post(
  '/',
  [
    body('courtId').isUUID().withMessage('Invalid court ID'),
    body('bookingDate').isISO8601().withMessage('Invalid date'),
    body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time'),
    body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time'),
    body('paymentMethod').isIn(['momo', 'vnpay', 'card', 'cash']).withMessage('Invalid payment method')
  ],
  bookingController.createBooking
);

// Get user's bookings
router.get('/my', bookingController.getMyBookings);

// Get booking details
router.get('/:id', bookingController.getBooking);

// Update booking (reschedule)
router.put('/:id', bookingController.updateBooking);

// Cancel booking
router.delete('/:id', bookingController.cancelBooking);

// Check-in
router.post('/:id/checkin', bookingController.checkIn);

module.exports = router;
