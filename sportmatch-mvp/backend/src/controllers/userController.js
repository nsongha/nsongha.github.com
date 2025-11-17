const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

/**
 * User Controller
 * Handles user profile and preferences
 */

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        avatar: true,
        homeLocation: true,
        workLocation: true,
        sportType: true,
        skillLevel: true,
        hasCoach: true,
        playFrequency: true,
        preferredTime: true,
        preferredDays: true,
        sessionDuration: true,
        budgetMin: true,
        budgetMax: true,
        maxDistance: true,
        priority: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get booking stats
    const bookingStats = await prisma.booking.aggregate({
      where: {
        userId,
        status: 'completed'
      },
      _count: true,
      _sum: {
        finalPrice: true
      }
    });

    res.json({
      success: true,
      user: {
        ...user,
        stats: {
          totalBookings: bookingStats._count || 0,
          totalSpent: bookingStats._sum.finalPrice || 0
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      message: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const updates = req.body;

    // Don't allow updating certain fields
    delete updates.id;
    delete updates.phone; // Phone is unique identifier, don't change
    delete updates.role; // Only admin can change roles
    delete updates.createdAt;
    delete updates.updatedAt;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updates,
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        avatar: true,
        sportType: true,
        skillLevel: true
      }
    });

    res.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message
    });
  }
};

// Update user preferences (for AI matching)
const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      homeLocation,
      workLocation,
      sportType,
      skillLevel,
      hasCoach,
      playFrequency,
      preferredTime,
      preferredDays,
      sessionDuration,
      budgetMin,
      budgetMax,
      maxDistance,
      priority
    } = req.body;

    const updates = {};

    if (homeLocation) updates.homeLocation = homeLocation;
    if (workLocation) updates.workLocation = workLocation;
    if (sportType) updates.sportType = sportType;
    if (skillLevel) updates.skillLevel = skillLevel;
    if (typeof hasCoach === 'boolean') updates.hasCoach = hasCoach;
    if (playFrequency) updates.playFrequency = playFrequency;
    if (preferredTime) updates.preferredTime = preferredTime;
    if (preferredDays) updates.preferredDays = preferredDays;
    if (sessionDuration) updates.sessionDuration = sessionDuration;
    if (budgetMin !== undefined) updates.budgetMin = budgetMin;
    if (budgetMax !== undefined) updates.budgetMax = budgetMax;
    if (maxDistance !== undefined) updates.maxDistance = maxDistance;
    if (priority) updates.priority = priority;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updates
    });

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: {
        homeLocation: updatedUser.homeLocation,
        workLocation: updatedUser.workLocation,
        sportType: updatedUser.sportType,
        skillLevel: updatedUser.skillLevel,
        hasCoach: updatedUser.hasCoach,
        playFrequency: updatedUser.playFrequency,
        preferredTime: updatedUser.preferredTime,
        preferredDays: updatedUser.preferredDays,
        sessionDuration: updatedUser.sessionDuration,
        budgetMin: updatedUser.budgetMin,
        budgetMax: updatedUser.budgetMax,
        maxDistance: updatedUser.maxDistance,
        priority: updatedUser.priority
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      error: 'Failed to update preferences',
      message: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePreferences
};
