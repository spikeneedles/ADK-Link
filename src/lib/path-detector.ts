/**
 * Path Detector - Automatically detects and updates application paths
 * Makes ADK Link truly portable by dynamically finding its real location
 */

export interface AppPaths {
  appRoot: string;
  workingDir: string;
  timestamp: number;
}

/**
 * Detects the current application root directory
 * This works both in dev and production
 */
export function detectAppRoot(): string {
  if (typeof window === 'undefined') {
    // Server-side: use process.cwd()
    return process.cwd();
  }
  
  // Client-side: use the stored path from initial detection
  const stored = localStorage.getItem('app_root_path');
  if (stored) {
    try {
      const parsed: AppPaths = JSON.parse(stored);
      // Check if detection is recent (within 1 hour)
      if (Date.now() - parsed.timestamp < 3600000) {
        return parsed.appRoot;
      }
    } catch (e) {
      console.warn('Failed to parse stored app path:', e);
    }
  }
  
  // Fallback: detect from current location
  return detectFromWindow();
}

/**
 * Detect app root from window location (client-side)
 */
function detectFromWindow(): string {
  if (typeof window === 'undefined') return process.cwd();
  
  // The app is running from its location, so we can infer the path
  // This is a fallback - the server should provide the real path
  return window.location.origin;
}

/**
 * Initialize path detection on app startup
 * Call this from the root layout or _app
 */
export async function initializePathDetection(): Promise<AppPaths> {
  try {
    // Fetch the real app root from server
    const response = await fetch('/api/app-paths');
    if (!response.ok) throw new Error('Failed to fetch app paths');
    
    const paths: AppPaths = await response.json();
    
    // Store for client-side access
    localStorage.setItem('app_root_path', JSON.stringify(paths));
    
    console.log('[Path Detector] App root detected:', paths.appRoot);
    
    return paths;
  } catch (error) {
    console.error('[Path Detector] Failed to detect paths:', error);
    
    // Fallback paths
    const fallbackPaths: AppPaths = {
      appRoot: process.cwd(),
      workingDir: process.cwd(),
      timestamp: Date.now(),
    };
    
    return fallbackPaths;
  }
}

/**
 * Get normalized path (converts to forward slashes for consistency)
 */
export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}

/**
 * Check if a path is within the app root
 */
export function isPathInAppRoot(targetPath: string, appRoot?: string): boolean {
  const root = appRoot || detectAppRoot();
  const normalizedTarget = normalizePath(targetPath).toLowerCase();
  const normalizedRoot = normalizePath(root).toLowerCase();
  
  return normalizedTarget.startsWith(normalizedRoot);
}

/**
 * Resolve a relative path from app root
 */
export function resolveFromAppRoot(relativePath: string): string {
  const appRoot = detectAppRoot();
  return `${appRoot}/${relativePath.replace(/^[\/\\]+/, '')}`;
}
