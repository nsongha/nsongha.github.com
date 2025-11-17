import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL - change for production
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.sportmatch.vn/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - try refresh or logout
      await AsyncStorage.removeItem('token');
      // Navigate to login (will be handled by navigation)
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoints
export const endpoints = {
  // Auth
  sendOTP: '/auth/send-otp',
  verifyOTP: '/auth/verify-otp',
  refreshToken: '/auth/refresh',

  // Venues
  venues: '/venues',
  venueDetail: (id) => `/venues/${id}`,
  venueAvailability: (id) => `/venues/${id}/availability`,

  // Bookings
  bookings: '/bookings',
  myBookings: '/bookings/my',
  bookingDetail: (id) => `/bookings/${id}`,
  cancelBooking: (id) => `/bookings/${id}`,
  checkIn: (id) => `/bookings/${id}/checkin`,

  // Payments
  createPayment: '/payments/create',
  paymentStatus: (id) => `/payments/${id}`,

  // User
  profile: '/users/me',
  updateProfile: '/users/me',
  updatePreferences: '/users/me/preferences'
};
