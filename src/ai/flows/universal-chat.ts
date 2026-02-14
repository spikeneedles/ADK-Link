'use server';
/**
 * @fileOverview Universal Chat Flow with Hybrid Template + AI Code Generation
 * 
 * This flow uses a hybrid approach:
 * 1. Detects if user request matches a pre-made template
 * 2. Uses template as starting point for fast scaffolding
 * 3. AI customizes the template based on specific requirements
 * 
 * Supported Languages: Rust, Python, Go, Node.js, TypeScript, Next.js 15
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {MessageData} from 'genkit';
import {detectTemplate, type Template} from '@/ai/project-templates';

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
 * Builds the Polyglot System Prompt with Template Integration
 */
function buildPolyglotSystemPrompt(
  targetLanguage?: string, 
  projectPath?: string,
  template?: Template
): string {
  const templateContext = template ? `

**🎯 TEMPLATE DETECTED: ${template.name}**

I've loaded a pre-made template for you as a starting point. Here are the template files:

${Object.keys(template.files).map(path => `- ${path}`).join('\n')}

Your job is to:
1. Use these template files as a base
2. Customize them based on the user's specific requirements
3. Add any additional files they requested
4. Modify the template files if needed

The template files are already in memory. You can return them as-is, or modify them.
` : '';

  const basePrompt = `You are **Link**, a Principal Software Architect and expert polyglot programmer integrated into ADK Link, a developer tool for AI-assisted coding.

**Core Capabilities:**
- Expert in Rust, Python, Go, Node.js, TypeScript, and Next.js 15
- Generate idiomatic, production-ready code following language-specific conventions
- Create complete project structures with proper configuration files
- Use pre-made templates as starting points for faster scaffolding

${templateContext}

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
    // 1. Detect if we have a matching template
    const userPrompt = input.history[input.history.length - 1]?.content || '';
    const detectedTemplate = detectTemplate(userPrompt);
    
    console.log('[UniversalChat] Detected template:', detectedTemplate?.name || 'None');

    // 2. If template found, use it as the base
    if (detectedTemplate) {
      console.log('[UniversalChat] Using template:', detectedTemplate.id);
      console.log('[UniversalChat] Template files:', Object.keys(detectedTemplate.files));
      
      // Check if user just wants the basic template without modifications
      const isSimpleScaffold = userPrompt.toLowerCase().match(/^(create|generate|make|new|setup)\s+(a\s+)?(\w+\s+)?(nextjs|express|python|rust)\s+(app|project|cli|api|tool)(\s+project)?$/i);
      
      if (isSimpleScaffold) {
        // Return template as-is for simple scaffolding requests
        console.log('[UniversalChat] Simple scaffold detected, returning template as-is');
        const files = Object.entries(detectedTemplate.files).map(([path, content]) => ({
          path,
          content
        }));
        
        return {
          response: `Created a ${detectedTemplate.name} project with ${files.length} files. ${detectedTemplate.description}. Run 'npm install' (for Node/TypeScript projects) or follow the README for setup instructions.`,
          files
        };
      }
    }

    const history: MessageData[] = input.history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      content: [{text: msg.content}]
    }));

    const systemPrompt = buildPolyglotSystemPrompt(input.targetLanguage, input.projectPath, detectedTemplate);

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