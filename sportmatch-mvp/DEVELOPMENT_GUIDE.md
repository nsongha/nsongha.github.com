# SportMatch MVP - Development Guide

## 🚀 Quick Start (5 minutes)

### 1. Clone & Setup

```bash
cd sportmatch-mvp

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials

# Create database
createdb sportmatch

# Run migrations
npx prisma migrate dev

# Seed sample data
npm run seed

# Start server
npm run dev
```

Backend will run on `http://localhost:3000`

### 2. Test API

```bash
# Health check
curl http://localhost:3000/health

# Get venues
curl http://localhost:3000/api/venues
```

---

## 📁 Complete File Structure

```
sportmatch-mvp/
├── backend/
│   ├── package.json                 ✅ Created
│   ├── .env.example                 ✅ Created
│   ├── prisma/
│   │   └── schema.prisma            ✅ Created - Full database schema
│   ├── src/
│   │   ├── server.js                ✅ Created - Main server
│   │   ├── routes/
│   │   │   ├── auth.js              ✅ Created - Auth routes
│   │   │   ├── venues.js            ✅ Created - Venue routes
│   │   │   ├── bookings.js          ✅ Created - Booking routes
│   │   │   ├── payments.js          ✅ Created - Payment routes
│   │   │   └── users.js             ✅ Created - User routes
│   │   ├── controllers/             🔨 Next - Business logic
│   │   ├── services/                🔨 Next - Payment integrations
│   │   ├── middleware/              🔨 Next - Auth, validation
│   │   └── utils/                   🔨 Next - Helpers
│   └── seeds/                       🔨 Next - Sample data
│
├── mobile/                          🔨 Todo - React Native app
├── web/                             🔨 Todo - React web app
└── shared/                          🔨 Todo - Shared types
```

---

## 🏗️ MVP Scope

### ✅ Phase 1 - Core Backend (Current)

- [x] Database schema (Users, Venues, Courts, Bookings, Payments, Reviews)
- [x] API routes structure
- [ ] Controllers implementation
- [ ] Auth middleware (JWT)
- [ ] Payment services (VNPay/Momo)
- [ ] Seed data (10 sample venues)

### 🔨 Phase 2 - Frontend (Next 1-2 weeks)

**Mobile App (React Native)**
- [ ] Navigation setup
- [ ] Login/OTP screen
- [ ] Venue listing
- [ ] Venue details
- [ ] Booking flow
- [ ] Payment integration
- [ ] My bookings

**Web App (React)**
- [ ] Same features as mobile
- [ ] Admin panel (venue management)

### 🎯 Phase 3 - Deployment

- [ ] Deploy backend (Railway/Heroku)
- [ ] Deploy web (Vercel)
- [ ] Submit mobile to TestFlight/Play Store Beta

---

## 💡 Development Tips

### Database Schema Highlights

**Key Features Built-in:**
1. **User Profiling**: Sport type, skill level, preferences → ready for AI matching
2. **Detailed Venue Specs**: All technical parameters you mentioned (lighting lux, noise dB, etc.)
3. **Flexible Pricing**: Different prices for weekday/weekend, morning/afternoon/evening
4. **Payment Tracking**: Full transaction history, refund support
5. **Reviews**: 6-category rating system

### Smart Design Decisions

1. **UUID Primary Keys**: Better for distributed systems, no sequential ID exposure
2. **JSON Fields**: Flexible for location data, images array
3. **Enum-like Strings**: Easy to query, no need for lookup tables
4. **Soft Delete Pattern**: `isActive` flag instead of hard delete
5. **Timestamps**: Auto `createdAt`, `updatedAt` on all tables

### API Endpoints Available

