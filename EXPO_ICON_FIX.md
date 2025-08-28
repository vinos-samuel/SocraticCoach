# Expo Launch Icon Fix

## The Problem
Error: `ENOENT: no such file or directory, open './assets/icon.png'`

This means your mobile repository is missing the required app icon file.

## Quick Fix Options

### Option 1: Upload Missing Icon (Fastest)
1. Go to your mobile repository on GitHub
2. Create an `assets` folder if it doesn't exist
3. Upload any 1024x1024 PNG image as `icon.png`
4. You can use any square image temporarily - even a simple logo or placeholder
5. Retry Expo Launch

### Option 2: Use Generated Icon from Original Project
1. Download the generated icon from your original project:
   - File: `attached_assets/generated_images/Socratic_Coach_app_icon_1b68c7d9.png`
2. Rename it to `icon.png`
3. Upload to your mobile repository's `assets/` folder
4. Also upload as:
   - `adaptive-icon.png` (same file)
   - `splash.png` (same file, temporary)
   - `favicon.png` (same file)

### Option 3: Create Simple Placeholder Icon
Create a simple 1024x1024 icon with any design tool or use this CSS-generated one:

**Temporary Icon Solution:**
- Use any square image (1024x1024 recommended)
- Name it `icon.png` 
- Upload to `assets/` folder in your mobile repository

## Required Files in assets/ folder:
```
assets/
├── icon.png          (1024x1024 - main app icon)
├── adaptive-icon.png (1024x1024 - Android adaptive icon)  
├── splash.png        (1242x2436 - splash screen)
└── favicon.png       (48x48 - web favicon)
```

## Quick Test
After adding the icon:
1. Go to Expo Launch
2. Re-enter your mobile repository URL
3. Try launching again

The build should proceed past the icon error and work correctly.