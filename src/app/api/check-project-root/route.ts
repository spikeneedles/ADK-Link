import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Common project root indicators
const PROJECT_ROOT_FILES = [
  'package.json',
  'Cargo.toml',
  'go.mod',
  'requirements.txt',
  'pyproject.toml',
  'setup.py',
  'pom.xml',
  'build.gradle',
  'Gemfile',
  'composer.json',
  '.git',
];

export async function POST(request: Request) {
  try {
    const { path: dirPath } = await request.json();

    if (!dirPath) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      );
    }

    // Check if directory exists
    try {
      const stats = await fs.stat(dirPath);
      if (!stats.isDirectory()) {
        return NextResponse.json({ hasProjectRoot: false });
      }
    } catch {
      return NextResponse.json({ hasProjectRoot: false });
    }

    // Read directory contents
    const files = await fs.readdir(dirPath);

    // Check if any project root indicator exists in current directory
    const hasRootFile = files.some(file => 
      PROJECT_ROOT_FILES.includes(file)
    );

    if (hasRootFile) {
      return NextResponse.json({ hasProjectRoot: true });
    }

    // Check subdirectories (one level deep)
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      try {
        const stats = await fs.stat(fullPath);
        if (stats.isDirectory()) {
          const subFiles = await fs.readdir(fullPath);
          const hasSubProjectRoot = subFiles.some(subFile =>
            PROJECT_ROOT_FILES.includes(subFile)
          );
          if (hasSubProjectRoot) {
            return NextResponse.json({ hasProjectRoot: true });
          }
        }
      } catch {
        // Skip files that can't be accessed
        continue;
      }
    }

    // No project root found
    return NextResponse.json({ hasProjectRoot: false });

  } catch (error) {
    console.error('Error checking project root:', error);
    return NextResponse.json(
      { error: 'Failed to check project root' },
      { status: 500 }
    );
  }
}
