'use server';
/**
 * @fileOverview AI Worker Flow - Enhanced helper using Gemini 2.5 Flash
 * 
 * This flow uses gemini-2.5-flash as an intelligent worker that can:
 * - Analyze code and projects
 * - Generate files with best practices
 * - Debug and suggest improvements
 * - Execute multi-step tasks
 * - Work with multiple programming languages
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MessageData } from 'genkit';
import { fileTools } from '@/ai/tools/file-operations';

const AIWorkerInputSchema = z.object({
  task: z.string().describe('The task description for the AI worker to execute'),
  context: z.object({
    projectPath: z.string().optional().describe('The project directory path'),
    files: z.array(z.object({
      path: z.string(),
      content: z.string(),
    })).optional().describe('Relevant files for context'),
    language: z.string().optional().describe('Primary programming language'),
    framework: z.string().optional().describe('Framework being used (e.g., Next.js, React, etc.)'),
  }).optional(),
  requirements: z.object({
    outputFormat: z.enum(['json', 'markdown', 'code', 'mixed']).optional().default('mixed'),
    createFiles: z.boolean().optional().default(false).describe('Whether to actually create files on disk'),
    analysisDepth: z.enum(['quick', 'standard', 'deep']).optional().default('standard'),
  }).optional(),
});
export type AIWorkerInput = z.infer<typeof AIWorkerInputSchema>;

const AIWorkerOutputSchema = z.object({
  status: z.enum(['success', 'partial', 'failed']).describe('Task completion status'),
  summary: z.string().describe('Summary of what was accomplished'),
  results: z.object({
    analysis: z.string().optional().describe('Analysis or findings'),
    suggestions: z.array(z.string()).optional().describe('Recommendations or improvements'),
    filesCreated: z.array(z.object({
      path: z.string(),
      size: z.number().optional(),
    })).optional().describe('Files that were created'),
    codeSnippets: z.array(z.object({
      language: z.string(),
      code: z.string(),
      description: z.string(),
    })).optional().describe('Code examples or snippets'),
  }),
  nextSteps: z.array(z.string()).optional().describe('Suggested next actions'),
  metadata: z.object({
    modelUsed: z.string(),
    tokensEstimate: z.string().optional(),
    executionTime: z.string().optional(),
  }),
});
export type AIWorkerOutput = z.infer<typeof AIWorkerOutputSchema>;

export async function aiWorker(input: AIWorkerInput): Promise<AIWorkerOutput> {
  return aiWorkerFlow(input);
}

/**
 * Builds the AI Worker system prompt
 */
function buildWorkerSystemPrompt(input: AIWorkerInput): string {
  const { context, requirements } = input;
  
  return `You are **Gemini 2.5 Flash Worker**, an intelligent AI assistant powered by Google's latest Gemini 2.5 Flash model.

**Your Capabilities:**
- 🧠 Advanced code analysis and understanding
- 🔨 File creation and project scaffolding
- 🐛 Debugging and error resolution
- 📚 Best practices and architecture guidance
- 🚀 Performance optimization suggestions
- 🔧 Multi-language support (Rust, Python, Go, TypeScript, etc.)

**Current Task:**
${input.task}

${context ? `
**Project Context:**
- Language: ${context.language || 'Not specified'}
- Framework: ${context.framework || 'Not specified'}
- Project Path: ${context.projectPath || 'Not specified'}
${context.files ? `- Provided Files: ${context.files.length} files` : ''}
` : ''}

**Output Requirements:**
- Format: ${requirements?.outputFormat || 'mixed'}
- Create Files: ${requirements?.createFiles ? 'Yes - Actually write files to disk' : 'No - Only suggest files'}
- Analysis Depth: ${requirements?.analysisDepth || 'standard'}

**Response Format:**
Provide your response as a JSON object with the following structure:
{
  "status": "success" | "partial" | "failed",
  "summary": "Brief summary of what you accomplished",
  "results": {
    "analysis": "Your analysis (if applicable)",
    "suggestions": ["suggestion 1", "suggestion 2"],
    "filesCreated": [{"path": "file.ts", "size": 1234}],
    "codeSnippets": [{"language": "typescript", "code": "...", "description": "..."}]
  },
  "nextSteps": ["step 1", "step 2"]
}

**Guidelines:**
1. Be thorough but concise
2. Always provide actionable insights
3. Follow language-specific best practices
4. Consider security and performance
5. Explain your reasoning when making suggestions
6. If creating files, ensure they are production-ready
`;
}

const aiWorkerFlow = ai.defineFlow(
  {
    name: 'aiWorkerFlow',
    inputSchema: AIWorkerInputSchema,
    outputSchema: AIWorkerOutputSchema,
  },
  async (input) => {
    const startTime = Date.now();
    
    // Build the system prompt
    const systemPrompt = buildWorkerSystemPrompt(input);
    
    // Add context files if provided
    let contextText = '';
    if (input.context?.files) {
      contextText = '\n\n**Context Files:**\n';
      for (const file of input.context.files) {
        contextText += `\n--- ${file.path} ---\n${file.content}\n`;
      }
    }
    
    const messages: MessageData[] = [
      { role: 'user', content: [{ text: systemPrompt + contextText }] }
    ];

    try {
      console.log('[AI Worker] Starting task:', input.task);
      
      const result = await ai.generate({
        messages,
        model: 'googleai/gemini-2.5-flash',
        config: {
          temperature: 0.7, // Balanced creativity and consistency
          topK: 40,
          topP: 0.95,
        },
      });

      const responseText = result.output?.text || '';
      console.log('[AI Worker] Response received, length:', responseText.length);

      // Parse JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        const executionTime = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
        
        return {
          status: (parsed.status || 'success') as 'success' | 'partial' | 'failed',
          summary: parsed.summary || 'Task completed',
          results: {
            analysis: parsed.results?.analysis,
            suggestions: parsed.results?.suggestions || [],
            filesCreated: parsed.results?.filesCreated || [],
            codeSnippets: parsed.results?.codeSnippets || [],
          },
          nextSteps: parsed.nextSteps || [],
          metadata: {
            modelUsed: 'gemini-2.5-flash',
            tokensEstimate: `~${Math.ceil(responseText.length / 4)} tokens`,
            executionTime,
          },
        };
      }

      // Fallback if JSON parsing fails
      const executionTime = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
      return {
        status: 'success' as const,
        summary: 'Task completed but response format was non-standard',
        results: {
          analysis: responseText,
          suggestions: [],
        },
        metadata: {
          modelUsed: 'gemini-2.5-flash',
          tokensEstimate: `~${Math.ceil(responseText.length / 4)} tokens`,
          executionTime,
        },
      };

    } catch (error: any) {
      console.error('[AI Worker] Error:', error);
      
      const executionTime = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
      return {
        status: 'failed' as const,
        summary: `Task failed: ${error.message}`,
        results: {
          analysis: `Error occurred: ${error.message}`,
          suggestions: ['Check API key configuration', 'Verify network connectivity', 'Review task complexity'],
        },
        nextSteps: ['Review error message', 'Adjust task parameters', 'Try again with simpler task'],
        metadata: {
          modelUsed: 'gemini-2.5-flash',
          executionTime,
        },
      };
    }
  }
);
