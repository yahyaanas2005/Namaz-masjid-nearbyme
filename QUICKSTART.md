# Quick Start Guide

This guide will help you get PrayerTime Navigator up and running in 10 minutes.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] React Native environment set up
- [ ] Android Studio or Xcode installed
- [ ] Firebase account created
- [ ] Google Cloud account created
- [ ] MongoDB installed or MongoDB Atlas account

## Step-by-Step Setup

### 1. Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/yahyaanas2005/Namaz-masjid-nearbyme.git
cd Namaz-masjid-nearbyme

# Install mobile app dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Environment Configuration (3 minutes)

**Mobile App (.env in root directory):**
```bash
cp .env.example .env
```

Edit `.env`:
```env
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_PROJECT_ID=your_project_id
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_WEB_CLIENT_ID=your_google_client_id
FACEBOOK_APP_ID=your_facebook_app_id
API_BASE_URL=http://localhost:3000/api
```

**Backend (.env in backend directory):**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/prayertime-navigator
PORT=3000
```

### 3. Firebase Setup (3 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: "PrayerTime Navigator"
3. Enable Authentication → Google & Facebook
4. Download config files:
   - Android: `google-services.json` → `android/app/`
   - iOS: `GoogleService-Info.plist` → `ios/PrayerTimeNavigator/`

### 4. Google Maps Setup (2 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
3. Create API key
4. Add to `.env` file (already done in step 2)

### 5. Start Development (1 minute)

**Terminal 1 - Start MongoDB:**
```bash
mongod
```

**Terminal 2 - Start Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Start Mobile App:**
```bash
# Start Metro bundler
npm start

# In another terminal/tab:
# For Android
npx react-native run-android

# For iOS (macOS only)
npx react-native run-ios
```

## Verification

The app should now be running! You should see:

1. ✅ Backend server running on http://localhost:3000
2. ✅ MongoDB connected
3. ✅ Mobile app opened on emulator/device
4. ✅ Login screen displayed

## Quick Test

1. Click "Continue with Google" or "Continue with Facebook"
2. Complete authentication
3. Grant location permission when prompted
4. You should see the map screen with your current location

## Common Issues

### Port 8081 already in use
```bash
npx react-native start --reset-cache
```

### Android build fails
```bash
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

### MongoDB connection error
```bash
# Make sure MongoDB is running
mongod --dbpath /path/to/data
```

### Maps not showing
- Verify Google Maps API key is correct
- Check that billing is enabled in Google Cloud Console

## Next Steps

1. Read [SETUP.md](SETUP.md) for detailed configuration
2. Review [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) to understand the codebase
3. Check [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute

## Need Help?

- 📧 Email: support@prayertimenavigator.com
- 🐛 Report issues: [GitHub Issues](https://github.com/yahyaanas2005/Namaz-masjid-nearbyme/issues)
- 📖 Full documentation: [README.md](README.md)

Happy coding! 🚀
