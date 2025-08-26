# Mobile App Store Deployment Guide

This guide walks you through deploying the Socratic Coach mobile app to iOS App Store and Google Play Store.

## Prerequisites

### Accounts Required
- **Apple Developer Account** ($99/year) - for iOS App Store
- **Google Play Console Account** ($25 one-time) - for Android Play Store
- **Expo Account** (free) - for EAS build services

### Development Environment
- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g @expo/eas-cli`
- Xcode (for iOS testing on Mac)
- Android Studio (for Android testing)

## Initial Setup

### 1. Configure Expo Project

```bash
cd mobile
npm install
eas login
eas build:configure
```

### 2. Update App Configuration

Edit `mobile/app.json`:
- Update `name`, `slug`, and `version`
- Set proper `bundleIdentifier` for iOS
- Set proper `package` name for Android
- Add your app icons and splash screens to `assets/` directory

### 3. Backend Configuration

Update `mobile/lib/api.ts` with your production API URL:
```typescript
const API_BASE_URL = 'https://your-replit-app.replit.app';
```

## Building for Production

### iOS App Store

1. **Update iOS Configuration** in `eas.json`:
```json
{
  "build": {
    "production": {
      "ios": {
        "bundleIdentifier": "com.yourcompany.socraticcoach"
      }
    }
  }
}
```

2. **Build iOS App**:
```bash
eas build --platform ios --profile production
```

3. **Download and Test**:
- Download the `.ipa` file from EAS dashboard
- Install on a physical iOS device using TestFlight or direct installation

### Android Play Store

1. **Update Android Configuration** in `eas.json`:
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

2. **Build Android App**:
```bash
eas build --platform android --profile production
```

3. **Download and Test**:
- Download the `.apk` file from EAS dashboard
- Install on Android device for testing

## App Store Submission

### iOS App Store Submission

1. **Prepare App Store Connect**:
- Create app listing in App Store Connect
- Upload screenshots (multiple device sizes required)
- Write app description and keywords
- Set up privacy policy if collecting user data

2. **Submit to App Store**:
```bash
eas submit --platform ios
```

3. **App Review Process**:
- Apple typically takes 1-7 days to review
- Respond to any feedback from Apple review team
- App goes live once approved

### Google Play Store Submission

1. **Prepare Play Console**:
- Create app listing in Google Play Console
- Upload screenshots and app description
- Complete content rating questionnaire
- Set up privacy policy if applicable

2. **Submit to Play Store**:
```bash
eas submit --platform android
```

3. **Release Process**:
- Google Play review typically takes 1-3 days
- You can choose internal testing, closed testing, or production release
- App goes live once approved

## Store Listing Optimization

### App Store Screenshots
Required sizes for iOS:
- iPhone 6.7": 1290 x 2796 pixels
- iPhone 6.5": 1242 x 2688 pixels
- iPhone 5.5": 1242 x 2208 pixels
- iPad Pro (6th gen): 2048 x 2732 pixels

### Play Store Screenshots
Required sizes for Android:
- Phone: 1080 x 1920 pixels minimum
- 7-inch tablet: 1200 x 1920 pixels minimum
- 10-inch tablet: 1920 x 1200 pixels minimum

### App Description Template

**Short Description (80 characters):**
"AI-powered thinking coach using Socratic method for better decisions"

**Full Description:**
```
Think Deeper, Decide Better with Socratic Coach

Transform how you approach problems and decisions with our AI-powered thinking companion. Using the proven Socratic method, our app guides you through thoughtful questions that help you:

🧠 Explore problems from all angles
💡 Discover insights through self-reflection  
📋 Create actionable plans based on your discoveries
🎙️ Use voice interaction for natural conversations
📚 Track your thinking journey over time
📤 Share insights and action plans easily

Perfect for:
- Complex life decisions
- Business strategy planning
- Personal growth and reflection
- Problem-solving at work
- Academic and creative projects

Features:
✓ AI-guided Socratic questioning
✓ Voice interaction capability
✓ Conversation history and tracking
✓ Export and sharing options
✓ Mobile-optimized experience
✓ Privacy-focused design

Start thinking more clearly today. Download Socratic Coach and discover the power of guided self-reflection.
```

## App Store Requirements Checklist

### Before Submission
- [ ] App tested on real devices (iOS and Android)
- [ ] All features working with production API
- [ ] App icons and splash screens created (1024x1024 minimum)
- [ ] Screenshots prepared for all required device sizes
- [ ] App description and keywords optimized
- [ ] Privacy policy created (if collecting user data)
- [ ] Terms of service created (if applicable)
- [ ] App version updated in `app.json`

### iOS Specific
- [ ] Apple Developer Program membership active
- [ ] Bundle identifier matches App Store Connect
- [ ] App Store Connect listing complete
- [ ] TestFlight testing completed
- [ ] App follows iOS Human Interface Guidelines

### Android Specific
- [ ] Google Play Console account set up
- [ ] Signed APK or AAB file ready
- [ ] Play Store listing complete
- [ ] Content rating completed
- [ ] App follows Android Design Guidelines

## Post-Launch

### Updates and Maintenance
1. **Monitor app performance** using analytics
2. **Respond to user reviews** on both stores
3. **Release updates** using EAS build pipeline
4. **Track key metrics**: downloads, retention, ratings

### Analytics Setup (Optional)
Add analytics to track app usage:
```bash
npm install @react-native-amplitude/analytics
# or
npm install @sentry/react-native
```

### Push Notifications (Optional)
Enable push notifications for user engagement:
```bash
expo install expo-notifications
```

## Troubleshooting

### Common Build Issues
- **Certificate errors**: Ensure Apple Developer account is properly configured
- **Bundle identifier conflicts**: Use unique bundle identifier
- **Asset size issues**: Optimize images to reduce app size

### Submission Rejections
- **iOS rejections**: Usually due to guideline violations or metadata issues
- **Android rejections**: Often policy violations or technical issues

### Getting Help
- [Expo EAS Documentation](https://docs.expo.dev/build/introduction/)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)

## Cost Summary

**One-time Costs:**
- Apple Developer Program: $99/year
- Google Play Console: $25 one-time

**Ongoing Costs:**
- EAS Build: Free tier available, paid plans for higher usage
- App Store hosting: Included with developer accounts
- Backend hosting: Your Replit deployment costs

Total estimated first-year cost: ~$125 + hosting costs