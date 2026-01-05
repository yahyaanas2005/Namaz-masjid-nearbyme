# Troubleshooting Guide

This guide covers common issues you might encounter while setting up and running PrayerTime Navigator.

---

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Build Issues](#build-issues)
3. [Runtime Issues](#runtime-issues)
4. [Backend Issues](#backend-issues)
5. [Firebase Issues](#firebase-issues)
6. [Google Maps Issues](#google-maps-issues)
7. [MongoDB Issues](#mongodb-issues)

---

## Installation Issues

### Issue: npm install fails with peer dependency errors

**Error:**
```
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
npm install --legacy-peer-deps
```

This is expected due to React Native 0.73.0 using React 18.2.0 while react-native-maps requires React 18.3.1. The versions are compatible, so using `--legacy-peer-deps` is safe.

---

### Issue: babel-plugin-module-resolver not found

**Error:**
```
Cannot find module 'babel-plugin-module-resolver'
```

**Solution:**
Ensure the package is installed:
```bash
npm install --save-dev babel-plugin-module-resolver
```

---

### Issue: node-gyp build errors on installation

**Error:**
```
gyp ERR! build error
```

**Solution:**
1. Install build tools:
   - **macOS:** `xcode-select --install`
   - **Windows:** `npm install --global windows-build-tools`
   - **Linux:** `sudo apt-get install build-essential`

2. Clear npm cache and reinstall:
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

---

## Build Issues

### Issue: iOS build fails - CocoaPods error

**Error:**
```
[!] CocoaPods could not find compatible versions for pod "..."
```

**Solution:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
npx react-native run-ios
```

---

### Issue: Android build fails - SDK not found

**Error:**
```
SDK location not found
```

**Solution:**
1. Create `android/local.properties`:
   ```
   sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
   ```
   
2. Set environment variable:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

---

### Issue: Metro bundler port already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::8081
```

**Solution:**
```bash
# Kill the process using port 8081
lsof -ti:8081 | xargs kill -9

# Or start Metro on a different port
npx react-native start --port 8088
```

---

## Runtime Issues

### Issue: White screen on app launch

**Possible Causes & Solutions:**

1. **JavaScript Bundle Not Loaded:**
   ```bash
   # Clear cache and restart
   npx react-native start --reset-cache
   ```

2. **Syntax Error:**
   - Check Metro bundler console for errors
   - Review recent code changes

3. **Native Module Not Linked:**
   ```bash
   # iOS
   cd ios && pod install && cd ..
   
   # Android - rebuild
   npx react-native run-android
   ```

---

### Issue: Location permission not working

**iOS:**
1. Add to `ios/PrayerTimeNavigator/Info.plist`:
   ```xml
   <key>NSLocationWhenInUseUsageDescription</key>
   <string>We need your location to find nearby mosques</string>
   <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
   <string>We need your location to find nearby mosques</string>
   ```

**Android:**
1. Add to `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
   <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
   ```

---

### Issue: Google Maps not showing

**Causes:**
1. API key not configured
2. API key restrictions
3. Maps SDK not enabled

**Solution:**

**iOS:**
1. Check `ios/PrayerTimeNavigator/AppDelegate.m`:
   ```objective-c
   #import <GoogleMaps/GoogleMaps.h>
   
   [GMSServices provideAPIKey:@"YOUR_API_KEY"];
   ```

**Android:**
1. Check `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="YOUR_API_KEY"/>
   ```

2. Enable APIs in Google Cloud Console:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API

---

### Issue: Authentication not working

**Firebase Setup Checklist:**

1. **Firebase Project Created:** ✓
2. **Authentication Enabled:** ✓
3. **Google Sign-In Configured:** ✓
4. **Facebook Login Configured:** ✓
5. **iOS Bundle ID Added:** ✓
6. **Android Package Name Added:** ✓
7. **SHA-1 Certificate Added (Android):** ✓

**Get Android SHA-1:**
```bash
cd android
./gradlew signingReport
```

**Common Issues:**
- Wrong Web Client ID in .env
- Firebase configuration files not added
- Bundle ID/Package name mismatch

---

## Backend Issues

### Issue: Backend won't start

**Error:**
```
Error: Cannot find module 'dotenv'
```

**Solution:**
```bash
cd backend
npm install
```

---

### Issue: MongoDB connection error

**Error:**
```
MongoServerError: Authentication failed
```

**Solutions:**

1. **Check .env file:**
   ```
   MONGODB_URI=mongodb://localhost:27017/prayertime-navigator
   ```

2. **MongoDB not running:**
   ```bash
   # Start MongoDB
   # macOS (Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

3. **Using MongoDB Atlas:**
   - Check whitelist IP addresses
   - Verify username/password
   - Check connection string format:
     ```
     mongodb+srv://username:password@cluster.mongodb.net/database
     ```

---

### Issue: CORS errors

**Error:**
```
Access to fetch at 'http://localhost:3000' from origin 'http://localhost:8081' has been blocked by CORS policy
```

**Solution:**
Backend already has CORS configured. Ensure:
1. Backend is running
2. API_BASE_URL in frontend .env is correct
3. If using a custom domain, update CORS origin in `backend/src/server.js`

---

## Firebase Issues

### Issue: Firebase Auth not initialized

**Error:**
```
Firebase: Error (auth/app-not-initialized)
```

**Solution:**

1. **iOS:** Ensure `GoogleService-Info.plist` is added to Xcode project
2. **Android:** Ensure `google-services.json` is in `android/app/`
3. Check Firebase configuration in code

---

### Issue: Google Sign-In fails on Android

**Error:**
```
DEVELOPER_ERROR
```

**Solution:**
1. Add SHA-1 certificate to Firebase Console
2. Download updated `google-services.json`
3. Rebuild app:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

---

## Google Maps Issues

### Issue: Map shows grey screen

**Causes:**
1. API key not valid
2. Billing not enabled on Google Cloud
3. API restrictions too strict

**Solution:**
1. Verify API key in Google Cloud Console
2. Enable billing
3. Check API restrictions
4. Regenerate API key if needed

---

### Issue: Markers not showing on map

**Possible Causes:**
1. Mosque data not loaded from backend
2. Coordinates in wrong format
3. Map not initialized properly

**Debug:**
```javascript
// In MapScreen, add console.log
console.log('Nearby Mosques:', nearbyMosques);
console.log('Current Location:', currentLocation);
```

---

## MongoDB Issues

### Issue: Geospatial queries not working

**Error:**
```
MongoServerError: can't find any special indices: 2d (needs index), 2dsphere (needs index)
```

**Solution:**
The Mosque model has geospatial indexing. Ensure:
1. Model is properly imported
2. Index is created:
   ```javascript
   // In MongoDB shell or Compass
   db.mosques.createIndex({ location: "2dsphere" })
   ```

---

### Issue: Connection timeout

**Error:**
```
MongoServerSelectionError: connect ETIMEDOUT
```

**Solutions:**
1. Check MongoDB is running
2. Verify connection string
3. Check firewall settings
4. For MongoDB Atlas: Add your IP to whitelist

---

## General Debugging Tips

### Enable Verbose Logging

**Metro Bundler:**
```bash
npx react-native start --verbose
```

**Backend:**
```javascript
// In backend/src/server.js
app.use(morgan('combined')); // More detailed logs
```

---

### Clear All Caches

```bash
# Clear npm cache
npm cache clean --force

# Clear Metro cache
npx react-native start --reset-cache

# Clear Gradle cache (Android)
cd android
./gradlew clean
rm -rf ~/.gradle/caches/
cd ..

# Clear CocoaPods cache (iOS)
cd ios
rm -rf Pods Podfile.lock
pod cache clean --all
cd ..
```

---

### Reset React Native Environment

```bash
# Remove all build artifacts
rm -rf node_modules
rm -rf ios/Pods ios/Podfile.lock
rm -rf android/app/build
rm -rf android/.gradle

# Reinstall
npm install --legacy-peer-deps
cd ios && pod install && cd ..

# Rebuild
npx react-native run-ios # or run-android
```

---

## Getting Help

If you're still experiencing issues:

1. **Check the logs:**
   - Metro bundler console
   - Backend server console
   - Xcode console (iOS)
   - Logcat (Android)

2. **Search for error messages:**
   - GitHub Issues: https://github.com/yahyaanas2005/Namaz-masjid-nearbyme/issues
   - Stack Overflow
   - React Native documentation

3. **Create an issue:**
   - Include error messages
   - Include steps to reproduce
   - Include environment info:
     ```bash
     npx react-native info
     ```

---

## Quick Reference Commands

```bash
# Start development
npm start                          # Start Metro bundler
npm run android                    # Run on Android
npm run ios                        # Run on iOS

# Backend
cd backend
npm run dev                        # Start backend server

# Testing
npm test                           # Run tests
npm run lint                       # Run linter

# Cleaning
npx react-native start --reset-cache
rm -rf node_modules && npm install --legacy-peer-deps
```

---

*Last Updated: January 5, 2026*
