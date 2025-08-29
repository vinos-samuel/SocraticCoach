# Expo iOS Build Error Fix

## Error: Fastlane build/archive error

This error occurs when Expo's cloud build service encounters iOS-specific configuration issues.

## Quick Fixes (Try in Order):

### 1. Check Bundle Identifier Format
Your `app.json` bundle identifier must follow Apple's format:

**Correct format:** `com.yourcompany.appname`
**Examples:**
- `com.socraticcoach.app`
- `com.yourname.socraticcoach`

**Check your app.json:**
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.socraticcoach.app"
    }
  }
}
```

### 2. Simplify Bundle Identifier
Sometimes complex names cause issues. Try:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.myapp.socratic"
    }
  }
}
```

### 3. Remove iOS-Specific Configurations
Temporarily remove advanced iOS settings that might cause conflicts:

**Before:**
```json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.socraticcoach.app",
      "buildNumber": "1"
    }
  }
}
```

**Simplified:**
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.socraticcoach.app"
    }
  }
}
```

### 4. Check App Name Length
Long app names can cause build issues. Shorten if needed:
```json
{
  "expo": {
    "name": "Socratic Coach",  // Good
    "slug": "socratic-coach"   // Good
  }
}
```

### 5. Verify Required Assets
Ensure these files exist and are properly sized:
- `assets/icon.png` (1024x1024)
- `assets/adaptive-icon.png` (1024x1024)
- `assets/splash.png` (1242x2436 or similar)

### 6. Use EAS Build Instead
Expo Launch sometimes has iOS build issues. Try EAS Build:

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# In your mobile repository
eas login
eas build:configure
eas build --platform ios
```

## Alternative: Build for Android First
iOS builds are more complex. Try Android to verify your app works:

**In app.json, focus on Android:**
```json
{
  "expo": {
    "android": {
      "package": "com.socraticcoach.app"
    }
  }
}
```

Then use Expo Launch with Android target.

## Common Bundle Identifier Issues:
- ❌ `socratic-coach` (missing com prefix)
- ❌ `com.socratic coach.app` (spaces not allowed)
- ❌ `com.socratic-coach-mobile-app` (too long/complex)
- ✅ `com.socraticcoach.app` (correct format)

## Quick Test:
1. Update your bundle identifier to simple format
2. Commit changes to your mobile repository
3. Try Expo Launch again
4. If still failing, try EAS Build instead

Most iOS build errors resolve with proper bundle identifier formatting.