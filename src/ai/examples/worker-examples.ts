import { config } from 'dotenv';
config();

import { aiWorker } from '@/ai/flows/ai-worker';

/**
 * Example: Using Gemini 2.5 Flash as an AI Worker
 * 
 * This demonstrates various tasks the AI worker can handle
 */

async function runExamples() {
  console.log('🤖 Testing Gemini 2.5 Flash AI Worker\n');
  console.log('='.repeat(60));

  // Example 1: Code Analysis
  console.log('\n📊 Example 1: Code Analysis\n');
  const analysisResult = await aiWorker({
    task: 'Analyze this React component for performance issues and suggest improvements',
    context: {
      language: 'typescript',
      framework: 'React',
      files: [{
        path: 'components/UserList.tsx',
        content: `
import React from 'react';

export function UserList({ users }) {
  return (
    <div>
      {users.map((user, index) => (
        <div key={index}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
        `
      }]
    },
    requirements: {
      outputFormat: 'mixed',
      analysisDepth: 'standard',
      createFiles: false,
    }
  });

  console.log('Status:', analysisResult.status);
  console.log('Summary:', analysisResult.summary);
  console.log('Analysis:', analysisResult.results.analysis);
  console.log('Suggestions:', analysisResult.results.suggestions);
  console.log('Model:', analysisResult.metadata.modelUsed);
  console.log('Execution time:', analysisResult.metadata.executionTime);

  // Example 2: Project Scaffolding
  console.log('\n' + '='.repeat(60));
  console.log('\n🏗️ Example 2: Generate Project Structure\n');
  const scaffoldResult = await aiWorker({
    task: 'Create a TypeScript utility library for handling dates with proper testing setup',
    context: {
      language: 'typescript',
      projectPath: './my-date-utils',
    },
    requirements: {
      outputFormat: 'json',
      createFiles: false, // Set to true to actually create files
      analysisDepth: 'standard',
    }
  });

  console.log('Status:', scaffoldResult.status);
  console.log('Summary:', scaffoldResult.summary);
  if (scaffoldResult.results.codeSnippets) {
    console.log('\nCode Snippets Generated:');
    scaffoldResult.results.codeSnippets.forEach((snippet, i) => {
      console.log(`\n  ${i + 1}. ${snippet.description} (${snippet.language})`);
    });
  }
  console.log('\nNext Steps:', scaffoldResult.nextSteps);

  // Example 3: Debugging Help
  console.log('\n' + '='.repeat(60));
  console.log('\n🐛 Example 3: Debug Error\n');
  const debugResult = await aiWorker({
    task: 'Debug this TypeScript error and suggest a fix',
    context: {
      language: 'typescript',
      files: [{
        path: 'src/api.ts',
        content: `
async function fetchUser(id: string) {
  const response = await fetch(\`/api/users/\${id}\`);
  const data = response.json(); // Error: Type 'Promise<any>' is missing properties
  return data;
}
        `
      }]
    },
    requirements: {
      outputFormat: 'mixed',
      analysisDepth: 'quick',
      createFiles: false,
    }
  });

  console.log('Status:', debugResult.status);
  console.log('Summary:', debugResult.summary);
  console.log('Analysis:', debugResult.results.analysis);
  console.log('Suggestions:', debugResult.results.suggestions);

  // Example 4: General Help
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 Example 4: Best Practices Question\n');
  const helpResult = await aiWorker({
    task: 'What are the best practices for handling authentication in a Next.js 15 application?',
    context: {
      framework: 'Next.js 15',
      language: 'typescript',
    },
    requirements: {
      outputFormat: 'markdown',
      analysisDepth: 'deep',
      createFiles: false,
    }
  });

  console.log('Status:', helpResult.status);
  console.log('Summary:', helpResult.summary);
  console.log('\nDetailed Response:\n', helpResult.results.analysis);
  console.log('\nSuggestions:', helpResult.results.suggestions);

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ All examples completed!\n');
}

// Run the examples
runExamples().catch(console.error);