```
Auth:
POST   /api/auth/send-otp
POST   /api/auth/verify-otp
POST   /api/auth/refresh

Venues:
GET    /api/venues?sport=badminton&lat=10.762622&lng=106.660172&radius=5
GET    /api/venues/:id
GET    /api/venues/:id/availability?date=2025-11-18
POST   /api/venues (admin/owner only)
PUT    /api/venues/:id (admin/owner only)

Bookings:
POST   /api/bookings
GET    /api/bookings/my
GET    /api/bookings/:id
PUT    /api/bookings/:id
DELETE /api/bookings/:id (cancel)
POST   /api/bookings/:id/checkin

Payments:
POST   /api/payments/create
GET    /api/payments/:id
GET    /api/payments/vnpay/callback
POST   /api/payments/momo/notify

Users:
GET    /api/users/me
PUT    /api/users/me
PUT    /api/users/me/preferences
```

---

## 🔧 Next Steps to Complete Backend

### 1. Create Controllers (Business Logic)

Need to implement:
- `authController.js` - OTP sending via Firebase, JWT generation
- `venueController.js` - CRUD + search with geo-location
- `bookingController.js` - Create booking, check availability, cancel
- `paymentController.js` - VNPay/Momo integration
- `userController.js` - Profile management

### 2. Create Services

- `firebaseService.js` - Send OTP via Firebase Auth
- `vnpayService.js` - VNPay payment integration
- `momoService.js` - Momo payment integration
- `emailService.js` - (Optional) Email notifications

### 3. Create Middleware

- `auth.js` - JWT verification, role-based access
- `validation.js` - Request validation
- `errorHandler.js` - Centralized error handling

### 4. Seed Sample Data

Create realistic data:
- 20-30 venues across TP.HCM
- Different sports (badminton, football, tennis)
- Various price ranges (80k-300k/hour)
- Complete technical specs

---

## 🎨 Mobile App Preview (Structure)

```
mobile/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── OTPScreen.js
│   │   ├── home/
│   │   │   └── HomeScreen.js          # Search + recommended venues
│   │   ├── venue/
│   │   │   ├── VenueListScreen.js     # Search results
│   │   │   ├── VenueDetailScreen.js   # Detailed specs
│   │   │   └── BookingScreen.js       # Calendar + payment
│   │   ├── profile/
│   │   │   ├── ProfileScreen.js
│   │   │   └── MyBookingsScreen.js
│   │   └── payment/
│   │       └── PaymentScreen.js
│   ├── components/
│   │   ├── VenueCard.js
│   │   ├── CourtCalendar.js
│   │   ├── SpecsDisplay.js            # Show technical specs
│   │   └── RatingDisplay.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── services/
│   │   └── api.js                     # Axios instance
│   └── store/
│       └── slices/                    # Redux slices
```

---

## 💰 Payment Integration Guide

### VNPay Setup

1. Register at https://sandbox.vnpayment.vn/
2. Get TMN Code and Hash Secret
3. Test cards provided in sandbox

### Momo Setup

1. Register at https://developers.momo.vn/
2. Get Partner Code and Access Key
3. Use test environment

### Flow:
```
1. User selects payment method
2. Backend creates payment record (status: pending)
3. Backend generates payment URL (VNPay/Momo)
4. Frontend redirects to payment page
5. User completes payment
6. Gateway calls callback URL
7. Backend updates payment status
8. Backend updates booking status
9. User sees confirmation
```

---

## 📊 Sample Data Structure

### Sample Venue (for seeding):

```javascript
{
  name: "Sân Cầu Lông ABC - Quận 7",
  address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
  location: { lat: 10.732971, lng: 106.721338 },
  sportType: "badminton",
  phone: "0901234567",

  // Technical specs (as per your requirements!)
  courtWidthType: "wide",         // 10m biên
  surfaceType: "plastic",
  surfaceLayers: 3,                // 3 lớp
  cleanliness: "clean",            // Sạch sẽ

  lightingType: "led",
  lightingLux: 500,                // Đo cụ thể
  hasAntiGlare: true,              // Có che chói

  noiseLevel: 45,                  // dB - yên tĩnh

  freeParking: true,               // Gửi xe free!
  hasAC: true,
  standardBallBrand: "Yonex",

  // Pricing
  courts: [
    {
      number: 1,
      priceWeekdayEvening: 150000,  // Your actual price!
      priceWeekendEvening: 180000,
      priceWeekdayMorning: 80000,   // Off-peak
    }
  ]
}
```

