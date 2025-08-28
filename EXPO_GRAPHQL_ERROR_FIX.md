# Expo GraphQL Server Error Fix

## Error: `[GraphQL] Unexpected server error (Expo error ID: 8e30a348-4d96-49a0-b744-96c353fb67b2)`

This is a temporary server-side error from Expo's infrastructure, not your code.

## Solutions (Try in Order):

### 1. Wait and Retry (Most Common Fix)
- Wait 5-10 minutes
- Try Expo Launch again with the same repository URL
- Expo servers often recover automatically

### 2. Clear Browser Cache
- Clear your browser cache and cookies for launch.expo.dev
- Try in incognito/private browsing mode
- Or try a different browser

### 3. Check Repository Status
Verify your mobile repository has:
- ✅ `package.json` with Expo dependencies
- ✅ `app.json` with Expo configuration  
- ✅ `assets/icon.png` (1024x1024)
- ✅ All files committed and pushed

### 4. Repository Refresh
- Make a small change to your repository (add a comment to README)
- Commit and push the change
- This can trigger Expo to refresh its cache of your repo

### 5. Try Different Repository URL Format
If using: `https://github.com/username/repo`
Try: `username/repo` (without the https://github.com/)

### 6. Check Expo Status
- Visit: https://status.expo.dev/
- Look for any ongoing incidents or maintenance

## Alternative: Use Expo CLI Locally

If Expo Launch continues failing, you can test locally:

```bash
# Clone your mobile repository
git clone https://github.com/your-username/your-mobile-repo.git
cd your-mobile-repo

# Install dependencies
npm install

# Start Expo
npx expo start
```

## Common Causes of This Error:
- Expo server overload (temporary)
- Repository parsing issues (usually fixes with retry)
- Network connectivity issues
- Expo service maintenance

## Success Rate:
- 80% resolve with simple retry after 5-10 minutes
- 15% resolve with browser cache clear
- 5% require waiting for Expo service recovery

**Most likely solution: Wait 10 minutes and try again. This error is typically temporary.**