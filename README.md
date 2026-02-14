# ADK Link

The portable Agent Development Kit.

A Next.js 15 application featuring AI-powered development tools using Genkit with Gemini 2.5 Flash.

## 🚀 Quick Start (New Users!)

ADK Link comes with **pre-made launchers** - just double-click to start!

### Two Ways to Launch:

1. **Normal Mode** (shows console):
   - Double-click: `Launch ADK Link.bat`
   - See server logs and startup progress

2. **Silent Mode** (runs in background):
   - Double-click: `Launch ADK Link (Silent).bat`
   - Clean, no console window

### 📌 Create Desktop Shortcut:
1. Right-click and drag either launcher to your desktop
2. Choose "Create shortcuts here"
3. Done! Launch from anywhere 🎉

**Both launchers are fully portable** - they work no matter where you move ADK Link!

## Getting Started

To get started, take a look at src/app/page.tsx.

## Development

```bash
npm run dev        # Start the dev server on port 9002
npm run genkit:dev # Start Genkit developer UI
npm run build      # Build for production
npm run lint       # Run linter
npm run typecheck  # Run TypeScript type checking
```

## 📂 Key Files

- **`Launch ADK Link.bat`** - Normal launcher (included!)
- **`Launch ADK Link (Silent).bat`** - Silent launcher (included!)
- **`create-shortcut.ps1`** - Creates a .lnk shortcut with icon
- **`validate-paths.ps1`** - Validates and fixes path configuration

See [INCLUDED_LAUNCHERS.md](docs/INCLUDED_LAUNCHERS.md) for detailed launcher documentation.
