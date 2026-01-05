# PrayerTime Navigator - Project Structure

## Complete Directory Structure

```
Namaz-masjid-nearbyme/
│
├── android/                          # Android native code
│   ├── app/
│   │   ├── src/
│   │   └── build.gradle
│   └── gradle/
│
├── ios/                              # iOS native code
│   ├── PrayerTimeNavigator/
│   │   ├── AppDelegate.h
│   │   ├── AppDelegate.m
│   │   └── Info.plist
│   └── Podfile
│
├── backend/                          # Backend API Server
│   ├── src/
│   │   ├── models/                  # MongoDB models
│   │   │   ├── Mosque.js
│   │   │   ├── PrayerTimeReport.js
│   │   │   └── Testimonial.js
│   │   ├── routes/                  # API routes
│   │   │   ├── mosques.js
│   │   │   ├── prayerTimes.js
│   │   │   ├── testimonials.js
│   │   │   └── committee.js
│   │   └── server.js                # Express server
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── src/                              # React Native source code
│   ├── components/                   # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Loading.tsx
│   │
│   ├── screens/                      # App screens
│   │   ├── Auth/
│   │   │   └── LoginScreen.tsx
│   │   ├── Map/
│   │   │   └── MapScreen.tsx
│   │   ├── Mosque/
│   │   │   ├── MosqueListScreen.tsx
│   │   │   └── MosqueDetailScreen.tsx
│   │   ├── PrayerTimes/
│   │   │   └── PrayerTimesScreen.tsx
│   │   └── Profile/
│   │       └── ProfileScreen.tsx
│   │
│   ├── navigation/                   # Navigation setup
│   │   ├── AppNavigator.tsx
│   │   └── MainTabNavigator.tsx
│   │
│   ├── services/                     # Business logic services
│   │   ├── AuthService.ts           # Firebase authentication
│   │   ├── LocationService.ts       # Location tracking
│   │   ├── ApiService.ts            # API communication
│   │   ├── PrayerTimeService.ts     # Prayer time logic
│   │   ├── NotificationService.ts   # Push notifications
│   │   └── CrowdDensityService.ts   # Crowd analysis
│   │
│   ├── models/                       # TypeScript types/interfaces
│   │   ├── User.ts
│   │   ├── Mosque.ts
│   │   └── Route.ts
│   │
│   ├── store/                        # Redux state management
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── mosqueSlice.ts
│   │   │   ├── locationSlice.ts
│   │   │   └── prayerTimeSlice.ts
│   │   └── index.ts                 # Store configuration
│   │
│   ├── utils/                        # Utility functions
│   │   ├── StorageService.ts        # AsyncStorage wrapper
│   │   └── validators.ts            # Input validation
│   │
│   ├── constants/                    # App constants
│   │   └── index.ts                 # Colors, API endpoints, etc.
│   │
│   └── App.tsx                       # Root component
│
├── assets/                           # Static assets
│   ├── images/
│   │   ├── logo.png
│   │   └── icon.png
│   ├── fonts/
│   └── README.md
│
├── __tests__/                        # Test files
│   ├── services/
│   ├── components/
│   └── utils/
│
├── .env.example                      # Environment variables template
├── .gitignore                        # Git ignore rules
├── .eslintrc.js                      # ESLint configuration
├── .prettierrc.js                    # Prettier configuration
├── babel.config.js                   # Babel configuration
├── metro.config.js                   # Metro bundler config
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
├── app.json                          # React Native configuration
├── index.js                          # Entry point
│
├── README.md                         # Main documentation
├── SETUP.md                          # Setup instructions
├── CONTRIBUTING.md                   # Contribution guidelines
├── LICENSE                           # MIT License
└── PROJECT_STRUCTURE.md             # This file
```

## Key Components

### Mobile App (React Native)

#### Frontend Layer
- **Screens**: User-facing pages (Login, Map, Mosque List, Prayer Times, Profile)
- **Components**: Reusable UI elements
- **Navigation**: App routing and screen transitions

#### Business Logic Layer
- **Services**: Core functionality (Auth, Location, API, Prayer Times)
- **Models**: TypeScript type definitions
- **Store**: Redux state management

#### Data Layer
- **Utils**: Helper functions and utilities
- **Constants**: App-wide constants and configurations

### Backend API (Node.js + Express)

#### API Layer
- **Routes**: RESTful API endpoints
- **Middleware**: Authentication, validation, rate limiting

#### Database Layer
- **Models**: Mongoose schemas for MongoDB
- **Services**: Business logic for data operations

#### Real-time Layer
- **Socket.io**: WebSocket connections for live updates

## Data Flow

```
User Action
    ↓
React Native Screen
    ↓
Redux Action
    ↓
Service Layer (AuthService, ApiService, etc.)
    ↓
HTTP Request / WebSocket
    ↓
Backend API
    ↓
MongoDB Database
    ↓
Response
    ↓
Redux Store Update
    ↓
Screen Re-render
```

## Technology Stack

### Mobile App
- **Framework**: React Native 0.73
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Maps**: react-native-maps (Google Maps)
- **Authentication**: Firebase Auth
- **Storage**: AsyncStorage
- **Push Notifications**: react-native-push-notification

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io
- **Authentication**: Firebase Admin SDK
- **Validation**: express-validator

### Development Tools
- **Build Tool**: Metro Bundler
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Jest
- **Version Control**: Git

## Module Dependencies

### Core Dependencies
```
User Authentication
    ├── Firebase Auth
    ├── Google Sign-In
    └── Facebook Login

Location Services
    ├── react-native-geolocation-service
    └── Google Maps API

Prayer Time Management
    ├── date-fns (date calculations)
    └── Custom prayer time logic

Data Persistence
    ├── AsyncStorage (local)
    └── MongoDB (server)

Real-time Updates
    └── Socket.io
```

## API Integration Points

### External APIs
1. **Firebase Authentication API**
   - Google OAuth
   - Facebook OAuth

2. **Google Maps API**
   - Maps SDK
   - Places API
   - Geocoding API

3. **Custom Backend API**
   - Mosques endpoints
   - Prayer times endpoints
   - Testimonials endpoints
   - Committee approval endpoints

## Security Considerations

- Environment variables for sensitive data
- HTTPS for API communication
- JWT tokens for authentication
- Input validation on all endpoints
- Rate limiting on API
- SQL injection prevention
- XSS protection

## Performance Optimizations

- Lazy loading of screens
- Image optimization
- Redux persist for offline access
- Cached mosque data
- Debounced search inputs
- Optimized re-renders with React.memo
- Connection pooling for MongoDB
- API response caching

## Scalability

- Horizontal scaling for backend
- Database indexing for fast queries
- CDN for static assets
- Load balancing
- Microservices architecture (future)
- Caching layer (Redis - future)
