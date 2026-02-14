
import 'dotenv/config'; // Loads .env from CWD by default
import { universalChatFlow } from '../../src/ai/flows/universal-chat';

const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('❌ Still no API Key found in process.env');
    process.exit(1);
}

console.log(`✅ Loaded API Key: ${apiKey.substring(0, 5)}...`);

async function runDebug() {
    const testInput = {
        history: [],
        projectPath: "C:\\Users\\josht\\Downloads\\download\\.debug_out",
        techStack: ["Next.js", "Python"],
        targetLanguage: "nextjs" as const
    };

    console.log('🧪 Starting Genkit Debug Run...');
    try {
        // universalChatFlow expects input compatible with its schema
        // The input schema in universal-chat.ts is Zod.
        const result = await universalChatFlow(testInput);
        console.log('\n✅ Result:');
        console.log(JSON.stringify(result, null, 2));
    } catch (e: any) {
        console.error('\n❌ Execution Failed:');
        console.error(e);
        if (e.cause) console.error('Cause:', e.cause);
    }
}

runDebug();
