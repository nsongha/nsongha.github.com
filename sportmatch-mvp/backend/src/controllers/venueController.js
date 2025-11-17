const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

/**
 * Venue Controller
 * Handles venue CRUD and search with geo-location
 */

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// List venues with filters and search
const listVenues = async (req, res) => {
  try {
    const {
      sport,
      lat,
      lng,
      radius = 10, // km
      date,
      time,
      minPrice,
      maxPrice,
      amenities, // comma-separated: "parking,ac,wifi"
      page = 1,
      limit = 20
    } = req.query;

    // Build where clause
    const where = {
      isActive: true
    };

    if (sport) {
      where.sportType = sport;
    }

    // Get all venues (we'll filter by distance in memory)
    const venues = await prisma.venue.findMany({
      where,
      include: {
        courts: {
          where: { isActive: true },
          select: {
            id: true,
            number: true,
            priceWeekdayMorning: true,
            priceWeekdayAfternoon: true,
            priceWeekdayEvening: true,
            priceWeekendMorning: true,
            priceWeekendAfternoon: true,
            priceWeekendEvening: true
          }
        },
        owner: {
          select: {
            id: true,
            name: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    // Filter by distance if lat/lng provided
    let filteredVenues = venues;
    if (lat && lng) {
      filteredVenues = venues.filter(venue => {
        const venueLat = venue.location.lat;
        const venueLng = venue.location.lng;
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          venueLat,
          venueLng
        );
        venue.distance = Math.round(distance * 10) / 10; // Round to 1 decimal
        return distance <= parseFloat(radius);
      });

      // Sort by distance
      filteredVenues.sort((a, b) => a.distance - b.distance);
    }

    // Filter by price if specified
    if (minPrice || maxPrice) {
      filteredVenues = filteredVenues.filter(venue => {
        const prices = venue.courts.flatMap(court => [
          court.priceWeekdayMorning,
          court.priceWeekdayAfternoon,
          court.priceWeekdayEvening,
          court.priceWeekendMorning,
          court.priceWeekendAfternoon,
          court.priceWeekendEvening
        ]).filter(p => p !== null);

        if (prices.length === 0) return false;

        const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;

        if (minPrice && avgPrice < parseInt(minPrice)) return false;
        if (maxPrice && avgPrice > parseInt(maxPrice)) return false;

        return true;
      });
    }

    // Filter by amenities
    if (amenities) {
      const requiredAmenities = amenities.split(',');
      filteredVenues = filteredVenues.filter(venue => {
        return requiredAmenities.every(amenity => {
          switch (amenity.trim()) {
            case 'parking':
              return venue.freeParking;
            case 'ac':
              return venue.hasAC;
            case 'wifi':
              return venue.hasFreeWifi;
            case 'locker':
              return venue.hasLockerRoom;
            default:
              return true;
          }
        });
      });
    }

    // Calculate match score if user is authenticated and has preferences
    if (req.user) {
      // TODO: Implement AI matching score
      // For now, simple distance-based scoring
    }

    res.json({
      success: true,
      count: filteredVenues.length,
      page: parseInt(page),
      limit: parseInt(limit),
      venues: filteredVenues.map(v => ({
        id: v.id,
        name: v.name,
        address: v.address,
        location: v.location,
        distance: v.distance,
        sportType: v.sportType,
        images: v.images,
        ratingOverall: v.ratingOverall,
        freeParking: v.freeParking,
        hasAC: v.hasAC,
        priceRange: getPriceRange(v.courts),
        courts: v.courts.length
      }))
    });
  } catch (error) {
    console.error('List venues error:', error);
    res.status(500).json({
      error: 'Failed to fetch venues',
      message: error.message
    });
  }
};

// Get venue details
const getVenue = async (req, res) => {
  try {
    const { id } = req.params;

    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        courts: {
          where: { isActive: true },
          orderBy: { number: 'asc' }
        },
        owner: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        reviews: {
          where: { isPublished: true },
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    // Calculate distance if user location provided
    const { lat, lng } = req.query;
    if (lat && lng) {
      venue.distance = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        venue.location.lat,
        venue.location.lng
      );
    }

    res.json({
      success: true,
      venue
    });
  } catch (error) {
    console.error('Get venue error:', error);
    res.status(500).json({
      error: 'Failed to fetch venue',
      message: error.message
    });
  }
};

// Get venue availability for a specific date
const getAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query; // ISO date string (YYYY-MM-DD)

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const venue = await prisma.venue.findUnique({
      where: { id },
      include: {
        courts: {
          where: { isActive: true },
          orderBy: { number: 'asc' }
        }
      }
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    // Get all bookings for this date
    const bookings = await prisma.booking.findMany({
      where: {
        venueId: id,
        bookingDate: new Date(date),
        status: { in: ['confirmed', 'pending'] }
      },
      select: {
        courtId: true,
        startTime: true,
        endTime: true
      }
    });

    // Create availability map for each court
    const availability = venue.courts.map(court => {
      // Generate time slots (e.g., 6:00 - 23:00)
      const slots = [];
      for (let hour = 6; hour < 23; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

        // Check if this slot is booked
        const isBooked = bookings.some(booking =>
          booking.courtId === court.id &&
          booking.startTime === startTime
        );

        // Determine price based on day and time
        const dayOfWeek = new Date(date).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        let price;

        if (hour < 12) {
          price = isWeekend ? court.priceWeekendMorning : court.priceWeekdayMorning;
        } else if (hour < 18) {
          price = isWeekend ? court.priceWeekendAfternoon : court.priceWeekdayAfternoon;
        } else {
          price = isWeekend ? court.priceWeekendEvening : court.priceWeekdayEvening;
        }

        slots.push({
          startTime,
          endTime,
          available: !isBooked,
          price
        });
      }

      return {
        courtId: court.id,
        courtNumber: court.number,
        courtName: court.name,
        slots
      };
    });

    res.json({
      success: true,
      venue: {
        id: venue.id,
        name: venue.name
      },
      date,
      availability
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      error: 'Failed to fetch availability',
      message: error.message
    });
  }
};

// Create venue (admin/owner only)
const createVenue = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const venueData = req.body;

    // Set owner to current user
    venueData.ownerId = req.user.id;

    const venue = await prisma.venue.create({
      data: venueData
    });

    res.status(201).json({
      success: true,
      venue
    });
  } catch (error) {
    console.error('Create venue error:', error);
    res.status(500).json({
      error: 'Failed to create venue',
      message: error.message
    });
  }
};

// Update venue (owner/admin only)
const updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check ownership
    const venue = await prisma.venue.findUnique({
      where: { id }
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    if (venue.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this venue' });
    }

    // Don't allow changing ownerId
    delete updates.ownerId;

    const updatedVenue = await prisma.venue.update({
      where: { id },
      data: updates
    });

    res.json({
      success: true,
      venue: updatedVenue
    });
  } catch (error) {
    console.error('Update venue error:', error);
    res.status(500).json({
      error: 'Failed to update venue',
      message: error.message
    });
  }
};

// Delete venue (admin only)
const deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete - set isActive to false
    await prisma.venue.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({
      success: true,
      message: 'Venue deleted successfully'
    });
  } catch (error) {
    console.error('Delete venue error:', error);
    res.status(500).json({
      error: 'Failed to delete venue',
      message: error.message
    });
  }
};

// Helper: Get price range for courts
function getPriceRange(courts) {
  const prices = courts.flatMap(court => [
    court.priceWeekdayMorning,
    court.priceWeekdayAfternoon,
    court.priceWeekdayEvening,
    court.priceWeekendMorning,
    court.priceWeekendAfternoon,
    court.priceWeekendEvening
  ]).filter(p => p !== null);

  if (prices.length === 0) return null;

  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

module.exports = {
  listVenues,
  getVenue,
  getAvailability,
  createVenue,
  updateVenue,
  deleteVenue
};
