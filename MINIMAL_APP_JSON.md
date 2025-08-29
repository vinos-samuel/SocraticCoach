# Minimal Expo App.json Configuration

If the current app.json still fails, try this minimal version that meets basic deployment requirements:

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

This removes all optional configurations and keeps only the essential requirements:
- ✅ Name and slug
- ✅ Version
- ✅ Platforms array (required)
- ✅ SDK version (sometimes required)
- ✅ Bundle identifiers
- ✅ Expo router plugin (required for your app)
- ✅ Icon reference

Steps:
1. Replace your app.json with this minimal version
2. Ensure assets/icon.png exists (any 1024x1024 image)
3. Try Expo Launch again

If this minimal config works, we can add back other features gradually.