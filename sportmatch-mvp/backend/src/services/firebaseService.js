// Firebase Admin setup for OTP
const admin = require('firebase-admin');

// Initialize Firebase Admin (only once)
let firebaseApp;

const initFirebase = () => {
  if (firebaseApp) return firebaseApp;

  try {
    // For production, use service account JSON file
    // For now, we'll use a simplified setup
    if (process.env.FIREBASE_PROJECT_ID) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
      });
      console.log('✅ Firebase initialized');
    } else {
      console.log('⚠️  Firebase not configured - OTP will use mock mode');
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
  }

  return firebaseApp;
};

// Send OTP via SMS (Firebase Auth)
const sendOTP = async (phoneNumber) => {
  try {
    initFirebase();

    // In development/testing: return mock OTP
    if (process.env.NODE_ENV === 'development' || !firebaseApp) {
      console.log(`📱 Mock OTP for ${phoneNumber}: 123456`);
      return {
        success: true,
        message: 'OTP sent (mock)',
        otp: '123456', // Only for dev!
        mockMode: true
      };
    }

    // Production: Use Firebase Phone Auth
    // Note: This requires Firebase Phone Auth to be enabled
    // and SMS provider configured in Firebase Console

    // For now, we'll use a simple verification code generation
    // In production, you should use Firebase Auth SDK on client side
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // TODO: Integrate with SMS gateway (Twilio, AWS SNS, etc.)
    // For now, log it
    console.log(`📱 OTP for ${phoneNumber}: ${verificationCode}`);

    // Store OTP in memory/Redis with expiry
    // For MVP, we'll use in-memory storage (not production-ready)
    global.otpStore = global.otpStore || {};
    global.otpStore[phoneNumber] = {
      code: verificationCode,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    };

    return {
      success: true,
      message: 'OTP sent successfully',
      // Don't send OTP in response in production!
      ...(process.env.NODE_ENV === 'development' && { otp: verificationCode })
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

// Verify OTP
const verifyOTP = async (phoneNumber, otp) => {
  try {
    // Development/Mock mode
    if (process.env.NODE_ENV === 'development' && otp === '123456') {
      return { success: true, verified: true };
    }

    // Check in-memory storage
    const stored = global.otpStore?.[phoneNumber];

    if (!stored) {
      return { success: false, error: 'OTP not found or expired' };
    }

    if (Date.now() > stored.expiresAt) {
      delete global.otpStore[phoneNumber];
      return { success: false, error: 'OTP expired' };
    }

    if (stored.code !== otp) {
      return { success: false, error: 'Invalid OTP' };
    }

    // OTP verified - clean up
    delete global.otpStore[phoneNumber];

    return { success: true, verified: true };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Failed to verify OTP');
  }
};

module.exports = {
  initFirebase,
  sendOTP,
  verifyOTP
};
