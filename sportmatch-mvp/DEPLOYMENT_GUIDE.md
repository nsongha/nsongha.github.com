# 🚀 SportMatch MVP - Deployment Guide

## Table of Contents
1. [Overview](#overview)
2. [Production Environment Setup](#production-environment-setup)
3. [Backend Deployment](#backend-deployment)
4. [Database Deployment](#database-deployment)
5. [Mobile App Deployment](#mobile-app-deployment)
6. [Web App Deployment](#web-app-deployment)
7. [Domain & SSL Setup](#domain--ssl-setup)
8. [Monitoring & Logging](#monitoring--logging)
9. [Cost Estimation](#cost-estimation)

---

## Overview

### Recommended Infrastructure

```
┌─────────────────────────────────────────┐
│         Production Architecture          │
├─────────────────────────────────────────┤
│                                         │
│  Users (Mobile + Web)                   │
│         ↓                               │
│  CloudFlare CDN (SSL + DDoS)           │
│         ↓                               │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  Web App     │  │  Backend API │   │
│  │  (Vercel)    │  │  (Railway)   │   │
│  └──────────────┘  └──────────────┘   │
│         ↓                ↓              │
│         └────────┬───────┘             │
│                  ↓                      │
│         ┌──────────────┐               │
│         │  PostgreSQL  │               │
│         │  (Supabase)  │               │
│         └──────────────┘               │
│                                         │
│  External Services:                     │
│  - Firebase (OTP SMS)                   │
│  - VNPay (Payment)                      │
│  - Momo (Payment)                       │
│  - Expo (Mobile OTA Updates)            │
└─────────────────────────────────────────┘
```

---

## Production Environment Setup

### 1. Create Accounts

- [ ] **Railway** (https://railway.app) - Backend hosting
- [ ] **Supabase** (https://supabase.com) - PostgreSQL database
- [ ] **Vercel** (https://vercel.com) - Web app hosting
- [ ] **Firebase** (https://firebase.google.com) - OTP SMS
- [ ] **CloudFlare** (https://cloudflare.com) - CDN + SSL
- [ ] **VNPay** (https://vnpay.vn) - Payment gateway
- [ ] **Momo** (https://business.momo.vn) - Payment gateway
- [ ] **Expo** (https://expo.dev) - Mobile app updates

### 2. Domain Name

Register domain (e.g., sportmatch.vn):
- **Recommended**: Tên Miền Việt Nam, GoDaddy, Namecheap
- **Cost**: ~$10-15/year

---

## Backend Deployment

### Option 1: Railway (Recommended - Easiest)

**Step 1: Create Railway Project**

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select `nsongha.github.com` repository
6. Select `sportmatch-mvp/backend` folder

**Step 2: Configure Environment Variables**

In Railway dashboard, add variables:

```env
# Database (will be auto-filled by Railway if you add Postgres plugin)
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=YOUR_SUPER_SECRET_KEY_CHANGE_THIS_NOW
JWT_REFRESH_SECRET=YOUR_REFRESH_SECRET_KEY

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key-here
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# VNPay Production
VNPAY_TMN_CODE=YOUR_PRODUCTION_CODE
VNPAY_HASH_SECRET=YOUR_PRODUCTION_SECRET
VNPAY_URL=https://pay.vnpay.vn/vpcpay.html

# Momo Production
MOMO_PARTNER_CODE=YOUR_PARTNER_CODE
MOMO_ACCESS_KEY=YOUR_ACCESS_KEY
MOMO_SECRET_KEY=YOUR_SECRET_KEY
MOMO_ENDPOINT=https://payment.momo.vn/v2/gateway/api/create

# Environment
NODE_ENV=production
PORT=3000

# CORS
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

**Step 3: Add PostgreSQL Plugin**

1. In Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Database URL will auto-populate in environment variables

**Step 4: Run Migrations**

Railway will automatically run:
```bash
npm install
npx prisma migrate deploy
```

If manual migration needed:
```bash
# In Railway CLI
railway run npx prisma migrate deploy

# OR use Railway dashboard shell
```

**Step 5: Seed Production Data**

```bash
# SSH into Railway container
railway run node src/seeds/index.js
```

**Step 6: Deploy**

```bash
git push origin main
```

Railway auto-deploys on push to main branch.

**Your backend will be live at:**
```
https://your-project.railway.app
```

---

### Option 2: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create sportmatch-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
# ... (all other env vars)

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy

# Seed data
heroku run node src/seeds/index.js
```

---

### Option 3: DigitalOcean App Platform

1. Go to https://cloud.digitalocean.com/apps
2. Create New App
3. Connect GitHub repo
4. Select `sportmatch-mvp/backend`
5. Add PostgreSQL database (Managed Database)
6. Set environment variables
7. Deploy

**Cost:** $12/month (Basic + Database)

---

## Database Deployment

### Option 1: Supabase (Recommended - Free Tier)

1. Go to https://supabase.com
2. Create new project
3. Choose region (Singapore for Vietnam users)
4. Wait for database provisioning
5. Get connection string:
   ```
   Settings → Database → Connection String
   ```

6. Update backend .env:
   ```env
   DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
   ```

7. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

**Free Tier Limits:**
- 500 MB database
- 2 GB bandwidth/month
- ✅ Perfect for MVP testing

**Paid Tier ($25/month):**
- 8 GB database
- 100 GB bandwidth/month
- Daily backups

---

### Option 2: AWS RDS PostgreSQL

```bash
# 1. Create RDS instance (AWS Console)
# 2. Choose PostgreSQL 14
# 3. Instance class: db.t3.micro ($15/month)
# 4. Storage: 20 GB SSD
# 5. Enable automatic backups
# 6. Get endpoint URL

# 7. Update DATABASE_URL
DATABASE_URL="postgresql://username:password@rds-endpoint.amazonaws.com:5432/sportmatch"

# 8. Run migrations
npx prisma migrate deploy
```

---

### Backup Strategy

**Automated Backups:**

```bash
# Daily backup script (cron job)
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump $DATABASE_URL > /backups/sportmatch_$DATE.sql
aws s3 cp /backups/sportmatch_$DATE.sql s3://sportmatch-backups/
```

**Setup Cron:**
```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup.sh
```

---

## Mobile App Deployment

### iOS App Store

**Prerequisites:**
- Apple Developer Account ($99/year)
- Mac computer with Xcode
- iPhone for testing

**Step 1: Configure App**

```bash
cd sportmatch-mvp/mobile

# Update app.json
{
  "expo": {
    "name": "SportMatch",
    "slug": "sportmatch",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.sportmatch.app",
      "buildNumber": "1.0.0",
      "supportsTablet": true
    },
    "extra": {
      "apiUrl": "https://api.sportmatch.vn"
    }
  }
}
```

**Step 2: Build for iOS**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build
eas build --platform ios --profile production
```

**Step 3: Submit to App Store**

```bash
eas submit --platform ios
```

Alternatively, manual submission:
1. Download .ipa file
2. Open Xcode → Window → Organizer
3. Upload to App Store Connect
4. Fill metadata (screenshots, description)
5. Submit for review

**Review Time:** 1-3 days

---

### Android Play Store

**Prerequisites:**
- Google Play Developer Account ($25 one-time)
- Android device for testing

**Step 1: Configure App**

```javascript
// app.json
{
  "expo": {
    "android": {
      "package": "com.sportmatch.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png"
      }
    }
  }
}
```

**Step 2: Generate Keystore**

```bash
# Generate keystore
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore sportmatch.keystore \
  -alias sportmatch \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Step 3: Build AAB**

```bash
# Build Android App Bundle
eas build --platform android --profile production

# Or using Expo
expo build:android -t app-bundle
```

**Step 4: Upload to Play Console**

1. Go to https://play.google.com/console
2. Create app
3. Upload AAB file
4. Fill store listing:
   - Screenshots (min 2)
   - Feature graphic
   - Description
   - Privacy policy URL
5. Submit for review

**Review Time:** 1-7 days

---

### OTA Updates (Over-The-Air)

Enable instant updates without app store submission:

```bash
# Publish update
eas update --branch production --message "Bug fixes"

# Users get update automatically on next app open
```

**Benefits:**
- Fix bugs instantly
- No app store review needed
- Rollback if issues occur

---

## Web App Deployment

### Option 1: Vercel (Recommended - Fastest)

**Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

**Step 2: Deploy**

```bash
cd sportmatch-mvp/web

# Login
vercel login

# Deploy
vercel --prod

# Follow prompts:
# - Link to existing project or create new
# - Set build command: npm run build
# - Set output directory: build
```

**Step 3: Configure Environment**

In Vercel dashboard:
```env
REACT_APP_API_URL=https://api.sportmatch.vn
```

**Step 4: Custom Domain**

1. Vercel Dashboard → Settings → Domains
2. Add domain: www.sportmatch.vn
3. Update DNS (see below)

**Auto-deploys on git push to main!**

---

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd sportmatch-mvp/web
netlify deploy --prod

# Set build command: npm run build
# Set publish directory: build
```

---

### Option 3: Nginx + DigitalOcean Droplet

```bash
# 1. Create $5/month droplet (Ubuntu 22.04)

# 2. SSH into server
ssh root@your-server-ip

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install Nginx
sudo apt install nginx

# 5. Clone repo
git clone https://github.com/nsongha/nsongha.github.com.git
cd nsongha.github.com/sportmatch-mvp/web

# 6. Build
npm install
npm run build

# 7. Configure Nginx
sudo nano /etc/nginx/sites-available/sportmatch

# Add:
server {
    listen 80;
    server_name sportmatch.vn www.sportmatch.vn;
    root /path/to/sportmatch-mvp/web/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 8. Enable site
sudo ln -s /etc/nginx/sites-available/sportmatch /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 9. Add SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d sportmatch.vn -d www.sportmatch.vn
```

---

## Domain & SSL Setup

### 1. Domain DNS Configuration

Point your domain to services:

**CloudFlare DNS Settings:**

```
Type    Name    Content                     Proxy
A       @       [Your-Backend-IP]           Yes
CNAME   www     sportmatch.vn               Yes
CNAME   api     your-backend.railway.app    Yes
```

**Example:**
```
sportmatch.vn           →  Web App (Vercel)
www.sportmatch.vn       →  Web App (Vercel)
api.sportmatch.vn       →  Backend (Railway)
```

### 2. SSL Certificate

**Option A: CloudFlare (Easiest)**
1. Add site to CloudFlare
2. Update nameservers at domain registrar
3. SSL auto-enabled!

**Option B: Let's Encrypt (Free)**
```bash
sudo certbot --nginx -d sportmatch.vn -d www.sportmatch.vn
```

**Option C: Railway/Vercel**
- SSL automatically provided!

---

## Monitoring & Logging

### Application Monitoring

**Sentry (Error Tracking):**

```bash
# Install
npm install @sentry/node @sentry/react

# Backend (server.js)
const Sentry = require("@sentry/node");
Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});

# Frontend (index.js)
import * as Sentry from "@sentry/react";
Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

**New Relic (APM):**
```bash
npm install newrelic
```

---

### Logging

**Production Logging Setup:**

```javascript
// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

**Log Aggregation (Logtail):**
```bash
# Free tier: 1GB/month
# https://logtail.com
```

---

### Uptime Monitoring

**UptimeRobot (Free):**
1. Go to https://uptimerobot.com
2. Add monitors:
   - https://api.sportmatch.vn/health
   - https://sportmatch.vn
3. Set alert contacts (email/SMS)
4. Check interval: 5 minutes

---

### Analytics

**Google Analytics 4:**

```html
<!-- Add to web/public/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Mixpanel (Mobile Analytics):**
```bash
expo install expo-analytics-segment
```

---

## Cost Estimation

### Monthly Costs (Production)

| Service | Free Tier | Paid Plan | Recommended |
|---------|-----------|-----------|-------------|
| **Backend (Railway)** | $0 (500 hrs) | $5-20/month | $20/month |
| **Database (Supabase)** | $0 (500MB) | $25/month | $25/month |
| **Web Hosting (Vercel)** | $0 | $20/month | Free tier OK |
| **CloudFlare CDN** | $0 | - | Free |
| **Domain** | - | $12/year | $12/year |
| **Firebase (SMS)** | $0 (10k/month) | Pay as you go | ~$20/month |
| **Sentry** | $0 (5k errors) | $26/month | Free tier OK |
| **UptimeRobot** | $0 | - | Free |
| **Apple Developer** | - | $99/year | $99/year |
| **Google Play** | - | $25 one-time | $25 one-time |
| **VNPay** | - | 1-2% transaction | - |
| **Momo** | - | 1-2% transaction | - |

**Total Initial Cost:**
- Setup: ~$150 (domain + app store accounts)
- Monthly: ~$65 (backend + database + Firebase)

**After 100 bookings/day:**
- Monthly: ~$150 (need bigger database + more backend resources)

**At Scale (1000 bookings/day):**
- Monthly: ~$500-800 (scaled infrastructure)

---

## Security Checklist

Before going live:

- [ ] Change all default secrets
- [ ] Enable HTTPS/SSL everywhere
- [ ] Enable CORS only for your domains
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Add CSRF protection
- [ ] Sanitize all user inputs
- [ ] Enable SQL injection protection (Prisma does this)
- [ ] Add security headers:
  ```javascript
  app.use(helmet());
  app.use(helmet.contentSecurityPolicy());
  app.use(helmet.hsts());
  ```
- [ ] Enable 2FA for admin accounts
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Enable DDoS protection (CloudFlare)
- [ ] Add monitoring & alerts
- [ ] Implement error tracking (Sentry)
- [ ] Regular dependency updates
- [ ] Security audit logs

---

## Go-Live Checklist

- [ ] All tests passing
- [ ] Backend deployed and healthy
- [ ] Database deployed with backups
- [ ] Web app deployed and accessible
- [ ] Mobile apps submitted to stores
- [ ] Domain configured with SSL
- [ ] Monitoring enabled
- [ ] Error tracking configured
- [ ] Analytics set up
- [ ] Payment gateways in production mode
- [ ] Firebase SMS quota sufficient
- [ ] Legal pages added (Terms, Privacy)
- [ ] Support email configured
- [ ] Social media accounts created
- [ ] Marketing materials ready
- [ ] Press release prepared
- [ ] Beta testing completed
- [ ] Performance optimized
- [ ] SEO configured
- [ ] Sitemap submitted to Google

---

## Post-Launch

### Week 1
- Monitor error rates
- Check server performance
- Verify payment flows
- Respond to user feedback
- Fix critical bugs immediately

### Week 2-4
- Analyze user behavior
- Optimize slow queries
- Add requested features
- Improve UX based on data

### Month 2+
- Scale infrastructure as needed
- A/B test features
- Expand to more cities
- Launch marketing campaigns

---

## Support & Maintenance

### Ongoing Tasks
- Weekly dependency updates
- Monthly security patches
- Daily backup verification
- Performance monitoring
- User support responses
- Bug fixes
- Feature development

---

**Last Updated:** 2024-01-17
**Version:** 1.0
**Status:** ✅ Complete

**Ready to deploy!** 🚀
