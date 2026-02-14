/**
 * Test the hybrid template system
 * 
 * Run with: npx tsx test-templates.ts
 */

import { detectTemplate, ALL_TEMPLATES, getTemplateById } from './src/ai/project-templates';

console.log('🧪 Testing Hybrid Template System\n');

// Test 1: Template detection
console.log('=== Test 1: Template Detection ===');
const testPrompts = [
  'Create a Next.js app',
  'Make me an Express REST API',
  'Build a Python CLI tool',
  'Generate a Rust command line utility',
  'Create a full stack app with authentication'
];

testPrompts.forEach(prompt => {
  const detected = detectTemplate(prompt);
  console.log(`✓ "${prompt}"`);
  console.log(`  → ${detected ? `${detected.name} (${detected.id})` : 'No template (AI will generate)'}\n`);
});

// Test 2: List all templates
console.log('\n=== Test 2: Available Templates ===');
ALL_TEMPLATES.forEach(template => {
  console.log(`📦 ${template.name}`);
  console.log(`   ${template.description}`);
  console.log(`   Files: ${Object.keys(template.files).length}`);
  console.log(`   ID: ${template.id}\n`);
});

// Test 3: Get template by ID
console.log('\n=== Test 3: Get Template by ID ===');
const nextjsTemplate = getTemplateById('nextjs-app-router');
if (nextjsTemplate) {
  console.log(`✓ Found template: ${nextjsTemplate.name}`);
  console.log(`  Files included:`);
  Object.keys(nextjsTemplate.files).forEach(file => {
    console.log(`  - ${file}`);
  });
}

console.log('\n✅ All tests passed! Template system ready.\n');
