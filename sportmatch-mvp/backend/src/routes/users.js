const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { body } = require('express-validator');

// All user routes require authentication
router.use(authenticate);

// Get current user profile
router.get('/me', userController.getProfile);

// Update profile
router.put(
  '/me',
  [
    body('name').optional().isString(),
    body('email').optional().isEmail(),
    body('sportType').optional().isString(),
    body('skillLevel').optional().isIn(['beginner', 'intermediate', 'advanced', 'pro'])
  ],
  userController.updateProfile
);

// Update preferences (for AI matching)
router.put('/me/preferences', userController.updatePreferences);

module.exports = router;
