# Setup Guide for PrayerTime Navigator

## Table of Contents
1. [Development Environment Setup](#development-environment-setup)
2. [Firebase Configuration](#firebase-configuration)
3. [Google Maps Setup](#google-maps-setup)
4. [MongoDB Setup](#mongodb-setup)
5. [Running the Project](#running-the-project)
6. [Troubleshooting](#troubleshooting)

## Development Environment Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
  ```bash
  node --version  # Should be v18+
  ```

- **npm or yarn**
  ```bash
  npm --version
  ```

- **React Native CLI**
  ```bash
  npm install -g react-native-cli
  ```

- **Android Studio** (for Android development)
  - Download from [Android Studio](https://developer.android.com/studio)
  - Install Android SDK
  - Set up Android emulator

- **Xcode** (for iOS development - macOS only)
  - Install from Mac App Store
  - Install Command Line Tools
  - Install CocoaPods: `sudo gem install cocoapods`

### Setting up the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/yahyaanas2005/Namaz-masjid-nearbyme.git
   cd Namaz-masjid-nearbyme
   ```

2. **Install dependencies**
   ```bash
   # Install mobile app dependencies
   npm install

   # Install iOS dependencies (macOS only)
   cd ios && pod install && cd ..

   # Install backend dependencies
   cd backend && npm install && cd ..
   ```

## Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: "PrayerTime Navigator"
4. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get Started"
3. Enable the following sign-in methods:
   - **Google**: 
     - Enable and configure
     - Download OAuth client ID
   - **Facebook**: 
     - Enable
     - Add Facebook App ID and App Secret
     - Configure OAuth redirect URI

### 3. Download Configuration Files

**For Android:**
1. Go to Project Settings
2. Add Android app
3. Register with package name: `com.prayertimenavigator`
4. Download `google-services.json`
5. Place in `android/app/` directory

**For iOS:**
1. Add iOS app in Project Settings
2. Register with bundle ID: `com.prayertimenavigator`
3. Download `GoogleService-Info.plist`
4. Place in `ios/PrayerTimeNavigator/` directory

### 4. Configure Environment Variables

Create `.env` file in root directory:
```env
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:android:abcdef
```

## Google Maps Setup

### 1. Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Geocoding API
4. Create API key in "Credentials"

### 2. Configure for Android

Edit `android/app/src/main/AndroidManifest.xml`:
```xml
<application>
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
</application>
```

### 3. Configure for iOS

Edit `ios/PrayerTimeNavigator/AppDelegate.m`:
```objective-c
#import <GoogleMaps/GoogleMaps.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"YOUR_GOOGLE_MAPS_API_KEY"];
  // ... rest of the code
}
```

## MongoDB Setup

### Option 1: Local MongoDB

1. **Install MongoDB**
   ```bash
   # macOS
   brew install mongodb-community

   # Ubuntu
   sudo apt-get install mongodb

   # Windows - Download installer from mongodb.com
   ```

2. **Start MongoDB**
   ```bash
   # macOS/Linux
   mongod --dbpath /path/to/data/directory

   # Or as service
   brew services start mongodb-community  # macOS
   sudo systemctl start mongod            # Linux
   ```

3. **Update backend .env**
   ```env
   MONGODB_URI=mongodb://localhost:27017/prayertime-navigator
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Create database user
4. Whitelist IP address (or allow from anywhere for development)
5. Get connection string
6. Update backend .env:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prayertime-navigator
   ```

## Running the Project

### Start Backend Server

```bash
cd backend
npm run dev
```

Server will start on `http://localhost:3000`

### Start Mobile App

**For Android:**
```bash
# Start Metro bundler
npm start

# In another terminal, run Android app
npx react-native run-android
```

**For iOS (macOS only):**
```bash
# Start Metro bundler
npm start

# In another terminal, run iOS app
npx react-native run-ios
```

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Port Already in Use

```bash
# Kill process on port 8081
npx react-native start --reset-cache
```

#### 2. Android Build Fails

```bash
# Clean build
cd android
./gradlew clean
cd ..
npx react-native run-android
```

#### 3. iOS Build Fails

```bash
# Clean build
cd ios
pod deintegrate
pod install
cd ..
npx react-native run-ios
```

#### 4. Firebase Authentication Not Working

- Check that `google-services.json` and `GoogleService-Info.plist` are in correct locations
- Verify package name/bundle ID matches Firebase configuration
- Ensure Firebase Authentication is enabled in console

#### 5. Google Maps Not Displaying

- Verify API key is correct
- Check that Maps SDK is enabled in Google Cloud Console
- Ensure billing is enabled for Google Cloud project

#### 6. MongoDB Connection Failed

- Check if MongoDB service is running
- Verify connection string in `.env`
- Check firewall settings

### Getting Help

If you encounter issues not covered here:

1. Check the [GitHub Issues](https://github.com/yahyaanas2005/Namaz-masjid-nearbyme/issues)
2. Create a new issue with:
   - Detailed error message
   - Steps to reproduce
   - Your environment details
3. Contact support: support@prayertimenavigator.com
