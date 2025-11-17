# SportMatch MVP - Sports Venue Booking Platform

## 🎯 Vision
Ứng dụng đặt sân thể thao thông minh với thông tin chi tiết, gợi ý AI, và thanh toán tích hợp.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- React Native CLI
- Expo CLI (optional)

### Installation

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your config
npm run migrate
npm run dev

# 2. Web App
cd web
npm install
npm start

# 3. Mobile App
cd mobile
npm install
npm run ios    # or npm run android
```

## 📁 Project Structure

```
sportmatch-mvp/
├── backend/              # API Server
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, validation
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helpers
│   ├── migrations/       # DB migrations
│   └── seeds/            # Sample data
│
├── mobile/               # React Native App
│   ├── src/
│   │   ├── screens/      # App screens
│   │   ├── components/   # Reusable components
│   │   ├── navigation/   # Navigation setup
│   │   ├── services/     # API calls
│   │   ├── store/        # State management
│   │   └── utils/        # Helpers
│   └── assets/           # Images, fonts
│
├── web/                  # React Web App
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── services/     # API calls
│   │   ├── store/        # State management
│   │   └── utils/        # Helpers
│   └── public/           # Static files
│
└── shared/               # Shared code
    ├── types/            # TypeScript types
    └── constants/        # Shared constants
```

## 🎯 MVP Features (Phase 1)

### Core Features
- [x] User authentication (phone + OTP)
- [x] Venue listing with detailed specs
- [x] Search & filter (location, sport, time)
- [x] Booking calendar
- [x] Payment integration (Momo/VNPay)
- [x] Booking management
- [x] Basic admin panel

### NOT in MVP (Phase 2)
- [ ] AI recommendations
- [ ] Group booking & split payment
- [ ] Find opponents
- [ ] Detailed rating system
- [ ] Social features

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Auth**: JWT + Firebase Auth (OTP)
- **Payment**: VNPay/Momo SDK
- **File Storage**: AWS S3 / Cloudinary

### Mobile
- **Framework**: React Native 0.72+
- **Navigation**: React Navigation
- **State**: Redux Toolkit
- **UI**: React Native Paper
- **Maps**: React Native Maps

### Web
- **Framework**: React 18+
- **Routing**: React Router v6
- **State**: Redux Toolkit
- **UI**: Material-UI / Tailwind CSS
- **Maps**: Google Maps API

## 📊 Database Schema

See `backend/prisma/schema.prisma` for full schema.

Key tables:
- `users` - User accounts
- `venues` - Sports venues
- `courts` - Individual courts within venues
- `bookings` - Booking records
- `payments` - Payment transactions
- `reviews` - User reviews

## 🔐 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/sportmatch
JWT_SECRET=your-secret-key
FIREBASE_PROJECT_ID=your-firebase-project
VNPAY_TMN_CODE=your-vnpay-code
VNPAY_HASH_SECRET=your-vnpay-secret
MOMO_PARTNER_CODE=your-momo-code
MOMO_ACCESS_KEY=your-momo-key
```

### Mobile & Web (.env)
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_GOOGLE_MAPS_KEY=your-maps-key
```

## 🚦 API Endpoints

### Authentication
- POST `/api/auth/send-otp` - Send OTP
- POST `/api/auth/verify-otp` - Verify OTP & login
- POST `/api/auth/refresh` - Refresh token

### Venues
- GET `/api/venues` - List venues (with filters)
- GET `/api/venues/:id` - Get venue details
- POST `/api/venues` - Create venue (admin)

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings/my` - User's bookings
- PUT `/api/bookings/:id` - Update booking
- DELETE `/api/bookings/:id` - Cancel booking

### Payments
- POST `/api/payments/create` - Create payment
- POST `/api/payments/callback` - Payment callback (VNPay/Momo)
- GET `/api/payments/:id` - Payment status

See full API docs in `docs/API.md`

## 📱 Deployment

### Backend
- **Platform**: AWS EC2 / DigitalOcean / Railway
- **Database**: Managed PostgreSQL (AWS RDS / Supabase)
- **Cost**: ~$20-50/month

### Web
- **Platform**: Vercel / Netlify (Free tier)
- **CDN**: Cloudflare

### Mobile
- **iOS**: TestFlight → App Store
- **Android**: Google Play Console

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Mobile tests
cd mobile
npm test

# Web tests
cd web
npm test
```

## 📈 Metrics to Track

- DAU/MAU (Daily/Monthly Active Users)
- Booking conversion rate
- Average booking value
- Payment success rate
- User retention (D1, D7, D30)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT

## 👥 Team

- **Product**: [Your Name]
- **Development**: [Your Name]
- **Design**: [Designer Name]

## 📞 Contact

- Email: contact@sportmatch.vn
- Website: https://sportmatch.vn
