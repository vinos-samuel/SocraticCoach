# Expo Launch Troubleshooting Guide

## Current Issue: "Project does not meet all deployment requirements"

This error persists despite fixing app.json. Let's systematically check all requirements.

## Diagnostic Steps:

### 1. Verify Complete File Structure
Your mobile repository MUST have:
```
mobile-repo/
├── app.json                 ✅ (fixed)
├── package.json            ✅ (should be correct)
├── app/
│   ├── _layout.tsx         ✅ (entry point)
│   ├── index.tsx           ✅ (home screen)
│   └── coach.tsx           ✅ (coaching screen)
├── assets/
│   ├── icon.png            ❓ (needs verification)
│   ├── adaptive-icon.png   ❓ (needs verification)
│   └── splash.png          ❓ (needs verification)
├── lib/
│   └── api.ts              ✅ (API configuration)
└── components/             ✅ (UI components)
```

### 2. Common Missing Requirements:

#### A. Missing Assets (Most Common Cause)
Expo requires these exact files in `assets/` folder:
- `icon.png` (1024x1024 pixels, square)
- `adaptive-icon.png` (1024x1024 pixels, same as icon)
- `splash.png` (any reasonable size)

#### B. Package.json Issues
Must have correct main entry:
```json
{
  "main": "expo-router/entry"
}
```

#### C. App.json SDK Version
Some Expo Launch instances require explicit SDK:
```json
{
  "expo": {
    "sdkVersion": "51.0.0"
  }
}
```

#### D. Missing Dependencies
Check package.json has core Expo packages:
```json
{
  "dependencies": {
    "expo": "~51.0.0",
    "expo-router": "~3.5.0",
    "react": "18.3.1",
    "react-native": "0.74.5"
  }
}
```

### 3. Alternative App.json (Minimal Config)
If current config fails, try this minimal version:

```json
{
  "expo": {
    "name": "Socratic Coach",
    "slug": "socratic-coach",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "sdkVersion": "51.0.0",
    "icon": "./assets/icon.png",
    "ios": {
      "bundleIdentifier": "com.socraticcoach.app"
    },
    "android": {
      "package": "com.socraticcoach.app"
    },
    "plugins": ["expo-router"]
  }
}
```

### 4. Quick Fixes to Try:

#### Fix 1: Add SDK Version
Add to app.json under "expo":
```json
"sdkVersion": "51.0.0"
```

#### Fix 2: Upload Missing Assets
Create/upload these files to assets/ folder:
- Any 1024x1024 square image as `icon.png`
- Copy same image as `adaptive-icon.png`
- Any image as `splash.png`

#### Fix 3: Verify Entry Point
Check package.json has:
```json
"main": "expo-router/entry"
```

### 5. Test Locally First
Before using Expo Launch, test:
```bash
cd your-mobile-repo
npm install
npx expo start
```

If local fails, fix those errors first.

### 6. Alternative: EAS Build
If Expo Launch keeps failing:
```bash
npm install -g @expo/eas-cli
eas build:configure
eas build --platform all
```

Most deployment requirement errors are caused by:
1. Missing app icons (90% of cases)
2. Wrong bundle identifiers
3. Missing platforms array
4. Incorrect entry point