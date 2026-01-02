# Signing Instructions for Android APK

This document provides step-by-step instructions for generating an Android keystore and configuring GitHub secrets for automated signed APK builds.

## Prerequisites

- Java Development Kit (JDK) installed on your system
- Access to your GitHub repository settings

## Step 1: Generate a Keystore

Open a terminal and run the following command to generate a new keystore:

```bash
keytool -genkey -v -keystore namaz-masjid-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias namaz-masjid-key
```

You will be prompted to:
1. Enter a keystore password (remember this - you'll need it later)
2. Re-enter the keystore password
3. Enter your name, organization, city, state, and country
4. Enter a key password (can be the same as keystore password)

This will create a file named `namaz-masjid-keystore.jks` in your current directory.

**Important:** Keep this keystore file safe and never commit it to your repository!

## Step 2: Convert Keystore to Base64

Convert the keystore file to base64 encoding:

### On Linux/macOS:
```bash
base64 namaz-masjid-keystore.jks > keystore.txt
```

### On Windows (PowerShell):
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("namaz-masjid-keystore.jks")) > keystore.txt
```

This creates a `keystore.txt` file containing the base64-encoded keystore.

## Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets one by one:

### Required Secrets:

#### KEYSTORE_BASE64
- **Name:** `KEYSTORE_BASE64`
- **Value:** Copy and paste the entire content of `keystore.txt` (from Step 2)

#### KEYSTORE_PASSWORD
- **Name:** `KEYSTORE_PASSWORD`
- **Value:** The keystore password you entered in Step 1

#### KEY_ALIAS
- **Name:** `KEY_ALIAS`
- **Value:** `namaz-masjid-key` (or whatever alias you used in Step 1)

#### KEY_PASSWORD
- **Name:** `KEY_PASSWORD`
- **Value:** The key password you entered in Step 1

## Step 4: Verify Configuration

After adding all secrets:
1. Go to the **Actions** tab in your repository
2. Manually trigger the "Build and Release APK" workflow
3. The workflow should complete successfully and create a new release with the signed APK

## Security Notes

- **Never** commit the keystore file (`.jks`) to your repository
- **Never** commit the `keystore.txt` file to your repository
- Keep your keystore and passwords in a secure location
- If you lose your keystore, you won't be able to update your app on Google Play Store
- Consider backing up your keystore to a secure location (encrypted cloud storage, password manager, etc.)

## Troubleshooting

### Build fails with "Keystore not found"
- Verify that `KEYSTORE_BASE64` secret contains the correct base64-encoded keystore
- Check that there are no extra spaces or newlines in the secret value

### Build fails with "Invalid keystore format"
- Ensure the base64 encoding was done correctly
- Try regenerating the base64 encoding and updating the secret

### Build fails with "Incorrect password"
- Double-check that `KEYSTORE_PASSWORD` and `KEY_PASSWORD` secrets match the passwords you used when creating the keystore
- Verify that `KEY_ALIAS` matches the alias used during keystore generation

## Additional Resources

- [Android Developer Guide - Sign your app](https://developer.android.com/studio/publish/app-signing)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
