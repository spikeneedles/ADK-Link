
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import util from 'util';
import { logAction, logError } from '@/lib/logger';

const execPromise = util.promisify(exec);

export async function POST(req: NextRequest) {
    try {
        const { command, cwd } = await req.json();

        if (!command) {
            return NextResponse.json(
                { error: 'Missing command' },
                { status: 400 }
            );
        }

        // Security Check: Only allow if connected to a project
        const headerPath = req.headers.get('x-project-path');
        const cookiePath = req.cookies.get('connectedProjectPath')?.value;
        const connectedPath = cookiePath || headerPath;

        if (!connectedPath) {
            return NextResponse.json(
                {
                    error: 'SANDBOX_MODE',
                    message: 'Not connected to a project. Connect via ADK Link button to execute commands.'
                },
                { status: 403 }
            );
        }

        // Ensure cwd is within the project path if provided
        let workingDir = connectedPath;
        if (cwd) {
            // Resolve absolute path
            const resolvedCwd = path.resolve(cwd);
            const normalizedCwd = resolvedCwd.toLowerCase();
            const normalizedProject = connectedPath.toLowerCase();

            if (normalizedCwd.startsWith(normalizedProject)) {
                workingDir = resolvedCwd;
            } else {
                console.warn(`[API/run-command] Blocked attempt to run in ${cwd} (outside project ${connectedPath})`);
                // We fallback to project root instead of erroring, for safety
            }
        }

        console.log(`[API/run-command] Executing: "${command}" in "${workingDir}"`);

        // We use 'start' on Windows to open a new window
        // On Mac it would be 'open -a Terminal', Linux 'x-terminal-emulator'
        // For now, ADK Link seems Windows-focused based on user context

        let finalCommand = command;

        // If command is to launch a separate process/window
        if (command.startsWith('start ')) {
            // It's already a start command
        } else {
            // Wrap in a new window launch
            // /k keeps window open
            finalCommand = `start cmd.exe /k "cd /d "${workingDir}" && ${command}"`;
        }

        exec(finalCommand, (error) => {
            if (error) {
                console.error(`[API/run-command] Exec error: ${error}`);
                logError(error);
            }
        });

        logAction('Run Command', `Launched command: ${command} in ${workingDir}`);

        // We return success immediately because 'start' is fire-and-forget mostly
        return NextResponse.json({ success: true, message: 'Command launched' });

    } catch (error) {
        console.error('[API/run-command] Fatal Error:', error);
        logError(error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Unknown error',
                details: String(error)
            },
            { status: 500 }
        );
    }
}
