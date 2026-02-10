'use server';
/**
 * @fileOverview Universal Chat Flow with Polyglot Code Generation
 * 
 * This flow enables the AI to generate idiomatic code in multiple languages
 * and write files DIRECTLY to disk using the saveFile tool.
 * 
 * Supported Languages: Rust, Python, Go, Node.js, TypeScript, Next.js 15
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {MessageData} from 'genkit';

const UniversalChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).describe('The chat history.'),
  projectPath: z.string().optional().describe('Optional: The absolute path to the project directory'),
  targetLanguage: z.enum(['rust', 'python', 'go', 'nodejs', 'typescript', 'nextjs']).optional().describe('Optional: The target programming language for code generation'),
});
export type UniversalChatInput = z.infer<typeof UniversalChatInputSchema>;

const UniversalChatOutputSchema = z.object({
  response: z.string().describe("The model's response message to the user."),
  files: z.array(z.object({
    path: z.string().describe("Relative path from project root (e.g., 'Cargo.toml', 'src/main.rs')"),
    content: z.string().describe("Complete file content"),
  })).optional().describe("Array of files to create"),
});
export type UniversalChatOutput = z.infer<typeof UniversalChatOutputSchema>;

export async function universalChat(input: UniversalChatInput): Promise<UniversalChatOutput> {
  return universalChatFlow(input);
}

/**
 * Builds the Polyglot System Prompt with THE ARCHITECT'S MANDATE
 */
function buildPolyglotSystemPrompt(targetLanguage?: string, projectPath?: string): string {
  const basePrompt = `You are **Rosetta**, a Principal Software Architect and expert polyglot programmer integrated into ADK Link, a developer tool for AI-assisted coding.

**Core Capabilities:**
- Expert in Rust, Python, Go, Node.js, TypeScript, and Next.js 15
- Generate idiomatic, production-ready code following language-specific conventions
- Create complete project structures with proper configuration files

**🚨 THE ARCHITECT'S MANDATE - CRITICAL INSTRUCTIONS:**

You MUST return your response as valid JSON with this exact structure:
{
  "response": "Your message to the user explaining what you created",
  "files": [
    {"path": "Cargo.toml", "content": "...full file content..."},
    {"path": "src/main.rs", "content": "...full file content..."}
  ]
}

**Language-Specific File Requirements:**

**Rust Projects:**
- \`Cargo.toml\` (with proper package config)
- \`src/main.rs\` (with idiomatic Rust code)
- \`.gitignore\` (Rust-specific ignores: /target/, **/*.rs.bk, Cargo.lock)

**Python Projects:**
- \`requirements.txt\` (dependencies)
- \`main.py\` (entry point with proper structure)
- \`.gitignore\` (Python-specific ignores: __pycache__/, venv/, *.pyc)
- \`README.md\` (setup instructions including venv)

**Go Projects:**
- \`go.mod\` (module definition)
- \`main.go\` (with proper package main and imports)
- \`.gitignore\` (Go-specific ignores)

**Node.js Projects:**
- \`package.json\` (with type: "module" and scripts)
- \`index.js\` (ES module syntax)
- \`.gitignore\` (node_modules/, etc.)

**TypeScript Projects:**
- \`package.json\` (with TypeScript deps)
- \`tsconfig.json\` (strict mode enabled)
- \`src/index.ts\` (typed entry point)
- \`.gitignore\` (node_modules/, dist/, etc.)

**Next.js 15 Projects:**
- \`package.json\` (Next.js 15 + React 19)
- \`next.config.ts\` (TypeScript config)
- \`tsconfig.json\` (Next.js-specific settings)
- \`src/app/layout.tsx\` (root layout with metadata)
- \`src/app/page.tsx\` (home page)
- \`.gitignore\` (.next/, node_modules/, etc.)

**EXECUTION PROTOCOL:**
1. ALWAYS return valid JSON
2. Include ALL necessary files in the files array
3. Use proper escaping for special characters in JSON strings
4. In your response message, provide setup instructions

**Example Response:**
{
  "response": "Created a Rust CLI weather tool with 3 files. To build: run 'cargo build'. To run: 'cargo run'.",
  "files": [
    {"path": "Cargo.toml", "content": "[package]\\nname = \\"weather-cli\\"\\n..."},
    {"path": "src/main.rs", "content": "fn main() {\\n    println!(\\"Hello\\");\\n}"},
    {"path": ".gitignore", "content": "/target/\\n"}
  ]
}

${projectPath ? `\n**PROJECT PATH:** ${projectPath}\nFiles will be created in this directory.\n` : ''}
${targetLanguage ? `\n**TARGET LANGUAGE:** ${targetLanguage}\n` : ''}
`;

  return basePrompt;
}

const universalChatFlow = ai.defineFlow(
  {
    name: 'universalChatFlow',
    inputSchema: UniversalChatInputSchema,
    outputSchema: UniversalChatOutputSchema,
  },
  async (input) => {
    const history: MessageData[] = input.history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      content: [{text: msg.content}]
    }));

    const systemPrompt = buildPolyglotSystemPrompt(input.targetLanguage, input.projectPath);

    // Genkit 1.20.0 uses messages array, not prompt+history
    const messages: MessageData[] = [
      { role: 'user', content: [{text: systemPrompt}] },
      ...history
    ];

    let output;
    try {
      console.log('[UniversalChat] Generating response...');
      const result = await ai.generate({
        messages,
        model: 'googleai/gemini-2.5-flash',
      });
      console.log('[UniversalChat] AI Result:', JSON.stringify(result, null, 2));
      output = result.output;
    } catch (error: any) {
      console.error('[UniversalChat] AI Generation Failed:', error);
      // Continue to fallback logic below (output will be undefined)
    }
    
    const responseText = output?.text || "I'm sorry, I couldn't generate a response. The model output was empty or blocked.";
    
    console.log('[UniversalChat] Response Text:', responseText);

    // Parse the AI's JSON response
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const finalResponse = {
          response: typeof parsed.response === 'string' ? parsed.response : (parsed.response ? JSON.stringify(parsed.response) : responseText),
          files: Array.isArray(parsed.files) ? parsed.files : [],
        };
        console.log('[UniversalChat] Returning JSON:', finalResponse);
        return finalResponse;
      }
    } catch (error) {
      // If JSON parsing fails, return as regular response
      console.error('Failed to parse AI JSON response:', error);
    }

    const fallbackResponse = {
      response: String(responseText.includes("couldn't generate") ? "AI Model unavailable. Generated standard template environment." : responseText),
      files: [
        {
          path: "model_env.py",
          content: `
import os

class ModelEnvironment:
    def __init__(self):
        self.safety_settings = {
            "harm_category": "BLOCK_MEDIUM_AND_ABOVE",
            "content_filter": True
        }
        self.max_tokens = 8000
    
    def validate_input(self, text):
        if not text:
            return False
        return True

    def process(self, prompt):
        if not self.validate_input(prompt):
            return "Invalid input"
        return f"Processed: {prompt}"
`
        },
        {
          path: "security_config.json",
          content: JSON.stringify({
             "block_external_data": true,
             "rate_limit": 60,
             "pii_redaction": true
          }, null, 2)
        }
      ]
    };
    console.log('[UniversalChat] Returning Fallback Template:', fallbackResponse);
    return fallbackResponse;
  }
);