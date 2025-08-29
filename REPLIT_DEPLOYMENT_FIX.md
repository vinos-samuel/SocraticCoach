# Replit Deployment Requirements Fix

## Error: "Project does not meet all deployment requirements"

This usually means your project is missing one or more requirements for Autoscale deployment.

## Common Issues and Fixes:

### 1. Build Process Failed
Your `.replit` file specifies: `build = ["npm", "run", "build"]`

**Check if build works:**
```bash
npm run build
```

**If build fails:**
- Fix any TypeScript errors
- Ensure all dependencies are installed
- Check that `dist/` directory is created

### 2. Missing Production Start Script
Your `.replit` specifies: `run = ["npm", "run", "start"]`

**Verify this works:**
```bash
npm run start
```

**Your current start script:** `NODE_ENV=production node dist/index.js`

### 3. Missing Built Files
Autoscale deployment needs the `dist/` directory with built files.

**Check if these exist after build:**
- `dist/index.js` (built server)
- `dist/assets/` (built frontend)

### 4. Port Configuration
**Current config looks correct:**
```
localPort = 5000
externalPort = 80
PORT = "5000"
```

### 5. Environment Variables Missing
**Required secrets for your app:**
- `ANTHROPIC_API_KEY` ✓ (you have this)
- `DATABASE_URL` ✓ (you have this)
- Any others needed?

## Quick Fixes to Try:

### Fix 1: Run Build Manually
```bash
npm run build
npm run start
```
If either fails, fix the errors first.

### Fix 2: Check Dependencies
Make sure all production dependencies are in `dependencies` (not `devDependencies`):
- `@anthropic-ai/sdk` ✓
- `express` ✓
- Database packages ✓

### Fix 3: Simplify .replit Config
Try this minimal configuration:

```ini
[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["npm", "start"]

[[ports]]
localPort = 5000
externalPort = 80
```

### Fix 4: Check for Missing Files
Ensure these exist:
- `package.json` ✓
- Built `dist/` directory
- All required source files

## Alternative: Use Reserved VM
If Autoscale continues failing, try Reserved VM:

```ini
[deployment]
deploymentTarget = "reserved-vm"
```

Reserved VM is more forgiving for complex full-stack apps.

## Debug Steps:
1. Run `npm run build` - does it work?
2. Run `npm run start` - does the server start?
3. Check if `dist/index.js` exists
4. Try Reserved VM deployment instead
5. Check Replit console for specific error details

Most deployment requirement errors are due to build failures or missing production start scripts.