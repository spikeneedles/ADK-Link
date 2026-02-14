# 🚀 Included Launchers - Ready to Use!

ADK Link comes with **pre-made launchers** that you can drag and drop anywhere! No setup required.

## 📋 Available Launchers

### 1. **Launch ADK Link.bat** (Normal Mode)
- ✅ Visible console window (see server logs)
- ✅ Shows startup progress
- ✅ Good for debugging
- **Use when:** You want to see what's happening

### 2. **Launch ADK Link (Silent).bat** (Silent Mode) 
- ✅ No console window (runs in background)
- ✅ Clean and professional
- ✅ Best for daily use
- **Use when:** You just want the app to open

## 🎯 How to Use

### Option 1: Launch from ADK Link Folder
Simply double-click either launcher file from the ADK Link folder!

### Option 2: Create Desktop Shortcut (Drag & Drop)
1. Open the ADK Link folder in File Explorer
2. Find **"Launch ADK Link.bat"** or **"Launch ADK Link (Silent).bat"**
3. **Right-click** and drag to your desktop
4. Choose **"Create shortcuts here"**
5. Done! ✨

### Option 3: Pin to Start Menu/Taskbar
1. Right-click the launcher
2. Choose **"Pin to Start"** or **"Pin to taskbar"**
3. Launch from anywhere!

## ✨ Features

### Fully Portable
Both launchers use dynamic path detection:
```batch
set "ADK_ROOT=%~dp0"
```
This means:
- ✅ Works no matter where you move ADK Link
- ✅ Works no matter where you put the shortcut
- ✅ Always finds the ADK Link folder automatically

### Error Handling
The launchers validate everything before starting:
- ✅ Checks if ADK Link files exist
- ✅ Shows helpful error messages
- ✅ Won't leave zombie processes

### What They Do
When you double-click a launcher:
1. 🔍 Detects ADK Link location
2. 🚀 Starts the Next.js dev server
3. ⏳ Waits for server to be ready
4. 🌐 Opens Microsoft Edge in app mode
5. 📱 Shows ADK Link UI
6. 🛑 Stops server when you close the app

## 🎨 Customization

### Change the Icon
1. Right-click the shortcut → Properties
2. Click "Change Icon"
3. Browse to an .ico file or choose from system icons
4. Click OK

### Rename the Shortcut
Just right-click → Rename! The launcher will still work.

## 📦 What's Included

```
ADK Link/
├── Launch ADK Link.bat              ← Normal launcher (shows console)
├── Launch ADK Link (Silent).bat     ← Silent launcher (hidden)
├── launch_app.ps1                   ← PowerShell script (used by launchers)
├── launch_app.bat                   ← Legacy launcher
├── launch_silent.vbs                ← VBS for silent mode
└── create-shortcut.ps1              ← Advanced: Creates .lnk shortcuts
```

## 🆚 Comparison

| Feature | Normal | Silent |
|---------|--------|--------|
| Shows console | ✅ Yes | ❌ No |
| See logs | ✅ Yes | ❌ No |
| Clean look | ⚠️ Console visible | ✅ Very clean |
| Debugging | ✅ Great | ⚠️ Limited |
| Daily use | ⚠️ Okay | ✅ Perfect |

## 🔧 Advanced

### Create a Real .lnk Shortcut
If you want a true Windows shortcut file (.lnk):
```powershell
.\create-shortcut.ps1
```
This creates a shortcut on your desktop with a custom icon.

### Use from Command Line
```batch
cd "C:\path\to\ADK Link"
"Launch ADK Link.bat"
```

### Run from Another Location
The launchers work even if called from elsewhere:
```batch
"C:\My Projects\ADK Link\Launch ADK Link.bat"
```

## ❓ Troubleshooting

### "Cannot find launch_app.ps1"
- Make sure the launcher is in the ADK Link folder
- Don't move just the launcher - it needs to be with the other files

### Server Won't Start
- Check if port 9002 is already in use
- Try closing other instances of ADK Link
- Run **normal mode** to see error messages

### Browser Doesn't Open
- Check if Edge is installed
- Edit `launch_app.ps1` to use a different browser
- Server will still run - open http://localhost:9002 manually

## 🎉 Quick Start

**New User?** Here's the fastest way to get started:

1. 📥 Download/extract ADK Link
2. 📂 Open the folder in File Explorer
3. 🖱️ Double-click **"Launch ADK Link (Silent).bat"**
4. ✅ ADK Link opens in browser!

**That's it!** No installation, no configuration, no hassle.

---

**Tip:** Right-drag the launcher to your desktop and select "Create shortcuts here" for easy access! 🚀
