
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const { path: projectPath } = await req.json();

        if (!projectPath) {
            return NextResponse.json({ error: 'Path required' }, { status: 400 });
        }

        // Security Check: Ensure path is accessible (basic check)
        try {
            await fs.access(projectPath);
        } catch {
            return NextResponse.json({ error: 'Path not found or inaccessible' }, { status: 404 });
        }

        // Check for common project indicators
        // We look for any of these files/folders to determine if it's a "project"
        const indicators = [
            'package.json', // Node/JS
            'Cargo.toml',   // Rust
            'go.mod',       // Go
            'requirements.txt', // Python
            'pyproject.toml', // Python
            'pom.xml',      // Java
            'build.gradle', // Java/Android
            '.git',         // Git repo
            'main.py',      // Simple python script
            'index.js',     // Simple node script
            'src'           // Source folder
        ];

        let hasProjectStructure = false;
        let foundIndicators: string[] = [];

        // Read top-level directory
        const files = await fs.readdir(projectPath);

        for (const file of files) {
            if (indicators.includes(file)) {
                hasProjectStructure = true;
                foundIndicators.push(file);
            }
        }

        // If not found in root, maybe check one level deep (e.g. if user selected a wrapper folder)?
        // For now, let's keep it strict to the selected root to avoid false positives in 'Downloads' folder etc.

        return NextResponse.json({
            hasProjectStructure,
            foundIndicators
        });

    } catch (error) {
        console.error('[API/scan-project] Error:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
