# Instructions to Fix Your Desktop Shortcut

## About Path Detection
ADK Link now automatically detects its location! All launcher scripts use dynamic paths, so you can move ADK Link anywhere and it will still work.

## If Your Shortcut is Broken:

### Option 1: Auto-Fix with PowerShell (Recommended)
Run this in PowerShell from the ADK Link directory:
```powershell
.\validate-paths.ps1
```
This will check your shortcut and offer to fix it automatically.

### Option 2: Create New Shortcut (Easiest)
Run this in PowerShell from the ADK Link directory:
```powershell
.\create-shortcut.ps1
```
This creates a new shortcut with the correct paths (automatically detected).

### Option 3: Manual Fix
1. Right-click your desktop shortcut → Properties
2. In "Target" field, change to:
   ```
   C:\WINDOWS\system32\wscript.exe "[YOUR_ADK_LINK_PATH]\launch_silent.vbs"
   ```
   Replace [YOUR_ADK_LINK_PATH] with the actual location of ADK Link
3. In "Start in" field, set to your ADK Link directory
4. Click OK

## How It Works Now:
- **launch_silent.vbs** - Automatically finds its own location
- **launch_app.bat** - Uses %~dp0 to detect directory
- **launch_app.ps1** - Uses $PSScriptRoot for dynamic paths
- **create-shortcut.ps1** - Detects ADK Link location automatically
- **validate-paths.ps1** - NEW! Checks and fixes your shortcut

## Moving ADK Link:
You can now move the entire ADK Link folder anywhere on your system:
1. Move the folder to new location
2. Run `.\create-shortcut.ps1` to update your shortcut
3. Done! Everything else updates automatically.

---
✨ ADK Link is now truly portable!
