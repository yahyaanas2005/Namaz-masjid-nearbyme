# Assets Directory

This directory contains all static assets for the PrayerTime Navigator mobile app.

## Structure

```
assets/
├── images/
│   ├── logo.png              # App logo (512x512)
│   ├── icon.png              # App icon (1024x1024)
│   ├── splash.png            # Splash screen image
│   ├── mosque-marker.png     # Map marker for mosques
│   └── placeholders/
│       └── mosque-default.png
├── fonts/
│   └── (Add custom fonts here if needed)
└── icons/
    └── (Additional icon assets)
```

## Image Requirements

### App Logo
- Size: 512x512px
- Format: PNG with transparency
- Usage: Login screen, about page

### App Icon
- Size: 1024x1024px
- Format: PNG
- No transparency
- Will be resized for different platforms

### Splash Screen
- Size: 2048x2048px (safe area in center)
- Format: PNG
- Background: #2E7D32 (app primary color)

### Map Markers
- Size: 64x64px
- Format: PNG with transparency
- Colors:
  - Green (#2E7D32) for approved mosques
  - Orange (#FFA726) for pending approval

## Adding Assets

1. Place new assets in appropriate subdirectory
2. Use descriptive, lowercase names with hyphens
3. Optimize images for mobile (use tools like TinyPNG)
4. Update this README with new asset information

## Usage in Code

```typescript
// Import images
import logo from './assets/images/logo.png';
import mosqueMarker from './assets/images/mosque-marker.png';

// Use in components
<Image source={logo} style={styles.logo} />
```

## Notes

- All images should be optimized for mobile devices
- Consider providing @2x and @3x versions for iOS
- Use vector formats (SVG) when possible for scalability
- Keep file sizes reasonable for app performance
