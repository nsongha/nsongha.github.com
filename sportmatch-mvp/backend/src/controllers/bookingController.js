const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

/**
 * Booking Controller
 * Handles booking creation, cancellation, and management
 */

// Create booking
const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courtId, bookingDate, startTime, endTime, paymentMethod } = req.body;
    const userId = req.user.id;

    // Get court details
    const court = await prisma.court.findUnique({
      where: { id: courtId },
      include: {
        venue: true
      }
    });

    if (!court) {
      return res.status(404).json({ error: 'Court not found' });
    }

    if (!court.isActive || !court.venue.isActive) {
      return res.status(400).json({ error: 'Court or venue is not available' });
    }

    // Check if slot is available
    const existingBooking = await prisma.booking.findFirst({
      where: {
        courtId,
        bookingDate: new Date(bookingDate),
        startTime,
        status: { in: ['pending', 'confirmed'] }
      }
    });

    if (existingBooking) {
      return res.status(400).json({
        error: 'This time slot is already booked'
      });
    }

    // Calculate price based on day and time
    const date = new Date(bookingDate);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const hour = parseInt(startTime.split(':')[0]);

    let price;
    if (hour < 12) {
      price = isWeekend ? court.priceWeekendMorning : court.priceWeekdayMorning;
    } else if (hour < 18) {
      price = isWeekend ? court.priceWeekendAfternoon : court.priceWeekdayAfternoon;
    } else {
      price = isWeekend ? court.priceWeekendEvening : court.priceWeekdayEvening;
    }

    if (!price) {
      return res.status(400).json({ error: 'Price not available for this time slot' });
    }

    // Calculate duration
    const startHour = parseInt(startTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1] || 0);
    const endHour = parseInt(endTime.split(':')[0]);
    const endMinute = parseInt(endTime.split(':')[1] || 0);
    const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

    // Apply discount if any (TODO: implement discount logic)
    const discount = 0;
    const finalPrice = price - discount;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        venueId: court.venueId,
        courtId,
        bookingDate: new Date(bookingDate),
        startTime,
        endTime,
        duration,
        price,
        discount,
        finalPrice,
        status: 'pending', // Will be confirmed after payment
        paymentStatus: 'pending',
        paymentMethod
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true
          }
        },
        court: {
          select: {
            id: true,
            number: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      booking,
      message: 'Booking created. Please proceed to payment.'
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      error: 'Failed to create booking',
      message: error.message
    });
  }
};

// Get user's bookings
const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, upcoming } = req.query;

    const where = { userId };

    if (status) {
      where.status = status;
    }

    if (upcoming === 'true') {
      where.bookingDate = { gte: new Date() };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            images: true
          }
        },
        court: {
          select: {
            id: true,
            number: true,
            name: true
          }
        }
      },
      orderBy: { bookingDate: 'desc' }
    });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      error: 'Failed to fetch bookings',
      message: error.message
    });
  }
};

// Get booking details
const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        venue: true,
        court: true,
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user owns this booking (or is admin)
    if (booking.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      error: 'Failed to fetch booking',
      message: error.message
    });
  }
};

// Update booking (reschedule)
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingDate, startTime, endTime } = req.body;
    const userId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { court: true }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot update cancelled or completed booking' });
    }

    // Check if new slot is available
    if (bookingDate || startTime) {
      const checkDate = bookingDate ? new Date(bookingDate) : booking.bookingDate;
      const checkTime = startTime || booking.startTime;

      const existingBooking = await prisma.booking.findFirst({
        where: {
          courtId: booking.courtId,
          bookingDate: checkDate,
          startTime: checkTime,
          id: { not: id },
          status: { in: ['pending', 'confirmed'] }
        }
      });

      if (existingBooking) {
        return res.status(400).json({ error: 'New time slot is already booked' });
      }
    }

    // Update booking
    const updates = {};
    if (bookingDate) updates.bookingDate = new Date(bookingDate);
    if (startTime) updates.startTime = startTime;
    if (endTime) updates.endTime = endTime;

    // Recalculate price if time changed
    if (bookingDate || startTime) {
      // TODO: Recalculate price based on new time
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updates,
      include: {
        venue: true,
        court: true
      }
    });

    res.json({
      success: true,
      booking: updatedBooking,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      error: 'Failed to update booking',
      message: error.message
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { payment: true }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed booking' });
    }

    // Calculate refund based on cancellation time
    const now = new Date();
    const bookingTime = new Date(`${booking.bookingDate.toISOString().split('T')[0]}T${booking.startTime}`);
    const hoursUntilBooking = (bookingTime - now) / (1000 * 60 * 60);

    let refundAmount = 0;
    let refundPercentage = 0;

    if (hoursUntilBooking >= 2) {
      // Full refund if cancelled 2+ hours before
      refundAmount = booking.finalPrice;
      refundPercentage = 100;
    } else if (hoursUntilBooking >= 0.5) {
      // 70% refund if cancelled 30min-2h before
      refundAmount = Math.round(booking.finalPrice * 0.7);
      refundPercentage = 70;
    }
    // No refund if less than 30 minutes

    // Update booking
    const cancelledBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelReason: reason,
        refundAmount
      }
    });

    // Update payment if refund is due
    if (refundAmount > 0 && booking.payment) {
      await prisma.payment.update({
        where: { id: booking.payment.id },
        data: {
          status: 'refunded',
          refundedAt: new Date(),
          refundAmount,
          refundReason: reason
        }
      });
    }

    res.json({
      success: true,
      booking: cancelledBooking,
      refund: {
        amount: refundAmount,
        percentage: refundPercentage,
        message: refundAmount > 0
          ? `Refund of ${refundAmount.toLocaleString()}đ (${refundPercentage}%) will be processed`
          : 'No refund available for late cancellation'
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      error: 'Failed to cancel booking',
      message: error.message
    });
  }
};

// Check-in (mark as completed)
const checkIn = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({ error: 'Only confirmed bookings can be checked in' });
    }

    // Update booking
    const checkedInBooking = await prisma.booking.update({
      where: { id },
      data: {
        checkedInAt: new Date(),
        status: 'completed',
        completedAt: new Date()
      }
    });

    res.json({
      success: true,
      booking: checkedInBooking,
      message: 'Checked in successfully! Enjoy your game!'
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({
      error: 'Failed to check in',
      message: error.message
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  checkIn
};
