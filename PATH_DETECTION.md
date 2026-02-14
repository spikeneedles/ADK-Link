# 🎯 Dynamic Path Detection System

ADK Link now automatically detects and adapts to its real location on your system. This makes it truly portable - you can move the entire folder anywhere, and everything will continue to work!

## How It Works

### Server-Side Detection
When the Next.js app starts, it automatically:
1. Detects the application root using `process.cwd()`
2. Validates the path by checking for `package.json`
3. Exposes the detected paths via `/api/app-paths`

### Client-Side Initialization
On app launch, the client:
1. Fetches real paths from the server
2. Stores them in `localStorage` for fast access
3. Uses the detected paths for all file operations

### Launcher Scripts
All launcher scripts use dynamic path detection:
- **launch_silent.vbs** → `GetParentFolderName(WScript.ScriptFullName)`
- **launch_app.bat** → `%~dp0` (batch file directory)
- **launch_app.ps1** → `$PSScriptRoot` (PowerShell script root)
- **create-shortcut.ps1** → Auto-detects and creates correct shortcut

## Key Files

### Core Path Detection
- **`src/lib/path-detector.ts`** - Core path detection library
  - `detectAppRoot()` - Get current app location
  - `initializePathDetection()` - Initialize on startup
  - `isPathInAppRoot()` - Validate paths are within app
  - `resolveFromAppRoot()` - Resolve relative paths

### API Endpoint
- **`src/app/api/app-paths/route.ts`** - Exposes detected paths to client

### Integration
- **`src/components/providers.tsx`** - Calls `initializePathDetection()` on mount

## Usage Examples

### In React Components
```typescript
import { detectAppRoot, resolveFromAppRoot } from '@/lib/path-detector';

// Get the app root
const appRoot = detectAppRoot();

// Resolve a relative path
const configPath = resolveFromAppRoot('config/settings.json');
```

### In API Routes
```typescript
import { detectAppRoot } from '@/lib/path-detector';

export async function GET() {
  const appRoot = detectAppRoot();
  // Use appRoot for file operations
}
```

## Validation Tool

Run **`validate-paths.ps1`** to:
- ✓ Verify all required files exist
- ✓ Check desktop shortcut configuration
- ✓ Offer to auto-fix incorrect paths
- ✓ Display current ADK Link location

```powershell
.\validate-paths.ps1
```

## Moving ADK Link

To move ADK Link to a new location:

1. **Move the entire folder** to the new location
2. **Update your shortcut:**
   ```powershell
   .\create-shortcut.ps1
   ```
3. **That's it!** Everything else updates automatically

## Benefits

✅ **Truly Portable** - Move ADK Link anywhere, it just works  
✅ **No Hardcoded Paths** - All paths are detected dynamically  
✅ **Self-Healing** - Can detect and fix incorrect configurations  
✅ **User-Friendly** - Validation tool guides users through fixes  
✅ **Multi-User Safe** - Works for any user on any system  

## Technical Details

### Path Storage
- Client-side paths are stored in `localStorage` under key `app_root_path`
- Cache expires after 1 hour (forces re-detection)
- Fallback to `process.cwd()` if detection fails

### Path Normalization
All paths are normalized to use forward slashes (`/`) for consistency:
```typescript
"C:\Users\josh\ADK Link" → "C:/Users/josh/ADK Link"
```

This prevents issues when comparing paths across different systems.

### Validation
The `/api/app-paths` endpoint validates by checking for `package.json`:
```typescript
const packageJsonPath = path.join(appRoot, 'package.json');
const isValid = fs.existsSync(packageJsonPath);
```

## Future Enhancements

Potential additions:
- Auto-update shortcuts when path changes detected
- Portable config file that moves with the app
- Network path support for shared installations
- Multi-instance detection and management

---

**Status:** ✅ Fully Implemented and Tested  
**Version:** 1.0.0  
**Last Updated:** 2026-02-14
