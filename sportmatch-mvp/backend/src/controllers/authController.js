const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const firebaseService = require('../services/firebaseService');

const prisma = new PrismaClient();

/**
 * Auth Controller
 * Handles OTP-based authentication
 */

// Send OTP to phone number
const sendOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone } = req.body;

    // Normalize phone number (remove spaces, dashes)
    const normalizedPhone = phone.replace(/[\s-]/g, '');

    // Send OTP via Firebase
    const result = await firebaseService.sendOTP(normalizedPhone);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      phone: normalizedPhone,
      ...(result.mockMode && { dev_otp: result.otp }) // Only in development!
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      error: 'Failed to send OTP',
      message: error.message
    });
  }
};

// Verify OTP and login/register user
const verifyOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, otp } = req.body;
    const normalizedPhone = phone.replace(/[\s-]/g, '');

    // Verify OTP
    const verification = await firebaseService.verifyOTP(normalizedPhone, otp);

    if (!verification.success || !verification.verified) {
      return res.status(400).json({
        error: verification.error || 'Invalid OTP'
      });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone: normalizedPhone }
    });

    let isNewUser = false;

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          phone: normalizedPhone,
          role: 'user',
          isActive: true
        }
      });
      isNewUser = true;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Generate refresh token (longer expiry)
    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      isNewUser,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role
      },
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      error: 'Failed to verify OTP',
      message: error.message
    });
  }
};

// Refresh access token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (decoded.type !== 'refresh') {
      return res.status(400).json({ error: 'Invalid refresh token' });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    // Generate new access token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      token
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
};

// Logout (client-side token deletion, optionally blacklist token)
const logout = async (req, res) => {
  try {
    // In a production app, you might want to:
    // 1. Add token to blacklist (Redis)
    // 2. Clear any sessions
    // For now, client-side token deletion is sufficient

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  refreshToken,
  logout
};
