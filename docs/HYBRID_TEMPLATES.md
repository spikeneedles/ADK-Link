# Hybrid Template + AI Code Generation System

## Overview
ADK Link now uses a hybrid approach for code generation:
- **Pre-made templates** for common project scaffolds (fast, instant)
- **AI customization** to adapt templates to specific needs
- **Pure AI generation** for unique requirements

## How It Works

### 1. Template Detection
When a user requests code generation, Link automatically detects if the request matches a pre-made template:

```typescript
// Example prompts that trigger templates:
"Create a Next.js app" → nextjs-app-router template
"Make an Express API" → express-api template  
"Build a Python CLI" → python-cli template
"Rust command line tool" → rust-cli template
```

### 2. Smart Scaffolding
- **Simple requests**: Template files are returned instantly (no AI call needed)
  - "Create a Next.js app" → Full Next.js 15 scaffold in <1 second
  
- **Custom requests**: Template is used as starting point, AI customizes it
  - "Create a Next.js app with authentication" → Template + AI adds auth

- **Unique requests**: Pure AI generation when no template matches
  - "Create a blockchain voting system" → 100% AI-generated

### 3. File Writing
All generated files are written to disk via the `/api/write-file` endpoint with proper security checks.

## Available Templates

### 1. Next.js 15 App Router (`nextjs-app-router`)
**Includes:**
- package.json with Next.js 15 + React 19
- TypeScript configuration
- Tailwind CSS setup
- App router structure (src/app/)
- Basic layout and home page

**Triggers:** "nextjs", "next.js", "next app"

### 2. Express REST API (`express-api`)
**Includes:**
- Express + TypeScript setup
- Basic CRUD structure
- CORS configured
- Health check endpoint

**Triggers:** "express" + "api", "rest api", "api server"

### 3. Python CLI Tool (`python-cli`)
**Includes:**
- main.py with argparse
- requirements.txt
- Virtual environment setup instructions

**Triggers:** "python" + "cli", "command line", "tool"

### 4. Rust CLI Tool (`rust-cli`)
**Includes:**
- Cargo.toml with clap dependency
- main.rs with argument parsing
- Proper Rust project structure

**Triggers:** "rust" + "cli", "command line", "tool"

## Architecture

### Core Files

#### `src/ai/project-templates.ts`
Central registry containing all template definitions. Each template includes:
- Metadata (id, name, description)
- Complete file contents as strings
- Detection logic

#### `src/ai/flows/universal-chat.ts`
Updated flow that:
1. Detects matching template from user prompt
2. Decides: use template as-is, customize with AI, or generate from scratch
3. Returns file structure ready for writing

#### `src/components/app/code-generator.tsx`
UI component with:
- Template selector dropdown
- Language selector
- Project path input
- Prompt textarea
- File writing logic

## Usage Examples

### Example 1: Simple Scaffold
```typescript
User: "Create a Next.js app"
Link: Detects nextjs-app-router template
Result: 10 files created instantly (no AI call)
Files: package.json, tsconfig.json, src/app/layout.tsx, etc.
```

### Example 2: Custom Features
```typescript
User: "Create a Next.js app with dark mode and authentication"
Link: Uses nextjs-app-router as base
       AI adds: dark mode toggle, auth pages, middleware
Result: Template files + custom additions
```

### Example 3: Pure AI
```typescript
User: "Create a distributed task queue system in Go"
Link: No template matches
Result: 100% AI-generated architecture
```

## Benefits

### Speed
- **Template-based**: <1 second for common scaffolds
- **Hybrid**: 2-5 seconds (template + AI customization)
- **Pure AI**: 5-10 seconds (full generation)

### Quality
- Templates are battle-tested, production-ready
- AI customization adds flexibility
- Best of both worlds

### Consistency
- All Next.js projects start with same solid foundation
- Custom features are added on top
- Less chance of AI making configuration mistakes

## Future Enhancements

### More Templates
- React Native mobile app
- Electron desktop app  
- FastAPI Python backend
- Svelte/SvelteKit app
- Vue.js app
- Django project

### Template Variants
- Next.js + Tailwind + shadcn/ui
- Next.js + Chakra UI
- Express + MongoDB
- Express + PostgreSQL

### AI Template Learning
- Learn from user customizations
- Suggest template improvements
- Auto-generate new templates from successful projects

## Testing

Run the template system test:
```bash
npx tsx test-templates.ts
```

This will:
- Test template detection logic
- List all available templates
- Show template contents
- Verify system is working

## Contributing Templates

To add a new template:

1. Add template definition to `src/ai/project-templates.ts`:
```typescript
export const MY_TEMPLATE = {
  id: 'my-template-id',
  name: 'My Template Name',
  description: 'What it does',
  files: {
    'package.json': `...`,
    'src/index.ts': `...`,
    // ... more files
  }
};
```

2. Add to ALL_TEMPLATES array:
```typescript
export const ALL_TEMPLATES = [
  // ... existing
  MY_TEMPLATE,
];
```

3. Add detection logic to `detectTemplate()`:
```typescript
if (lower.includes('my-framework')) {
  return MY_TEMPLATE;
}
```

4. Test it!

---

**Status**: ✅ Fully Implemented  
**Created**: 2026-02-14  
**AI Assistant**: Link (formerly Rosetta)
