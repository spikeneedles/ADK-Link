import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function POST(req: NextRequest) {
  try {
    const { path: dirPath } = await req.json();

    if (!dirPath) {
      return NextResponse.json(
        { error: 'Missing path parameter' },
        { status: 400 }
      );
    }

    // Resolve to absolute path
    const absolutePath = path.resolve(dirPath);

    // Read directory contents
    const entries = await fs.readdir(absolutePath, { withFileTypes: true });

    // Sort: directories first, then files, both alphabetically
    const files = entries
      .map(entry => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
      }))
      .sort((a, b) => {
        if (a.isDirectory === b.isDirectory) {
          return a.name.localeCompare(b.name);
        }
        return a.isDirectory ? -1 : 1;
      });

    return NextResponse.json({ files, path: absolutePath });
  } catch (error) {
    console.error('Directory listing error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to list directory',
        files: [] 
      },
      { status: 500 }
    );
  }
}