---

## 🤖 AI Recommendation (Phase 2)

When you're ready to add AI matching, the database is ready with:
- User preferences (home/work location, skill level, play frequency)
- Venue specs (all technical parameters)
- Booking history
- Review ratings

Simple algorithm to start:
```javascript
function calculateMatchScore(user, venue) {
  let score = 0;

  // Distance (30%)
  const distance = calculateDistance(user.homeLocation, venue.location);
  if (distance < user.maxDistance) score += 30 * (1 - distance/user.maxDistance);

  // Skill level match (20%)
  if (venue.ratingSurface >= getMinRating(user.skillLevel)) score += 20;

  // Price (20%)
  const avgPrice = calculateAvgPrice(venue);
  if (avgPrice >= user.budgetMin && avgPrice <= user.budgetMax) score += 20;

  // Quality (20%)
  score += venue.ratingOverall * 4;

  // Amenities (10%)
  score += calculateAmenityScore(user, venue);

  return score;
}
```

---

## 📱 Mobile vs Web Priority

Based on Vietnam market:
1. **Start with Mobile** - 90% users on mobile
2. **Web for Admin** - Venue owners manage on desktop

Timeline:
- Week 1-2: Backend complete
- Week 3-4: Mobile MVP
- Week 5: Web admin panel
- Week 6: Beta test + deploy

---

## 🚢 Deployment Options

### Backend:
1. **Railway** (Recommended) - $5/month, easy deploy, includes PostgreSQL
2. **Heroku** - Free tier, but slow cold starts
3. **DigitalOcean** - $12/month droplet, more control

### Database:
1. **Railway PostgreSQL** (included)
2. **Supabase** - Free tier, good dashboard
3. **AWS RDS** - $15/month minimum

### Web:
1. **Vercel** (Recommended) - Free, auto-deploy from Git
2. **Netlify** - Free, similar to Vercel

### Mobile:
1. **TestFlight** (iOS) - Free, up to 10,000 testers
2. **Google Play Internal Testing** - Free

---

## 🎯 Launch Checklist

Before launch:
- [ ] 10+ real venues onboarded
- [ ] Payment tested end-to-end
- [ ] Mobile app on TestFlight/Play Store Beta
- [ ] Privacy policy & Terms of Service
- [ ] Customer support process (Zalo/phone)
- [ ] Marketing materials ready
- [ ] Social media accounts
- [ ] Track analytics (Mixpanel/Google Analytics)

---

## 💡 Pro Tips from Your Requirements

You mentioned these pain points - here's how we solve them:

### 1. "Thông tin sân rõ ràng"
✅ Database has all fields: biên rộng/hẹp, mặt sân mấy lớp, bụi/sạch, đèn, chói mắt, ồn, gửi xe, bóng chuẩn

### 2. "Suggest sân phù hợp"
✅ User profile stores: trình độ, thời gian chơi, thường xuyên, học thầy, vị trí nhà, lịch trình
✅ Ready for AI algorithm

### 3. "Lịch đặt rõ ràng, dễ thực hiện"
✅ Booking model with clear date/time
✅ Frontend will show visual calendar

### 4. "Giao dịch nhanh trong app"
✅ Full VNPay/Momo integration
✅ No screenshots needed!
✅ Auto confirmation

---

Want me to:
1. **Continue coding** backend controllers/services?
2. **Start mobile app** structure?
3. **Create seed data** with realistic venues?
4. **Setup deployment** configs?

Let me know what's priority! 🚀
