
import 'dotenv/config'; // Load .env
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Start Genkit with user env
const ai = genkit({
  plugins: [googleAI()],
});

const CANDIDATES = [
  'googleai/gemini-1.5-flash',
  'googleai/gemini-1.5-flash-latest',
  'googleai/gemini-1.5-flash-001',
  'googleai/gemini-1.5-pro',
  'googleai/gemini-1.5-pro-latest',
  'googleai/gemini-1.0-pro',
  'googleai/gemini-pro',
  'googleai/text-bison-001',
];

async function main() {
  console.log('--- MODEL DISCOVERY ---');
  for (const model of CANDIDATES) {
    process.stdout.write(`Testing ${model}... `);
    try {
      const result = await ai.generate({
        prompt: 'hi',
        model: model,
        config: { maxOutputTokens: 10 }
      });
      console.log(`✅ SUCCESS! Output: ${result.text.slice(0, 20)}`);
      // Found a working one!
      // We could stop, but let's see which ones work.
    } catch (e: any) {
      const msg = e.message || String(e);
      if (msg.includes('404') || msg.includes('not found')) {
        console.log('❌ 404 Not Found');
      } else if (msg.includes('400') || msg.includes('API key')) {
        console.log('❌ 400 Bad Key/Request');
      } else {
        console.log(`❌ Error: ${msg.slice(0, 50)}...`);
      }
    }
  }
}

main();
