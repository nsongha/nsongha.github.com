import axios from 'axios';

// API base URL - change this based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
  myBookings: '/bookings/my-bookings',
  bookingDetail: (id) => `/bookings/${id}`,
  cancelBooking: (id) => `/bookings/${id}/cancel`,

  // Payments
  createPayment: '/payments/create',
  vnpayCallback: '/payments/vnpay/callback',
  momoCallback: '/payments/momo/callback',

  // User
  profile: '/users/profile',
  updateProfile: '/users/profile',
  updatePreferences: '/users/preferences'
};

export default api;
