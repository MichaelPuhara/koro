# Assets Directory

This directory should contain the following image assets for the mobile app:

## Required Assets

1. **icon.png** - App icon (1024x1024px)
2. **splash.png** - Splash screen image (1284x2778px for iPhone)
3. **adaptive-icon.png** - Android adaptive icon (1024x1024px)
4. **favicon.png** - Web favicon (48x48px)

## Creating Assets

You can create these assets using design tools like:
- Figma
- Adobe XD
- Sketch
- Canva

Or use Expo's asset generator:
```bash
npx expo-asset-generator
```

## Temporary Workaround

For development purposes, Expo will use default placeholder assets if these files are missing. However, you should create proper assets before publishing to the App Store.

## Asset Guidelines

### App Icon (icon.png)
- Size: 1024x1024px
- Format: PNG
- No transparency
- No rounded corners (iOS adds them automatically)

### Splash Screen (splash.png)
- Size: 1284x2778px (or similar high resolution)
- Format: PNG
- Can include transparency
- Should look good at various aspect ratios

### Adaptive Icon (adaptive-icon.png)
- Size: 1024x1024px
- Format: PNG
- Android only
- Important content should be in the center 66% of the image
