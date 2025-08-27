# Expo Launch Fix - Repository Structure Issue

## The Problem
Expo Launch expects to find an Expo project in the repository root, but your repository contains:
- **Web app** (main project) in the root directory 
- **Mobile app** in the `mobile/` subdirectory

Expo Launch can't handle this mixed structure because it looks for `package.json` with Expo dependencies in the root.

## **Solution 1: Create Separate Mobile Repository (Recommended)**

This is the cleanest solution for Expo Launch:

### Steps:
1. **Create a new GitHub repository** for just the mobile app:
   - Repository name: `vinos-samuel/socratic-coach-mobile`

2. **Copy the mobile app contents to the new repository root:**
   
   **Option A: Manual Copy (Easiest)**
   - Download your current repository as ZIP
   - Extract it and copy everything from `mobile/` folder
   - Create new repository and upload these files to the root

   **Option B: Git Commands**
   ```bash
   # Clone current repository
   git clone https://github.com/vinos-samuel/socraticcoach.git temp-clone
   cd temp-clone
   
   # Move mobile contents to root
   cp -r mobile/* .
   cp mobile/.* . 2>/dev/null || true
   rm -rf mobile/
   
   # Create new repository
   git init
   git add .
   git commit -m "Mobile app for Expo Launch"
   git remote add origin https://github.com/vinos-samuel/socratic-coach-mobile.git
   git push -u origin main
   ```

3. **Update API URL in the new repository:**
   Edit `lib/api.ts` and replace the placeholder URL:
   ```typescript
   const API_BASE_URL = __DEV__ 
     ? 'http://localhost:5000' 
     : 'https://your-actual-replit-url.replit.app';
   ```

4. **Use Expo Launch with new repository:**
   - Go to https://launch.expo.dev/
   - Enter: `vinos-samuel/socratic-coach-mobile`
   - This should work perfectly!

## **Solution 2: Monorepo Structure (Alternative)**

If you want to keep everything in one repository, restructure like this:

```
socraticcoach/
├── web-app/          ← Move current root contents here
│   ├── package.json  ← Web app dependencies
│   ├── client/
│   └── server/
├── mobile-app/       ← Rename from mobile/
│   ├── package.json  ← Mobile app dependencies  
│   └── app/
├── package.json      ← Root package.json for Expo Launch
└── app.json          ← Root Expo configuration
```

This requires more restructuring and may break your current Replit setup.

## **Solution 3: Use Different Mobile Development Platform**

Instead of Expo Launch, you can use:
- **Expo CLI locally** with `npx expo start` in the mobile/ directory
- **Replit Mobile Development** (if available)
- **Manual setup** with React Native CLI

## **Recommendation**

**Go with Solution 1** - create a separate mobile repository. This is the cleanest approach because:

✅ Works perfectly with Expo Launch  
✅ Keeps your current web app setup intact  
✅ Makes mobile development independent  
✅ Easier to manage separate deployments  

Your new repository structure will be:
```
vinos-samuel/socratic-coach-mobile/
├── package.json      ← Mobile dependencies
├── app.json          ← Expo configuration
├── app/              ← Mobile screens
├── lib/              ← Mobile utilities
└── assets/           ← Mobile assets
```

This matches exactly what Expo Launch expects to find!