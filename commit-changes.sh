#!/bin/bash
# Commit all recent changes to GitHub

echo "═══════════════════════════════════════════════════════════"
echo "  Committing ADK Link Changes to GitHub"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check git status
echo "📋 Current Status:"
git status
echo ""

# Stage all changes
echo "📦 Staging all changes..."
git add .
echo ""

# Show what will be committed
echo "📝 Changes to be committed:"
git status --short
echo ""

# Commit with descriptive message
echo "💾 Committing..."
git commit -m "feat: Add dynamic path detection and included launchers

- Implemented automatic path detection system that makes ADK Link fully portable
- Added path-detector.ts library for client/server path detection
- Created /api/app-paths endpoint to expose detected paths
- Updated Providers to initialize path detection on startup

- Added two ready-to-use launchers (drag & drop ready):
  * Launch ADK Link.bat (normal mode with console)
  * Launch ADK Link (Silent).bat (silent background mode)
  
- Created START_HERE.txt with eye-catching instructions for users
- Updated create-shortcut.ps1 to use dynamic path detection
- Added validate-paths.ps1 tool to check and fix path configurations
- Updated FIX_SHORTCUT.md with new path detection info

- Documentation:
  * PATH_DETECTION.md - Full path detection system docs
  * INCLUDED_LAUNCHERS.md - Complete launcher documentation
  * Updated README.md with prominent Quick Start section

Users can now:
- Move ADK Link anywhere and it still works
- Double-click launchers to start (no setup required)
- Drag launchers to desktop for quick access
- Zero configuration needed

This makes ADK Link as easy to use as any commercial Windows application!"

echo ""
echo "🚀 Pushing to GitHub..."
git push

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ Successfully pushed to GitHub!"
echo "═══════════════════════════════════════════════════════════"
