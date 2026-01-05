# Placeholder Assets

This directory contains placeholder images. **Replace these with actual app branding assets before production.**

## Required Images

### logo.png
- **Size**: 512x512px minimum
- **Format**: PNG with transparency
- **Purpose**: Main app logo displayed on login screen
- **Design**: Should include mosque/Islamic theme elements

### icon.png
- **Size**: 1024x1024px (for app stores)
- **Format**: PNG
- **Purpose**: App icon for home screen
- **Design**: Simple, recognizable icon

## Creating Real Assets

1. Design your logo and icon using tools like:
   - Figma
   - Adobe Illustrator
   - Canva
   
2. Export at appropriate resolutions:
   - @1x: base size
   - @2x: 2x base size
   - @3x: 3x base size

3. Use online tools to generate iOS and Android app icons:
   - https://appicon.co/
   - https://makeappicon.com/

## Temporary Workaround

For development, the app will use react-native-vector-icons instead of image assets.
Update LoginScreen to use icons from the library until proper assets are created.
