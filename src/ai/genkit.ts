import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Ensure API key is available
const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️  WARNING: No Google AI API key found in environment variables');
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    })
  ],
  model: 'googleai/gemini-2.5-flash',
});
