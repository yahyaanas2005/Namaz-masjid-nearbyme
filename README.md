# PrayerTime Navigator

A comprehensive mobile application that helps Muslims find nearby mosques and accurate prayer times based on their location through Google Maps integration. The app features crowd-sourced prayer time validation, real-time mosque information, and committee endorsements.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.73-61DAFB.svg)

## 🌟 Features

### Core Features

- **User Authentication**: Sign in using Facebook or Google credentials for personalized experience
- **Location-Based Mosque Search**: Find nearby mosques using Google Maps with real-time location tracking
- **Dynamic Prayer Times**: View prayer times that are validated by community crowd density analysis
- **Crowd Density Validation**: Prayer times are validated when 50+ users report the same time
- **User Testimonials**: Submit and view reviews about mosques, prayer time accuracy, and facilities
- **Committee Approval**: Mosque committees can officially endorse prayer times
- **Real-Time Updates**: Live synchronization of prayer times, crowd density, and testimonials
- **Offline Mode**: Access mosque information even without internet connectivity
- **Push Notifications**: Receive prayer reminders and mosque updates

### Key Innovations

1. **Crowd-Sourced Validation**: Prayer times are validated through collective user feedback
2. **Dual Verification System**: Combines crowd density analysis with committee approval
3. **Historical Records**: Maintains seasonal variations in prayer times
4. **Smart Analytics**: Tracks crowd density patterns to ensure accuracy

## 📱 Screenshots

_Add screenshots here_

## 🏗️ Architecture

### Mobile App (React Native + TypeScript)
```
src/
├── components/        # Reusable UI components
├── screens/          # App screens (Login, Map, Mosque List, etc.)
├── navigation/       # Navigation configuration
├── services/         # API and business logic services
├── models/           # TypeScript interfaces and types
├── store/            # Redux state management
├── utils/            # Utility functions
└── constants/        # App constants and configurations
```

### Backend API (Node.js + Express + MongoDB)
```
backend/
├── src/
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API endpoints
│   └── server.js     # Express server setup
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- React Native development environment
- Android Studio (for Android) or Xcode (for iOS)
- MongoDB instance
- Firebase account
- Google Maps API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yahyaanas2005/Namaz-masjid-nearbyme.git
cd Namaz-masjid-nearbyme
```

2. **Install mobile app dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

4. **Configure environment variables**

Create `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```env
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_PROJECT_ID=your_project_id
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_WEB_CLIENT_ID=your_google_client_id
FACEBOOK_APP_ID=your_facebook_app_id
API_BASE_URL=http://localhost:3000/api
```

Create `.env` file in the backend directory:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/prayertime-navigator
FIREBASE_SERVICE_ACCOUNT_KEY=./config/serviceAccountKey.json
JWT_SECRET=your_jwt_secret
```

5. **Set up Firebase**

- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
- Enable Authentication (Google and Facebook providers)
- Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
- Place the files in appropriate directories

6. **Set up Google Maps**

- Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
- Enable Maps SDK for Android and iOS
- Add the API key to your environment variables

### Running the App

#### Start the Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3000`

#### Start the Mobile App

**For iOS:**
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

**For Android:**
```bash
npx react-native run-android
```

**Start Metro Bundler (if not started automatically):**
```bash
npm start
```

## 🔧 Configuration

### Firebase Setup

1. Add your Firebase configuration in `src/services/AuthService.ts`
2. Configure authentication providers:
   - Google Sign-In
   - Facebook Login

### Google Maps Configuration

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
```

**iOS** (`ios/PrayerTimeNavigator/AppDelegate.m`):
```objective-c
[GMSServices provideAPIKey:@"YOUR_GOOGLE_MAPS_API_KEY"];
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Mosques
- `GET /mosques/nearby?latitude={lat}&longitude={lng}&radius={km}` - Get nearby mosques
- `GET /mosques/:id` - Get mosque details
- `GET /mosques/search?q={query}` - Search mosques
- `POST /mosques/:id/crowd-density` - Update crowd density

#### Prayer Times
- `POST /prayer-times/report` - Submit prayer time report
- `GET /prayer-times/:mosqueId/validated` - Get validated prayer times

#### Testimonials
- `GET /testimonials/:mosqueId` - Get mosque testimonials
- `POST /testimonials` - Submit testimonial
- `POST /testimonials/:id/like` - Like/unlike testimonial

#### Committee
- `POST /committee/approval` - Submit committee approval
- `GET /committee/:mosqueId/approvals` - Get approvals

## 🎯 How It Works

### Prayer Time Validation Process

1. **User Reports**: Users report prayer times they observe at mosques
2. **Crowd Analysis**: System analyzes reports from multiple users
3. **Validation Threshold**: When 50+ users report the same time, it's validated
4. **Committee Override**: Mosque committees can officially approve/modify times
5. **Real-time Updates**: All users receive instant updates via WebSocket

### Crowd Density Tracking

1. Users check in when visiting a mosque
2. System tracks real-time attendance
3. Analytics help validate popular prayer times
4. Historical data shows trends and patterns

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Yahya Anas** - *Initial work* - [yahyaanas2005](https://github.com/yahyaanas2005)

## 🙏 Acknowledgments

- Islamic community for feedback and testing
- Contributors who help validate prayer times
- Mosque committees for official endorsements

## 📞 Support

For support, email support@prayertimenavigator.com or open an issue in this repository.

## 🗺️ Roadmap

- [ ] Add Qibla direction compass
- [ ] Implement prayer time calculation algorithms
- [ ] Add audio Adhan notifications
- [ ] Support for multiple languages
- [ ] iOS and Android widgets
- [ ] Apple Watch and Wear OS support
- [ ] Integration with Islamic calendar
- [ ] Community forum features

## 🐛 Known Issues

See [Issues](https://github.com/yahyaanas2005/Namaz-masjid-nearbyme/issues) page for current known issues.

## 📊 Project Status

This project is currently in **active development**. Version 1.0.0 includes core features with ongoing improvements.

---

Made with ❤️ for the Muslim community
