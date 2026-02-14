
import 'dotenv/config';
import { ai } from './genkit';

async function testSimple() {
    console.log('🧪 Testing Simple Generation...');
    try {
        const result = await ai.generate({
            model: 'googleai/gemini-2.5-flash',
            prompt: 'Say hello in JSON format: {"message": "hello"}'
        });
        console.log('\n✅ Result:');
        console.log(result.text);
    } catch (e) {
        console.error('\n❌ Simple Test Failed:');
        console.error(e);
    }
}

testSimple();
