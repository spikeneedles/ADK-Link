#!/usr/bin/env tsx
/**
 * Quick Test: Verify Gemini 2.5 Flash is working
 * 
 * Run: npx tsx quick-test.ts
 */

import { config } from 'dotenv';
config();

import { aiWorker } from './src/ai/flows/ai-worker';
import { chat } from './src/ai/flows/chat';

async function quickTest() {
  console.log('🧪 Quick Test: Gemini 2.5 Flash Integration\n');
  console.log('='.repeat(60));

  // Test 1: Simple chat
  console.log('\n✅ Test 1: Simple Chat Flow');
  console.log('-'.repeat(60));

  try {
    const chatResult = await chat({
      history: [
        { role: 'user', content: 'What model are you using?' }
      ]
    });

    console.log('Response:', chatResult.response);
    console.log('Status: ✅ PASSED\n');
  } catch (error: any) {
    console.error('Status: ❌ FAILED');
    console.error('Error:', error.message);
  }

  // Test 2: AI Worker
  console.log('\n✅ Test 2: AI Worker Flow');
  console.log('-'.repeat(60));

  try {
    const workerResult = await aiWorker({
      task: 'Write a simple "Hello World" function in TypeScript',
      context: {
        language: 'typescript'
      },
      requirements: {
        outputFormat: 'code',
        analysisDepth: 'quick',
        createFiles: false
      }
    });

    console.log('Status:', workerResult.status);
    console.log('Summary:', workerResult.summary);
    console.log('Model:', workerResult.metadata.modelUsed);
    console.log('Execution Time:', workerResult.metadata.executionTime);
    console.log('Status: ✅ PASSED\n');
  } catch (error: any) {
    console.error('Status: ❌ FAILED');
    console.error('Error:', error.message);
  }

  console.log('='.repeat(60));
  console.log('\n🎉 Tests Complete!\n');
  console.log('Next steps:');
  console.log('  1. Run examples: npx tsx src/ai/examples/worker-examples.ts');
  console.log('  2. Start Genkit UI: npm run genkit:dev');
  console.log('  3. Read the docs: AI_WORKER_README.md\n');
}

quickTest().catch(console.error);
