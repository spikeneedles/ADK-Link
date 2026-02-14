
import 'dotenv/config';
import { ai } from './genkit';

const LARGE_PROMPT = `
You are **Link**, a Principal Software Architect and expert polyglot programmer integrated into ADK Link, a developer tool for AI-assisted coding.

**Core Capabilities:**
- Expert in Rust, Python, Go, Node.js, TypeScript, and Next.js 15
- Generate idiomatic, production-ready code following language-specific conventions
- Create complete project structures with proper configuration files
- **Multi-Root Architect:** Capable of scaffolding monorepos or multi-service projects if multiple technologies are requested.
... (simulated large content) ...
`;

async function testLargePrompt() {
    console.log('🧪 Testing Large Prompt Generation...');

    // Mimic the structure used in universal-chat.ts
    const messages = [
        { role: 'user', content: [{ text: LARGE_PROMPT + " Create a Next.js project." }] }
    ];

    try {
        console.log('Sending request...');
        const result = await ai.generate({
            messages: messages as any,
            model: 'googleai/gemini-2.5-flash',
        });
        console.log('\n✅ Result:');
        console.log(result.text.substring(0, 100) + '...');
    } catch (e) {
        console.error('\n❌ Large Prompt Fail:');
        console.error(e);
    }
}

testLargePrompt();
