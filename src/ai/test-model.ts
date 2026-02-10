
import { ai } from './genkit';

const MODELS = [
  'googleai/gemini-2.5-flash',
  'googleai/gemini-1.5-flash-latest',
  'googleai/gemini-1.5-flash-001',
  'googleai/gemini-1.5-flash',
  'googleai/gemini-1.5-pro-latest',
  'googleai/gemini-pro',
];

async function main() {
  console.log('Testing models availability...');
  
  for (const model of MODELS) {
    console.log(`\n--- Testing ${model} ---`);
    try {
      const result = await ai.generate({
        prompt: 'Hello',
        model: model,
      });
      console.log(`✅ SUCCESS: ${model}`);
      console.log('Output:', result.text.slice(0, 50));
      return; // Stop on first success
    } catch (error: any) {
      console.log(`❌ FAILED: ${model}`);
      // Log only the error message, not full stack
      console.log('Error:', error.message || error);
    }
  }
}

main();
