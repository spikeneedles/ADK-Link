# Gemini 2.5 Flash AI Worker & Helper

This project now uses **Google's Gemini 2.5 Flash** model as an intelligent AI worker and helper throughout the application.

## 🎯 Why Gemini 2.5 Flash?

- **Free Tier**: Completely free for development and low-volume production
- **High Performance**: 1M token context window, 65K output tokens
- **Advanced Features**: Supports thinking mode, multimodal capabilities
- **Latest Technology**: Released June 2025, most up-to-date Gemini model
- **Rate Limits**: 5-15 requests/min, 100-1,000 requests/day (free tier)

## 📁 Updated Files

### Core Configuration

- **`src/ai/genkit.ts`** - Updated to use `gemini-2.5-flash` as default model
- **`.env`** - API key configured (never commit this file!)

### Flows Using Gemini 2.5 Flash

1. **`src/ai/flows/chat.ts`** - Simple chat interactions
2. **`src/ai/flows/universal-chat.ts`** - Polyglot code generation
3. **`src/ai/flows/ai-worker.ts`** - ⭐ NEW: Enhanced AI worker
4. **`src/ai/flows/customize-model-personality.ts`** - Uses default model
5. **`src/ai/flows/generate-ai-safety-rails.ts`** - Uses default model
6. **`src/ai/flows/suggest-prompts-from-context.ts`** - Uses default model

## 🚀 New AI Worker Features

The new `ai-worker.ts` flow provides advanced capabilities:

### Capabilities

- 🧠 **Code Analysis** - Analyze code quality, performance, security
- 🔨 **File Generation** - Create complete project structures
- 🐛 **Debugging** - Identify and fix errors with suggestions
- 📚 **Best Practices** - Architecture and design guidance
- 🚀 **Optimization** - Performance improvement suggestions
- 🔧 **Multi-Language** - Rust, Python, Go, TypeScript, etc.

### Usage Example

```typescript
import { aiWorker } from "@/ai/flows/ai-worker";

const result = await aiWorker({
  task: "Analyze this React component for performance issues",
  context: {
    language: "typescript",
    framework: "React",
    files: [
      {
        path: "components/MyComponent.tsx",
        content: "...", // Your code here
      },
    ],
  },
  requirements: {
    outputFormat: "mixed",
    analysisDepth: "standard",
    createFiles: false,
  },
});

console.log(result.summary);
console.log(result.results.analysis);
console.log(result.results.suggestions);
```

## 📊 Output Schema

```typescript
{
  status: 'success' | 'partial' | 'failed',
  summary: string,
  results: {
    analysis?: string,
    suggestions?: string[],
    filesCreated?: Array<{path: string, size?: number}>,
    codeSnippets?: Array<{
      language: string,
      code: string,
      description: string
    }>
  },
  nextSteps?: string[],
  metadata: {
    modelUsed: 'gemini-2.5-flash',
    tokensEstimate?: string,
    executionTime?: string
  }
}
```

## 🧪 Running Examples

We've included comprehensive examples in `src/ai/examples/worker-examples.ts`:

```bash
# Run the examples
npx tsx src/ai/examples/worker-examples.ts
```

Examples include:

1. **Code Analysis** - Analyze React components
2. **Project Scaffolding** - Generate TypeScript library structure
3. **Debugging** - Fix TypeScript errors
4. **Best Practices** - Get expert advice on authentication

## 🛠️ Available Tools

The AI worker has access to file operation tools:

- **`saveFile`** - Write content to any file path
- **`listFiles`** - Recursively list directory contents
- **`readFile`** - Read file contents from disk

## ⚙️ Configuration

### API Key Setup

Your API key is configured in `.env`:

```bash
GOOGLE_GENAI_API_KEY=AIzaSyDxpJrwYD-egRjFVfIILnV3Hlk39V3ibuo
GEMINI_API_KEY=AIzaSyDxpJrwYD-egRjFVfIILnV3Hlk39V3ibuo
```

### Model Parameters

The AI worker uses these settings for optimal performance:

```typescript
{
  model: 'googleai/gemini-2.5-flash',
  temperature: 0.7,  // Balanced creativity
  topK: 40,
  topP: 0.95
}
```

## 📈 Free Tier Limits

Stay within these limits to avoid charges:

- **Requests**: 5-15 per minute, 100-1,000 per day
- **Context**: Full 1M tokens available
- **Resets**: Daily at midnight Pacific Time
- **Commercial Use**: ✅ Allowed (no SLA)

## 🔄 Switching Models

To use a different model, update `src/ai/genkit.ts`:

```typescript
export const ai = genkit({
  plugins: [googleAI()],
  model: "googleai/gemini-2.5-pro", // For maximum capability
  // or 'googleai/gemini-pro-latest', // Auto-updates
});
```

## 🎯 Integration Points

The AI worker can be integrated into:

- **Code Editors** - Real-time analysis and suggestions
- **CI/CD Pipelines** - Automated code review
- **Developer Tools** - Intelligent code generation
- **Chatbots** - Technical support and guidance
- **Documentation** - Auto-generate docs from code

## 📝 Best Practices

1. **Task Clarity** - Be specific in task descriptions
2. **Context Provision** - Include relevant files and info
3. **Depth Selection** - Use 'quick' for simple tasks, 'deep' for complex
4. **Error Handling** - Always check `status` field in response
5. **Rate Limiting** - Implement delays between requests if batching

## 🔐 Security Notes

- ✅ API key is in `.env` (gitignored)
- ✅ No sensitive code should be sent to external APIs in production
- ✅ Free tier has no SLA - consider paid tier for critical applications
- ✅ Review generated code before deploying

## 📚 Additional Resources

- [Google AI Documentation](https://ai.google.dev)
- [Gemini API Pricing](https://ai.google.dev/pricing)
- [Genkit Framework Docs](https://firebase.google.com/docs/genkit)
- [Model Comparison](https://ai.google.dev/models/gemini)

## 🎉 Next Steps

1. **Test the Implementation**

   ```bash
   npx tsx src/ai/examples/worker-examples.ts
   ```

2. **Start the Genkit Dev UI** (Optional)

   ```bash
   npm run genkit:dev
   ```

3. **Integrate into Your App**
   - Import `aiWorker` from `@/ai/flows/ai-worker`
   - Call with your specific tasks
   - Build amazing AI-powered features!

---

**Model**: Gemini 2.5 Flash  
**Status**: ✅ Configured and Ready  
**Free Tier**: ✅ Active  
**Last Updated**: 2026-02-09
