# Fixed app.json Configuration

## The Problem
You made these troubleshooting changes that broke the configuration:
1. Changed bundle identifier to "com.myapp.socratic" 
2. Removed the "expo-router" plugin

## Correct Configuration
Use this EXACT code for your mobile repository's `app.json`:

```json
{
  "expo": {
    "name": "Socratic Coach",
    "slug": "socratic-coach",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.socraticcoach.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.socraticcoach.app"
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router"
    ],
    "scheme": "socratic-coach",
    "extra": {
      "router": {
        "origin": false
      }
    }
  }
}
```

## Key Points:
✅ **Bundle ID**: Back to "com.socraticcoach.app" (correct)
✅ **Plugins**: "expo-router" plugin RESTORED (required for your app)
✅ **Platforms**: ["ios", "android"] included (required)

## Why This Matters:
- Your app uses Expo Router for navigation (`app/_layout.tsx`, `app/index.tsx`, etc.)
- Removing the "expo-router" plugin breaks the entire app structure
- The bundle identifier should be consistent

## Steps:
1. Go to your mobile repository on GitHub
2. Edit `app.json` 
3. Replace with the EXACT code above
4. Commit changes
5. Try Expo Launch again

This restores the working configuration with the required deployment fix.