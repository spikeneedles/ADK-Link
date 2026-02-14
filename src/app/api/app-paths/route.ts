import { NextRequest, NextResponse } from 'next/server';
import * as path from 'path';
import * as fs from 'fs';

export async function GET(req: NextRequest) {
  try {
    // Get the real application root directory
    const appRoot = process.cwd();
    
    // Verify it's valid by checking for package.json
    const packageJsonPath = path.join(appRoot, 'package.json');
    const isValid = fs.existsSync(packageJsonPath);
    
    if (!isValid) {
      console.warn('[app-paths] Could not verify app root, package.json not found');
    }
    
    // Return paths for client-side use
    const paths = {
      appRoot: appRoot.replace(/\\/g, '/'), // Normalize to forward slashes
      workingDir: appRoot.replace(/\\/g, '/'),
      timestamp: Date.now(),
      isValid,
    };
    
    console.log('[app-paths] Detected paths:', paths);
    
    return NextResponse.json(paths);
  } catch (error) {
    console.error('[app-paths] Error detecting paths:', error);
    return NextResponse.json(
      { error: 'Failed to detect application paths' },
      { status: 500 }
    );
  }
}
