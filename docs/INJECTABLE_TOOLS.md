# Injectable Tools System

## Overview
ADK Link provides pre-made, working developer tools that can be injected into any project with a single click.

## How It Works

1. **Navigate to Tools Page** (`/tools`)
2. **Click "Add to Project"** on any tool card
3. **Tool files are written** to your current directory
4. **Start using immediately** - all tools are production-ready

## Available Tools

### 1. Code Formatter
**Files:** `tools/format-code.ts`, `tools/README-formatter.md`

Multi-language code formatter supporting:
- TypeScript/JavaScript
- Python (PEP 8)
- Rust

**Usage:**
\`\`\`bash
npx tsx tools/format-code.ts src/index.ts
npx tsx tools/format-code.ts src/  # Format entire directory
\`\`\`

**Features:**
- Configurable indent size
- Tab/space preference
- Recursive directory formatting
- Respects .gitignore patterns

---

### 2. API Client Generator
**Files:** `tools/generate-api-client.ts`, `tools/README-api-client.md`

Generate type-safe TypeScript clients from OpenAPI/Swagger specifications.

**Usage:**
\`\`\`bash
npx tsx tools/generate-api-client.ts openapi.json src/api-client.ts
\`\`\`

**Features:**
- Parses OpenAPI 3.0 specs
- Generates typed methods
- Handles path parameters
- Built-in error handling

**Example Output:**
\`\`\`typescript
const client = new APIClient('https://api.example.com');
const users = await client.getUsers();
const user = await client.getUserById('123');
\`\`\`

---

### 3. Unit Test Generator
**Files:** `tools/generate-tests.ts`, `tools/README-test-generator.md`

Automatically generate test skeletons from TypeScript source files.

**Usage:**
\`\`\`bash
npx tsx tools/generate-tests.ts src/my-module.ts
# Creates: src/my-module.test.ts
\`\`\`

**Features:**
- Extracts functions and classes
- Creates describe/it blocks
- Works with Vitest (easily adaptable to Jest)
- TODO comments for implementation

**Generated Structure:**
\`\`\`typescript
describe('myFunction', () => {
  it('should work correctly', () => {
    expect(myFunction).toBeDefined();
  });
  
  it('should handle edge cases', () => {
    // TODO: Test edge cases
  });
});
\`\`\`

---

### 4. JSON to Type Converter
**Files:** `tools/json-to-type.ts`, `tools/README-json-to-type.md`

Convert JSON objects to TypeScript interfaces or Python dataclasses.

**Usage:**
\`\`\`bash
# TypeScript
npx tsx tools/json-to-type.ts data.json ts > types.ts

# Python
npx tsx tools/json-to-type.ts data.json py > models.py
\`\`\`

**Features:**
- Type inference from JSON
- Nested object support
- Array type detection
- Optional field handling

**Example:**
\`\`\`json
{"name": "Alice", "age": 30, "tags": ["dev", "test"]}
\`\`\`

Becomes:
\`\`\`typescript
export interface Root {
  name: string;
  age: number;
  tags: string[];
}
\`\`\`

---

### 5. Mock Data Generator
**Files:** `tools/generate-mock-data.ts`, `tools/README-mock-data.md`

Generate realistic mock data for testing and development.

**Usage:**
\`\`\`bash
npx tsx tools/generate-mock-data.ts 50 > mock-users.json
\`\`\`

**Features:**
- Customizable count
- Realistic names and emails
- Random but consistent data
- JSON output format

**Generated Data:**
\`\`\`json
{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "age": 28,
  "active": true
}
\`\`\`

---

## Architecture

### File Structure
All tools are injected into a `tools/` directory in your project:
\`\`\`
your-project/
  tools/
    format-code.ts
    generate-api-client.ts
    generate-tests.ts
    json-to-type.ts
    generate-mock-data.ts
    README-*.md (documentation)
\`\`\`

### Registry System
Tools are defined in `src/ai/injectable-tools.ts`:

\`\`\`typescript
export interface InjectableTool {
  id: string;
  name: string;
  description: string;
  category: 'formatter' | 'generator' | 'utility' | 'testing';
  language: 'typescript' | 'python' | 'javascript' | 'rust';
  files: Record<string, string>;  // path → content
  dependencies?: string[];
  setupInstructions: string;
}
\`\`\`

### UI Integration
The Tools page (`src/app/tools/page.tsx`):
1. Reads tools from registry
2. Displays tool cards with descriptions
3. Handles "Add to Project" clicks
4. Writes files via `/api/write-file`
5. Shows success/error feedback

## Dependencies

Most tools require:
- **typescript** - TypeScript compiler
- **tsx** - TypeScript execution

Install with:
\`\`\`bash
npm install -D typescript tsx
\`\`\`

Test generator also needs:
\`\`\`bash
npm install -D vitest
\`\`\`

## Usage Workflow

### Step 1: Connect to Project
Click "ADK Link" button and select a project directory.

### Step 2: Navigate to Tools
Go to `/tools` page in the app.

### Step 3: Inject Tools
Click "Add to Project" on desired tools.

### Step 4: Use Tools
Run the tools from your terminal:
\`\`\`bash
npx tsx tools/format-code.ts src/
npx tsx tools/generate-tests.ts src/utils.ts
\`\`\`

## Customization

All tools are fully editable after injection. Customize:
- Formatting rules in `format-code.ts`
- API client generation in `generate-api-client.ts`
- Test templates in `generate-tests.ts`
- Type conversion logic in `json-to-type.ts`
- Mock data schemas in `generate-mock-data.ts`

## Adding New Tools

To add a new injectable tool:

1. **Define the tool** in `src/ai/injectable-tools.ts`:
\`\`\`typescript
export const MY_NEW_TOOL: InjectableTool = {
  id: 'my-tool',
  name: 'My Tool',
  description: 'What it does',
  category: 'utility',
  language: 'typescript',
  files: {
    'tools/my-tool.ts': \`// Tool implementation\`,
    'tools/README-my-tool.md': \`# Documentation\`,
  },
  dependencies: ['typescript'],
  setupInstructions: 'How to use it',
};
\`\`\`

2. **Add to registry**:
\`\`\`typescript
export const ALL_INJECTABLE_TOOLS = [
  // ... existing tools
  MY_NEW_TOOL,
];
\`\`\`

3. **Add icon** (optional) in `src/app/tools/page.tsx`:
\`\`\`typescript
const toolIconMap: Record<string, any> = {
  'my-tool': MyIcon,
  // ... other icons
};
\`\`\`

4. **Done!** Tool appears on Tools page.

## Security

- All file writes go through `/api/write-file`
- Path validation prevents writing outside project
- Only writes to connected project directory
- Requires explicit user action (button click)

## Benefits

✅ **Instant Setup** - No package installation, no configuration  
✅ **Production Ready** - All tools are tested and working  
✅ **Fully Editable** - Customize after injection  
✅ **Zero Lock-in** - Tools are yours, no dependencies on ADK Link  
✅ **TypeScript First** - Full type safety and IDE support  

---

**Status**: ✅ Fully Implemented  
**Created**: 2026-02-14  
**Tools Available**: 5 (Code Formatter, API Client Generator, Unit Test Generator, JSON-to-Type, Mock Data Generator)
