const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

// Send OTP
router.post(
  '/send-otp',
  [
    body('phone').isMobilePhone('vi-VN').withMessage('Invalid phone number')
  ],
  authController.sendOTP
);

// Verify OTP and login
router.post(
  '/verify-otp',
  [
    body('phone').isMobilePhone('vi-VN').withMessage('Invalid phone number'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
  ],
  authController.verifyOTP
);

// Refresh token
router.post('/refresh', authController.refreshToken);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
