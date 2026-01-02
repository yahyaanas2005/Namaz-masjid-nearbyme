# Namaz Masjid Nearby Me

A Flutter Android application that helps users find nearby masjids (mosques) and view prayer timings.

## Features

- 🗺️ Interactive map showing nearby masjids using OpenStreetMap
- 📍 Location-based masjid discovery within 3000m radius
- 🕌 Display masjids as markers on the map
- 📋 Sorted list of masjids by distance from user location
- 🕐 Prayer timings fetched from Aladhan API
- 📱 Android-only MVP implementation

## Prerequisites

- Flutter SDK (3.16.0 or higher)
- Android SDK
- Java Development Kit (JDK 17)
- Android device or emulator with location services enabled

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yahyaanas2005/Namaz-masjid-nearbyme.git
cd Namaz-masjid-nearbyme
```

2. Install dependencies:
```bash
flutter pub get
```

3. Run the app:
```bash
flutter run
```

## Building for Release

### Local Build

To build a release APK locally (unsigned):
```bash
flutter build apk --release
```

The APK will be located at: `build/app/outputs/flutter-apk/app-release.apk`

### Signed Build (CI/CD)

For signed builds through GitHub Actions, you need to set up signing credentials. See the [Signing Instructions](SIGNING_INSTRUCTIONS.md) for detailed steps.

## GitHub Actions CI/CD

This repository includes a GitHub Actions workflow that automatically builds and releases a signed APK.

### Required GitHub Secrets

To enable automated signed builds, configure the following secrets in your repository settings (**Settings** → **Secrets and variables** → **Actions**):

1. **KEYSTORE_BASE64** - Base64-encoded Android keystore file
2. **KEYSTORE_PASSWORD** - Password for the keystore
3. **KEY_ALIAS** - Key alias used in the keystore
4. **KEY_PASSWORD** - Password for the key

### Why These Secrets Are Needed

- **KEYSTORE_BASE64**: Contains the signing key required to create a signed APK that can be distributed or uploaded to Google Play Store
- **KEYSTORE_PASSWORD**: Protects access to the keystore file
- **KEY_ALIAS**: Identifies which key within the keystore to use for signing
- **KEY_PASSWORD**: Protects access to the specific signing key

Without these secrets, the app can still be built but won't be signed for distribution.

### Setting Up Signing

Follow the comprehensive guide in [SIGNING_INSTRUCTIONS.md](SIGNING_INSTRUCTIONS.md) for:
- Generating a keystore
- Creating the required GitHub secrets
- Troubleshooting common issues

### Triggering a Build

The workflow runs automatically when:
- Code is pushed to the `main` branch
- Manually triggered via the Actions tab (workflow_dispatch)

The signed APK will be:
- Uploaded as a workflow artifact
- Attached to a GitHub Release as `namaz_masjid_nearbyme-release.apk`

### Using a Personal Access Token (Optional)

The workflow uses the default `GITHUB_TOKEN` to create releases. If you encounter permissions issues, you can create a Personal Access Token (PAT) with `repo` scope and add it as a secret named `RELEASE_TOKEN`, then update the workflow to use it:

```yaml
env:
  GITHUB_TOKEN: ${{ secrets.RELEASE_TOKEN }}
```

## Project Structure

```
.
├── lib/
│   └── main.dart              # Main application code
├── assets/
│   └── placeholder.txt        # Placeholder for app assets
├── android/                   # Android-specific configuration
├── .github/
│   └── workflows/
│       └── build-and-release.yml  # CI/CD workflow
├── pubspec.yaml              # Flutter dependencies
├── README.md                 # This file
└── SIGNING_INSTRUCTIONS.md   # Keystore setup guide
```

## Dependencies

- **flutter_map** (^6.0.0) - Interactive map widget
- **latlong2** (^0.9.0) - Latitude/longitude handling
- **geolocator** (^10.1.0) - Location services
- **http** (^1.1.0) - HTTP requests
- **intl** (^0.18.1) - Date formatting

## Permissions

The app requires the following Android permissions:
- `ACCESS_FINE_LOCATION` - For precise user location
- `ACCESS_COARSE_LOCATION` - For approximate user location
- `INTERNET` - For fetching map tiles and prayer timings

## APIs Used

1. **OpenStreetMap Tiles** - Map rendering
2. **Overpass API** - Finding nearby masjids from OpenStreetMap data
3. **Aladhan API** - Fetching Islamic prayer timings

## Testing

To run the app in debug mode:
```bash
flutter run
```

To test on a specific device:
```bash
flutter devices  # List available devices
flutter run -d <device-id>
```

## Known Limitations

- Android-only (iOS support not included in MVP)
- Requires active internet connection
- Location services must be enabled on the device
- Prayer timings are approximate and may vary by calculation method

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.
