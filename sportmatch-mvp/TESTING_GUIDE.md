# 🧪 SportMatch MVP - Testing Guide

## Table of Contents
1. [Environment Setup](#environment-setup)
2. [Backend Testing](#backend-testing)
3. [Mobile App Testing](#mobile-app-testing)
4. [Web App Testing](#web-app-testing)
5. [End-to-End Testing](#end-to-end-testing)
6. [Common Issues & Solutions](#common-issues--solutions)

---

## Environment Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Firebase account (for OTP SMS)
- VNPay sandbox account (for payment testing)
- Momo test account (for payment testing)
- Expo Go app (for mobile testing) - iOS/Android

### Required Environment Variables

Create these files before testing:

**Backend (.env):**
```bash
cd sportmatch-mvp/backend
cp .env.example .env
```

Edit `.env`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sportmatch"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# Firebase (for OTP SMS)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL="your-client-email"

# VNPay
VNPAY_TMN_CODE="your-tmn-code"
VNPAY_HASH_SECRET="your-hash-secret"
VNPAY_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"

# Momo
MOMO_PARTNER_CODE="your-partner-code"
MOMO_ACCESS_KEY="your-access-key"
MOMO_SECRET_KEY="your-secret-key"
MOMO_ENDPOINT="https://test-payment.momo.vn/v2/gateway/api/create"

# Environment
NODE_ENV="development"
PORT="3000"
```

**Web (.env):**
```bash
cd sportmatch-mvp/web
echo "REACT_APP_API_URL=http://localhost:3000/api" > .env
```

---

## Backend Testing

### 1. Database Setup

```bash
cd sportmatch-mvp/backend

# Create database
createdb sportmatch

# OR using psql
psql -U postgres
CREATE DATABASE sportmatch;
\q

# Run migrations
npx prisma migrate dev

# Seed database with 30 venues
node src/seeds/index.js
```

**Expected Output:**
```
🌱 Starting seed...
✅ Admin user created
✅ Venue owners created
🏟️  Creating venues...
✅ Created: Sân Cầu Lông VinSport - Cầu Giấy (badminton)
✅ Created: Cầu Lông Thiên Thanh - Đống Đa (badminton)
...
✅ Created: Sân Tennis Thanh Xuân (tennis)
🎉 Seed completed successfully!
📊 Created 30 venues with multiple courts
   - Badminton: 20 venues
   - Football: 6 venues
   - Tennis: 4 venues
```

### 2. Start Backend Server

```bash
npm install
npm run dev
```

**Expected Output:**
```
🚀 Server is running on port 3000
✅ Database connected successfully
```

### 3. Test API Endpoints with Postman/cURL

**A. Authentication Flow**

```bash
# 1. Send OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "0912345678"}'

# Expected response:
{
  "success": true,
  "message": "OTP sent successfully",
  "dev_otp": "123456"  // Only in development
}

# 2. Verify OTP
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "0912345678", "otp": "123456"}'

# Expected response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "phone": "0912345678",
    "name": null,
    "role": "user"
  }
}
```

**B. Get Venues List**

```bash
# Get all venues
curl http://localhost:3000/api/venues

# Filter by sport type
curl http://localhost:3000/api/venues?sportType=badminton

# Filter by price
curl "http://localhost:3000/api/venues?minPrice=50000&maxPrice=150000"

# Search by name
curl "http://localhost:3000/api/venues?search=VinSport"
```

**C. Get Venue Details**

```bash
curl http://localhost:3000/api/venues/{venue-id}
```

**D. Check Availability**

```bash
curl "http://localhost:3000/api/venues/{venue-id}/availability?date=2024-01-20"
```

**E. Create Booking (Requires Auth)**

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "courtId": "court-id",
    "bookingDate": "2024-01-20",
    "startTime": "18:00",
    "endTime": "19:00",
    "paymentMethod": "momo"
  }'
```

**F. Get My Bookings**

```bash
curl http://localhost:3000/api/bookings/my-bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**G. Cancel Booking**

```bash
curl -X DELETE http://localhost:3000/api/bookings/{booking-id}/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Cannot make it"}'

# Expected refund calculation:
# - Cancel 2+ hours before: 100% refund
# - Cancel 30 min - 2 hours before: 70% refund
# - Cancel < 30 min before: 0% refund
```

### 4. Test Payment Integration

**VNPay Sandbox:**
```bash
# Create payment URL
curl -X POST http://localhost:3000/api/payments/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "booking-id",
    "method": "vnpay"
  }'

# Test cards:
# Card number: 9704198526191432198
# Card holder: NGUYEN VAN A
# Expiry: 07/15
# OTP: 123456
```

**Momo Test:**
```bash
# Create payment URL
curl -X POST http://localhost:3000/api/payments/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "booking-id",
    "method": "momo"
  }'

# Test wallet:
# Phone: 0912345678
# OTP: Auto-sent
```

---

## Mobile App Testing

### 1. Start Metro Bundler

```bash
cd sportmatch-mvp/mobile
npm install
npm start
```

### 2. Run on Device

**Option A: Expo Go (Easiest)**
1. Install Expo Go app on your phone (iOS/Android)
2. Scan the QR code from terminal
3. App will load automatically

**Option B: iOS Simulator**
```bash
npm start
# Press 'i' to open iOS simulator
```

**Option C: Android Emulator**
```bash
npm start
# Press 'a' to open Android emulator
```

### 3. Test Mobile Features

**A. Login Flow**
1. Enter phone number (10 digits)
2. Tap "Gửi mã OTP"
3. Check terminal for dev OTP (in development: 123456)
4. Enter OTP
5. Tap "Xác nhận"
6. Should navigate to Home screen

**B. Home Screen**
1. Verify 30 venues load
2. Test search by name (e.g., "VinSport")
3. Test search by address (e.g., "Cầu Giấy")
4. Filter by sport type
5. Filter by price range
6. Tap on a venue card

**C. Venue Detail Screen**
1. Verify all venue info displays:
   - Name, address, description
   - Court width (narrow/standard/wide)
   - Surface layers (1/2/3)
   - Cleanliness status
   - Lighting specs (type, lux, anti-glare)
   - Noise level (dB)
   - All amenities
   - Court list with pricing
2. Tap "Đặt sân ngay"

**D. Booking Screen**
1. Select date (next 7 days)
2. View available time slots:
   - Green = Available
   - Red = Booked
   - Blue = Selected
3. Select a time slot
4. Verify price calculation
5. Choose payment method (Momo/VNPay)
6. Tap payment button
7. Should redirect to payment gateway

**E. My Bookings Screen**
1. View list of bookings
2. Filter: Upcoming / All
3. Test cancel booking
4. Verify refund calculation message
5. Pull to refresh

### 4. Common Test Scenarios

**Scenario 1: Complete Booking Flow**
1. Login with phone
2. Browse venues
3. Select a venue
4. Choose date and time
5. Complete payment
6. Verify booking appears in My Bookings

**Scenario 2: Cancel Booking**
1. Go to My Bookings
2. Select a confirmed booking
3. Tap "Hủy sân"
4. Verify refund amount
5. Confirm cancellation

**Scenario 3: Search and Filter**
1. Search for "Cầu lông"
2. Filter by "Badminton" sport
3. Filter by "Budget" price range
4. Verify results update correctly

---

## Web App Testing

### 1. Start Web App

```bash
cd sportmatch-mvp/web
npm install
npm start
```

Opens at: `http://localhost:3000` (if backend is on 3000, it will use 3001)

### 2. Test Web Features

**A. Login Flow**
1. Navigate to `http://localhost:3000/login`
2. Enter phone number
3. Click "Gửi mã OTP"
4. Enter OTP (check browser console for dev OTP)
5. Click "Xác nhận"
6. Should redirect to home page

**B. Home Page**
1. Verify venue grid displays
2. Test search bar
3. Test sport filter dropdown
4. Test price filter dropdown
5. Click on a venue card

**C. Venue Detail Page**
1. Verify all technical specs display:
   - Biên sân (court width)
   - Mặt sân (surface type and layers)
   - Ánh sáng (lighting specs)
   - Độ ồn (noise level in dB)
   - All amenities with icons
   - Court pricing table
2. Click "Chọn giờ đặt sân"

**D. Navigation**
1. Test navbar links
2. Verify active state highlights
3. Test logout button

### 3. Browser Compatibility Testing

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

Check:
- Responsive layout
- Button interactions
- Form submissions
- Image loading
- Navigation

### 4. Responsive Design Testing

Test breakpoints:
- Desktop: 1920x1080
- Laptop: 1366x768
- Tablet: 768x1024
- Mobile: 375x667

---

## End-to-End Testing

### Complete User Journey

**Test Case 1: New User Books a Court**

1. **Setup**: Clear browser/app storage
2. **Step 1**: User opens app/website
   - ✅ Redirects to login page
3. **Step 2**: User logs in with phone
   - ✅ Receives OTP
   - ✅ Enters OTP successfully
   - ✅ Redirects to home page
4. **Step 3**: User searches for badminton courts
   - ✅ Filters by "badminton"
   - ✅ Sees 20 results
5. **Step 4**: User selects VinSport venue
   - ✅ Sees all technical specs
   - ✅ Sees biên sân: "Rộng (> 8m)"
   - ✅ Sees 3 lớp mặt sân
   - ✅ Sees lighting: "LED - 550 lux"
   - ✅ Sees noise: "40 dB"
6. **Step 5**: User books a court
   - ✅ Selects tomorrow 6PM
   - ✅ Sees price: 180,000đ
   - ✅ Chooses Momo payment
7. **Step 6**: User completes payment
   - ✅ Redirects to Momo
   - ✅ Completes payment in sandbox
   - ✅ Redirects back to app
8. **Step 7**: Verify booking
   - ✅ Booking shows in My Bookings
   - ✅ Status: "Đã thanh toán"

**Test Case 2: User Cancels Booking**

1. **Setup**: User has confirmed booking
2. **Step 1**: Navigate to My Bookings
3. **Step 2**: Tap/Click cancel on booking
4. **Step 3**: Read refund policy
   - ✅ Shows correct refund % based on time
5. **Step 4**: Confirm cancellation
6. **Step 5**: Verify refund
   - ✅ Status changes to "Đã hủy"
   - ✅ Refund amount calculated correctly

---

## Common Issues & Solutions

### Backend Issues

**Issue 1: Database connection failed**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL (macOS)
brew services start postgresql

# Start PostgreSQL (Ubuntu)
sudo service postgresql start
```

**Issue 2: Prisma migrations fail**
```
Error: P1001: Can't reach database server
```
**Solution:**
```bash
# Check DATABASE_URL in .env
# Ensure database exists
createdb sportmatch

# Re-run migration
npx prisma migrate dev
```

**Issue 3: OTP not sending**
```
Error: Firebase credentials invalid
```
**Solution:**
1. Check Firebase project setup
2. Verify .env has correct credentials
3. In development, use dev_otp from response

### Mobile App Issues

**Issue 1: Metro bundler stuck**
```bash
# Clear cache
npm start -- --reset-cache
```

**Issue 2: Unable to connect to backend**
```
Error: Network request failed
```
**Solution:**
1. Check backend is running on port 3000
2. Update `mobile/src/config/api.js`:
   ```javascript
   // For iOS simulator
   const API_BASE_URL = 'http://localhost:3000/api';

   // For Android emulator
   const API_BASE_URL = 'http://10.0.2.2:3000/api';

   // For physical device
   const API_BASE_URL = 'http://YOUR_COMPUTER_IP:3000/api';
   ```

**Issue 3: Expo Go app crashes**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Clear Expo cache
expo start -c
```

### Web App Issues

**Issue 1: CORS errors**
```
Access to fetch at 'http://localhost:3000/api' blocked by CORS
```
**Solution:** Backend already has CORS enabled. Check backend is running.

**Issue 2: Blank page after build**
```bash
# Check console for errors
# Verify all components are imported correctly
```

**Issue 3: Assets not loading**
```bash
# Clear browser cache
# Hard reload: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
```

---

## Performance Testing

### Load Testing with Artillery

```bash
# Install Artillery
npm install -g artillery

# Create artillery.yml
artillery quick --count 10 --num 100 http://localhost:3000/api/venues

# Expected:
# - Response time < 200ms
# - Success rate > 99%
```

### Database Performance

```sql
-- Check slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Verify indexes
\d venues
\d bookings

-- Should have indexes on:
-- - venues.sportType
-- - venues.isActive
-- - bookings.userId
-- - bookings.status
```

---

## Security Testing

### Authentication

```bash
# 1. Try accessing protected route without token
curl http://localhost:3000/api/bookings/my-bookings
# Expected: 401 Unauthorized

# 2. Try with invalid token
curl http://localhost:3000/api/bookings/my-bookings \
  -H "Authorization: Bearer invalid-token"
# Expected: 401 Unauthorized

# 3. Try with expired token
# Wait for JWT expiration (default: 7 days)
# Expected: 401 Unauthorized
```

### Input Validation

```bash
# 1. Try invalid phone number
curl -X POST http://localhost:3000/api/auth/send-otp \
  -d '{"phone": "123"}'
# Expected: 400 Bad Request

# 2. Try SQL injection
curl "http://localhost:3000/api/venues?search='; DROP TABLE venues; --"
# Expected: No effect, returns empty results

# 3. Try XSS
curl -X POST http://localhost:3000/api/venues \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name": "<script>alert(1)</script>"}'
# Expected: Input sanitized
```

---

## Automated Testing (Future)

### Unit Tests (Jest)

```bash
# Install Jest
npm install --save-dev jest supertest

# Run tests
npm test

# Example test
test('GET /api/venues returns list of venues', async () => {
  const res = await request(app).get('/api/venues');
  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.venues).toBeInstanceOf(Array);
});
```

### Integration Tests

```bash
# Test complete booking flow
npm run test:integration
```

### E2E Tests (Cypress/Playwright)

```bash
# Install Cypress
npm install --save-dev cypress

# Run E2E tests
npm run test:e2e
```

---

## Test Checklist

Before declaring testing complete, verify:

### Backend
- [ ] Database migrations run successfully
- [ ] Seed data loads (30 venues)
- [ ] Server starts without errors
- [ ] All API endpoints return correct responses
- [ ] Authentication works (OTP send/verify)
- [ ] Authorization works (protected routes)
- [ ] Payment gateways return URLs
- [ ] Booking creation works
- [ ] Booking cancellation + refund calculation works
- [ ] Input validation prevents bad data

### Mobile App
- [ ] App builds and runs on iOS
- [ ] App builds and runs on Android
- [ ] Login flow completes
- [ ] Venue list loads
- [ ] Search/filter works
- [ ] Venue details show all specs
- [ ] Booking flow works
- [ ] My Bookings shows data
- [ ] Cancel booking works
- [ ] Navigation works

### Web App
- [ ] App builds and runs
- [ ] Login flow completes
- [ ] Venue grid displays
- [ ] Search/filter works
- [ ] Venue details show all technical specs
- [ ] All amenities display correctly
- [ ] Court pricing tables show
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop

### End-to-End
- [ ] New user can sign up
- [ ] User can search venues
- [ ] User can book a court
- [ ] Payment redirects correctly
- [ ] Booking appears in My Bookings
- [ ] User can cancel booking
- [ ] Refund calculates correctly

---

## Next Steps

After testing is complete:
1. Fix any bugs found
2. Document issues in GitHub Issues
3. Proceed to [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
4. Deploy to production environment

---

**Last Updated:** 2024-01-17
**Version:** 1.0
**Status:** ✅ Complete
