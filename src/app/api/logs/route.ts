
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const logPath = path.join(process.cwd(), 'genkit-error.log');

        if (!fs.existsSync(logPath)) {
            return NextResponse.json({ logs: [] });
        }

        const logContent = fs.readFileSync(logPath, 'utf8');

        // Split entries by looking for timestamp pattern at start of line
        const entryPattern = /\[(\d{4}-\d{2}-\d{2}T[\d:]+(?:\.\d{3})?Z)\] Error: ([^\n]+)/g;
        const entries: any[] = [];
        
        let match;
        const matches: Array<{index: number, timestamp: string, message: string}> = [];
        
        // Find all entry start positions
        while ((match = entryPattern.exec(logContent)) !== null) {
            matches.push({
                index: match.index,
                timestamp: match[1],
                message: match[2]
            });
        }
        
        // Extract each entry with its details
        for (let i = 0; i < matches.length; i++) {
            const current = matches[i];
            const nextIndex = i < matches.length - 1 ? matches[i + 1].index : logContent.length;
            
            // Get the full entry content
            const fullContent = logContent.substring(current.index, nextIndex).trim();
            
            // Extract details (everything after first line)
            const lines = fullContent.split('\n');
            const details = lines.slice(1).join('\n').trim();
            
            entries.push({
                timestamp: current.timestamp,
                message: current.message,
                details,
                fullContent
            });
        }
        
        // Reverse to show newest first
        entries.reverse();

        return NextResponse.json({ logs: entries });

    } catch (error) {
        return NextResponse.json({ logs: [], error: 'Failed to read logs' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, stack } = body;

        const logPath = path.join(process.cwd(), 'genkit-error.log');
        const timestamp = new Date().toISOString();
        const entry = `[${timestamp}] Error: ${message}\nStack: ${stack || 'No stack provided'}\n\n`;

        fs.appendFileSync(logPath, entry);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to write log' }, { status: 500 });
    }
}
export async function DELETE() {
    try {
        const logPath = path.join(process.cwd(), 'genkit-error.log');
        if (fs.existsSync(logPath)) {
            fs.writeFileSync(logPath, ''); // Clear file content
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 });
    }
}
