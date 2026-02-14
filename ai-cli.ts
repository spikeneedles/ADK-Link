/**
 * ADK AI Terminal - Production Mode
 * 
 * SETUP:
 * 1. Install dependencies:
 *    npm install genkit @genkit-ai/google-genai
 * 
 * 2. Set Environment Variables (create a .env file or set in terminal):
 *    export GOOGLE_GENAI_API_KEY=your_key
 * 
 * RUN:
 *    npx tsx ai-cli.ts
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import * as readline from 'readline';

const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash'
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.clear();
console.log("\x1b[35m%s\x1b[0m", "🚀 ADK AI Terminal - Production Ready");
console.log("---------------------------------------");

const history: any[] = [];

async function chat() {
  rl.question('\x1b[36mUser: \x1b[0m', async (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log("Goodbye!");
      rl.close();
      return;
    }

    // Prepare messages history
    const currentMessages = [...history, { role: 'user', content: [{ text: input }] }];

    try {
      // Show loading indicator
      process.stdout.write("\x1b[90mThinking...\x1b[0m");

      const result = await ai.generate({
        messages: currentMessages,
        model: 'googleai/gemini-2.5-flash',
      });

      // Clear loading line
      if (process.stdout.isTTY) {
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 0);
      } else {
        console.log('\n');
      }

      const responseText = result.text;
      console.log("\x1b[32mAI:\x1b[0m", responseText);
      console.log("-".repeat(20));

      history.push({ role: 'user', content: [{ text: input }] });
      history.push({ role: 'model', content: [{ text: responseText }] });
    } catch (error) {
      readline.cursorTo(process.stdout, 0);
      readline.clearLine(process.stdout, 0);
      console.error("\x1b[31mError generating response (check your API keys or model connections):\x1b[0m", error);
    }

    chat();
  });
}

chat();
