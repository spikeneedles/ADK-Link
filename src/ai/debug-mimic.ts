
import 'dotenv/config';
import { ai } from './genkit';

async function testMimic() {
    console.log('🧪 Testing Mimicked Generation...');

    const systemPrompt = "You are a helpful assistant. Please output JSON: { \"status\": \"ok\" }";

    // Mimic the structure used in universal-chat.ts
    const messages = [
        { role: 'user', content: [{ text: systemPrompt }] }
    ];

    try {
        console.log('Sending request...');
        const result = await ai.generate({
            messages: messages as any, // Bypass TS check for quick test
            model: 'googleai/gemini-2.5-flash',
        });
        console.log('\n✅ Result:');
        console.log(result.text);
    } catch (e) {
        console.error('\n❌ Mimic Test Failed:');
        console.error(e);
    }
}

testMimic();
