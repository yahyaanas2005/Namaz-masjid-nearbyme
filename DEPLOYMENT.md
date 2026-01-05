# Deployment Guide

This guide covers deploying PrayerTime Navigator to production environments.

## Table of Contents

1. [Backend Deployment](#backend-deployment)
2. [Database Setup](#database-setup)
3. [Mobile App Deployment](#mobile-app-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create prayertime-navigator-api
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Option 2: AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu Server 22.04 LTS
   - Select t2.micro (or larger)
   - Configure security groups (ports 80, 443, 22)

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

4. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/yahyaanas2005/Namaz-masjid-nearbyme.git
   cd Namaz-masjid-nearbyme/backend
   
   # Install dependencies
   npm install --production
   
   # Create .env file
   nano .env
   # Add production environment variables
   
   # Start with PM2
   pm2 start src/server.js --name prayertime-api
   pm2 startup
   pm2 save
   ```

5. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/prayertime-api
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name api.prayertimenavigator.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/prayertime-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Set up SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.prayertimenavigator.com
   ```

### Option 3: DigitalOcean App Platform

1. **Create Account** at [DigitalOcean](https://www.digitalocean.com/)
2. **Create App** → Choose GitHub repo
3. **Configure**:
   - Build Command: `npm install`
   - Run Command: `npm start`
   - Environment Variables: Add from .env
4. **Deploy**: Click "Create Resources"

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Account** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create Cluster**
   - Choose cloud provider (AWS, GCP, Azure)
   - Select region closest to your users
   - Choose cluster tier (M0 free tier for testing)

3. **Configure Security**
   - Create database user
   - Whitelist IP addresses (or 0.0.0.0/0 for all)

4. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Add to backend environment variables

5. **Create Database**
   ```javascript
   // MongoDB will create database automatically
   // Database name from connection string
   ```

### Self-Hosted MongoDB

1. **Install MongoDB**
   ```bash
   sudo apt install mongodb
   ```

2. **Configure**
   ```bash
   sudo nano /etc/mongodb.conf
   ```
   
   Enable authentication:
   ```
   security:
     authorization: enabled
   ```

3. **Create User**
   ```bash
   mongo
   use prayertime-navigator
   db.createUser({
     user: "admin",
     pwd: "strong_password",
     roles: ["readWrite", "dbAdmin"]
   })
   ```

4. **Backup Strategy**
   ```bash
   # Create backup script
   mongodump --uri="mongodb://user:pass@localhost/prayertime-navigator" --out=/backup/
   
   # Schedule with cron
   crontab -e
   # Add: 0 2 * * * /path/to/backup-script.sh
   ```

## Mobile App Deployment

### Android

1. **Generate Signing Key**
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore prayertime.keystore -alias prayertime -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure Gradle**
   
   Create `android/gradle.properties`:
   ```properties
   MYAPP_UPLOAD_STORE_FILE=prayertime.keystore
   MYAPP_UPLOAD_KEY_ALIAS=prayertime
   MYAPP_UPLOAD_STORE_PASSWORD=your_password
   MYAPP_UPLOAD_KEY_PASSWORD=your_password
   ```
   
   Edit `android/app/build.gradle`:
   ```gradle
   android {
       ...
       signingConfigs {
           release {
               if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                   storeFile file(MYAPP_UPLOAD_STORE_FILE)
                   storePassword MYAPP_UPLOAD_STORE_PASSWORD
                   keyAlias MYAPP_UPLOAD_KEY_ALIAS
                   keyPassword MYAPP_UPLOAD_KEY_PASSWORD
               }
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled true
               proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

3. **Build Release APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   
   APK location: `android/app/build/outputs/apk/release/app-release.apk`

4. **Build App Bundle (AAB) for Play Store**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```
   
   AAB location: `android/app/build/outputs/bundle/release/app-release.aab`

5. **Upload to Google Play Console**
   - Create account at [Google Play Console](https://play.google.com/console)
   - Create app
   - Complete store listing
   - Upload AAB
   - Set up pricing and distribution
   - Submit for review

### iOS

1. **Requirements**
   - Mac with Xcode
   - Apple Developer Account ($99/year)

2. **Configure Xcode**
   - Open `ios/PrayerTimeNavigator.xcworkspace`
   - Select project → Signing & Capabilities
   - Select your team
   - Configure bundle identifier

3. **Archive Build**
   - Product → Scheme → Edit Scheme → Set to Release
   - Product → Archive
   - Wait for archive to complete

4. **Upload to App Store Connect**
   - Window → Organizer
   - Select archive
   - Click "Distribute App"
   - Follow wizard
   - Upload to App Store Connect

5. **Submit to App Store**
   - Go to [App Store Connect](https://appstoreconnect.apple.com/)
   - Create new app
   - Complete app information
   - Add screenshots
   - Submit for review

## Environment Configuration

### Production Environment Variables

**Backend (.env):**
```env
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/prayertime

# Security
JWT_SECRET=very_secure_secret_key_change_this
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Validation
PRAYER_TIME_VALIDATION_THRESHOLD=50
```

**Mobile App (.env):**
```env
NODE_ENV=production
API_BASE_URL=https://api.prayertimenavigator.com
FIREBASE_API_KEY=production_key
GOOGLE_MAPS_API_KEY=production_key
```

## Monitoring and Maintenance

### Application Monitoring

1. **PM2 Monitoring** (for Node.js)
   ```bash
   pm2 monit
   pm2 logs prayertime-api
   ```

2. **Set up Application Monitoring**
   - [New Relic](https://newrelic.com/)
   - [Datadog](https://www.datadoghq.com/)
   - [Sentry](https://sentry.io/) for error tracking

3. **Database Monitoring**
   - MongoDB Atlas built-in monitoring
   - Set up alerts for:
     - High CPU usage
     - Memory usage
     - Slow queries
     - Connection issues

### Logging

1. **Backend Logging**
   ```javascript
   // Use Winston or similar
   const winston = require('winston');
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   ```

2. **Log Rotation**
   ```bash
   # Install logrotate
   sudo nano /etc/logrotate.d/prayertime-api
   ```
   
   Add:
   ```
   /var/log/prayertime-api/*.log {
       daily
       rotate 14
       compress
       delaycompress
       notifempty
       create 0640 www-data www-data
       sharedscripts
   }
   ```

### Backup Strategy

1. **Database Backups**
   ```bash
   # Automated backup script
   #!/bin/bash
   DATE=$(date +%Y%m%d)
   mongodump --uri="$MONGODB_URI" --out="/backup/mongodb-$DATE"
   # Upload to S3 or similar
   ```

2. **Schedule Backups**
   ```bash
   crontab -e
   # Daily at 2 AM
   0 2 * * * /path/to/backup-script.sh
   ```

### Security Best Practices

1. **Environment Variables**
   - Never commit .env files
   - Use secrets management (AWS Secrets Manager, HashiCorp Vault)
   - Rotate keys regularly

2. **HTTPS Only**
   - Force HTTPS in production
   - Use HSTS headers
   - Certificate auto-renewal

3. **Rate Limiting**
   - Implement on API
   - Monitor for abuse
   - Block suspicious IPs

4. **Regular Updates**
   ```bash
   # Update dependencies
   npm audit
   npm update
   ```

### Performance Optimization

1. **CDN for Static Assets**
   - Use Cloudflare or AWS CloudFront
   - Cache images and assets

2. **Database Indexing**
   ```javascript
   // Ensure indexes are created
   db.mosques.createIndex({ "location": "2dsphere" });
   db.mosques.createIndex({ "name": "text" });
   ```

3. **API Caching**
   - Implement Redis for caching
   - Cache frequently accessed data

## Post-Deployment Checklist

- [ ] Backend deployed and running
- [ ] Database configured with backups
- [ ] Environment variables set correctly
- [ ] SSL certificates installed
- [ ] Monitoring and logging configured
- [ ] Mobile apps uploaded to stores
- [ ] API documentation updated
- [ ] User analytics configured
- [ ] Crash reporting enabled
- [ ] Push notifications tested
- [ ] Performance monitoring active

## Support

For deployment issues:
- Email: devops@prayertimenavigator.com
- Documentation: [GitHub Wiki](https://github.com/yahyaanas2005/Namaz-masjid-nearbyme/wiki)

---

**Note**: Always test in a staging environment before deploying to production.
