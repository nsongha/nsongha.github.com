const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');
const { authenticate, authorize } = require('../middleware/auth');
const { body, query } = require('express-validator');

// Public routes
router.get(
  '/',
  [
    query('sport').optional().isString(),
    query('lat').optional().isFloat(),
    query('lng').optional().isFloat(),
    query('radius').optional().isInt({ min: 1, max: 50 }),
    query('date').optional().isISO8601(),
    query('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    query('minPrice').optional().isInt({ min: 0 }),
    query('maxPrice').optional().isInt({ min: 0 })
  ],
  venueController.listVenues
);

router.get('/:id', venueController.getVenue);

router.get('/:id/availability', venueController.getAvailability);

// Protected routes (venue owner/admin)
router.post(
  '/',
  authenticate,
  authorize(['admin', 'venue_owner']),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('location').isObject().withMessage('Location must be an object'),
    body('sportType').notEmpty().withMessage('Sport type is required'),
    body('phone').isMobilePhone('vi-VN').withMessage('Invalid phone number')
  ],
  venueController.createVenue
);

router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'venue_owner']),
  venueController.updateVenue
);

router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  venueController.deleteVenue
);

module.exports = router;
