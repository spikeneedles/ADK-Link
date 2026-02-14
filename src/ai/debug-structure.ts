
import 'dotenv/config';
import { ai } from './genkit';

async function logResultStructure() {
    try {
        const result = await ai.generate({
            model: 'googleai/gemini-2.5-flash',
            prompt: 'Say hello',
        });
        console.log('Result Keys:', Object.keys(result));
        console.log('Result Text Helper:', result.text);
        console.log('Result Output:', JSON.stringify(result.output, null, 2));
    } catch (e) {
        console.error('Error:', e);
    }
}

logResultStructure();
