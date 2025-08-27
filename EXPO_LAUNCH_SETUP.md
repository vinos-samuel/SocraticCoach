# Expo Launch Setup Guide

## Option 1: Use Root Configuration (Current Setup)

I've added `expo.json` to the root directory that points to your mobile app in the `mobile/` subdirectory.

### Steps:
1. Commit and push changes to GitHub:
   ```bash
   git add .
   git commit -m "Add Expo Launch configuration"
   git push
   ```

2. Use Expo Launch:
   - Go to https://launch.expo.dev/
   - Enter repository: `vinos-samuel/socraticcoach`
   - Branch: `main`

## Option 2: Create Separate Mobile Repository (Alternative)

If Option 1 doesn't work, create a dedicated mobile repository:

### Steps:
1. Create new repository: `vinos-samuel/socratic-coach-mobile`

2. Copy mobile files to new repository:
   ```bash
   # Clone your current repo
   git clone https://github.com/vinos-samuel/socraticcoach.git temp-repo
   cd temp-repo

   # Copy mobile directory contents to root
   cp -r mobile/* .
   rm -rf mobile/

   # Initialize new repository
   git init
   git add .
   git commit -m "Initial mobile app setup"
   git remote add origin https://github.com/vinos-samuel/socratic-coach-mobile.git
   git push -u origin main
   ```

3. Use Expo Launch with new repository:
   - Repository: `vinos-samuel/socratic-coach-mobile`

## Option 3: Update API URL First

Before using Expo Launch, update the API URL in the mobile app:

1. Edit `mobile/lib/api.ts`:
   ```typescript
   const API_BASE_URL = __DEV__ 
     ? 'http://localhost:5000' 
     : 'https://your-replit-app-name.replit.app';
   ```

2. Replace `your-replit-app-name` with your actual Replit deployment URL

## Troubleshooting Expo Launch

**Common Issues:**

1. **"No Expo project found"**
   - Make sure `expo.json` or `app.json` exists in root
   - Check that GitHub repository is public
   - Verify branch name is correct

2. **"Dependencies failed to install"**
   - Check for package.json conflicts
   - Try Option 2 (separate repository)

3. **"Metro bundler failed"**
   - Usually resolves automatically on retry
   - Check for TypeScript errors in mobile code

**Debug Steps:**
1. Verify repository structure on GitHub
2. Check that expo.json points to correct paths
3. Try with a simple Expo template first to test Expo Launch

## Current Project Structure
```
vinos-samuel/socraticcoach/
├── expo.json              ← New: Root Expo config
├── package.json           ← Web app
├── client/                ← Web app
├── server/                ← Web app  
└── mobile/                ← Mobile app
    ├── package.json       ← Mobile dependencies
    ├── app.json           ← Mobile Expo config
    └── app/               ← Mobile screens
```

Try Option 1 first - it should work with Expo Launch now!