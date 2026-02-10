
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const API_KEY = 'AIzaSyAI0eIDS8uLWE-BVP89Ad7A_envv80XpGU';
process.env.GOOGLE_GENAI_API_KEY = API_KEY;

const ai = genkit({
  plugins: [googleAI({ apiKey: API_KEY })], 
  model: 'googleai/gemini-pro',
});

const MODELS = [
  'googleai/gemini-pro',
  'googleai/gemini-1.0-pro',
  'googleai/gemini-1.5-pro-latest',
  'googleai/gemini-1.5-flash',
];

async function main() {
  console.log('--- DIAGNOSTIC START ---');
  
  for (const model of MODELS) {
    console.log(`\nTesting: ${model}`);
    try {
      const result = await ai.generate({
        prompt: 'test',
        model: model,
      });
      console.log(`✅ SUCCESS: ${model}`);
      console.log(`Response: ${result.text.slice(0, 20)}`);
      return; 
    } catch (error: any) {
      console.log(`❌ FAIL: ${error.message || error}`);
    }
  }
}

main();
