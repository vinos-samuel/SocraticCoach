# Expo Launch Deployment Requirements Fix

## Error: "Project does not meet all deployment requirements"

This error in Expo Launch means your mobile repository is missing required configurations for app deployment.

## Required Files Checklist:

### 1. **app.json** - Core Configuration
Must have these minimum settings:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug", 
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "ios": {
      "bundleIdentifier": "com.yourcompany.appname"
    },
    "android": {
      "package": "com.yourcompany.appname"
    }
  }
}
```

### 2. **package.json** - Dependencies
Must include Expo dependencies:
```json
{
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-router": "~3.5.0",
    "react": "18.3.1",
    "react-native": "0.74.5"
  }
}
```

### 3. **Required Assets**
- `assets/icon.png` (1024x1024)
- `assets/adaptive-icon.png` (1024x1024)
- `assets/splash.png` (1242x2436)

### 4. **App Entry Point**
- `app/_layout.tsx` (Expo Router entry)
- OR `App.js`/`App.tsx` (traditional entry)

## Common Missing Requirements:

### Missing Platform Configuration
Add to app.json:
```json
{
  "expo": {
    "platforms": ["ios", "android"],
    "ios": {
      "bundleIdentifier": "com.socraticcoach.app"
    },
    "android": {
      "package": "com.socraticcoach.app"
    }
  }
}
```

### Missing Main Entry Point
Add to package.json:
```json
{
  "main": "expo-router/entry"
}
```

### Missing Required Scripts
Add to package.json:
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android", 
    "ios": "expo start --ios"
  }
}
```

### Missing SDK Version
Add to app.json:
```json
{
  "expo": {
    "sdkVersion": "51.0.0"
  }
}
```

## Quick Fix Checklist:

1. **Verify your mobile repository has:**
   - ✅ `app.json` with proper Expo config
   - ✅ `package.json` with Expo dependencies
   - ✅ `assets/icon.png` (required)
   - ✅ App entry point (`app/_layout.tsx`)

2. **Check bundle identifiers:**
   - iOS: `com.yourcompany.appname`
   - Android: `com.yourcompany.appname`
   - Must be unique and follow reverse domain format

3. **Verify app.json structure:**
   ```json
   {
     "expo": {
       "name": "Socratic Coach",
       "slug": "socratic-coach",
       "version": "1.0.0",
       "platforms": ["ios", "android"]
     }
   }
   ```

## Test Locally First:
```bash
cd your-mobile-repo
npm install
npx expo start
```

If local testing fails, fix those errors before using Expo Launch.

## Alternative: EAS Build
If Expo Launch continues failing:
```bash
npm install -g @expo/eas-cli
eas login
eas build:configure
eas build --platform all
```

Most "deployment requirements" errors are due to missing `platforms` array or incorrect bundle identifiers in app.json.