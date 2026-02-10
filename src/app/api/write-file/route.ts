
import { NextRequest, NextResponse } from 'next/server';
import { saveFile } from '@/ai/tools/file-operations';

export async function POST(req: NextRequest) {
  try {
    const { path, content } = await req.json();

    if (!path || content === undefined) {
      console.error('[API/write-file] Missing path or content');
      return NextResponse.json(
        { error: 'Missing path or content' },
        { status: 400 }
      );
    }

    // Check if project is connected (via cookie OR header)
    const headerPath = req.headers.get('x-project-path');
    const cookiePath = req.cookies.get('connectedProjectPath')?.value;
    const connectedPath = cookiePath || headerPath;
    
    console.log('[API/write-file] Header Path:', headerPath);
    console.log('[API/write-file] Cookie Path:', cookiePath);

    if (!connectedPath) {
      console.error('[API/write-file] Rejected: No connected project path found in cookies or headers.');
      return NextResponse.json(
        { 
          error: 'SANDBOX_MODE', 
          message: 'Not connected to a project. Connect via ADK Link button to enable file operations.' 
        },
        { status: 403 }
      );
    }

    // Validate path is within connected project
    const normalizedPath = path.replace(/\\/g, '/').toLowerCase();
    const normalizedProject = connectedPath.replace(/\\/g, '/').toLowerCase();
    
    console.log(`[API/write-file] Validating: "${normalizedPath}" startsWith "${normalizedProject}"`);

    if (!normalizedPath.startsWith(normalizedProject)) {
       console.error('[API/write-file] Path validation failed: Path outside project root.');
       return NextResponse.json(
        { 
          error: 'PATH_NOT_ALLOWED',
          message: `File operations are restricted to project root: ${connectedPath}. Attempted path: ${path}` 
        },
        { status: 403 }
      );
    }

    // Use our existing saveFile tool
    console.log(`[API/write-file] Writing to: ${path}`);
    const result = await saveFile({
      path,
      content,
      encoding: 'utf-8',
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('[API/write-file] Fatal Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error', 
        details: String(error) 
      },
      { status: 500 }
    );
  }
}
