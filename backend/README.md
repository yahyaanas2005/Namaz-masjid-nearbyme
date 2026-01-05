# Backend API Server for PrayerTime Navigator

This directory contains the backend API server for the PrayerTime Navigator application.

## Tech Stack

- Node.js with Express.js
- MongoDB for database
- Firebase Admin SDK for authentication
- Socket.io for real-time updates

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/prayertime-navigator
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/serviceAccountKey.json
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

3. Start the server:
```bash
npm run dev
```

## API Endpoints

### Mosques
- `GET /api/mosques/nearby` - Get nearby mosques
- `GET /api/mosques/:id` - Get mosque by ID
- `POST /api/mosques` - Create new mosque (Admin only)
- `PUT /api/mosques/:id` - Update mosque
- `DELETE /api/mosques/:id` - Delete mosque (Admin only)
- `GET /api/mosques/search` - Search mosques

### Prayer Times
- `GET /api/prayer-times/:mosqueId` - Get prayer times for mosque
- `POST /api/prayer-times/report` - Submit prayer time report
- `GET /api/prayer-times/:mosqueId/validated` - Get validated prayer times
- `GET /api/prayer-times/:mosqueId/historical` - Get historical prayer times

### Testimonials
- `GET /api/testimonials/:mosqueId` - Get testimonials for mosque
- `POST /api/testimonials` - Submit new testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial
- `POST /api/testimonials/:id/like` - Like a testimonial

### Crowd Density
- `GET /api/mosques/:mosqueId/crowd-density` - Get crowd density
- `POST /api/mosques/:mosqueId/crowd-density` - Update crowd density
- `GET /api/mosques/:mosqueId/crowd-density/history` - Get historical crowd data

### Committee Approval
- `POST /api/committee/approval` - Submit committee approval
- `GET /api/committee/:mosqueId/approvals` - Get approvals for mosque

## Database Schema

See `/backend/models` directory for Mongoose schemas.

## Real-time Updates

The server uses Socket.io for real-time updates:
- Prayer time changes
- Crowd density updates
- New testimonials
- Committee approvals
