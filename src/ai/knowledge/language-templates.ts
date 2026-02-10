/**
 * Language Templates for Polyglot Code Generation
 * Defines idiomatic project structures for Rust, Python, Go, Node.js, and Next.js
 */

export const LANGUAGE_TEMPLATES = {
  rust: {
    name: 'Rust',
    extension: '.rs',
    packageManager: 'cargo',
    structure: {
      'Cargo.toml': (projectName: string) => `[package]
name = "${projectName}"
version = "0.1.0"
edition = "2021"

[dependencies]
`,
      'src/main.rs': () => `fn main() {
    println!("Hello from Rust!");
}
`,
      '.gitignore': () => `/target/
**/*.rs.bk
Cargo.lock
`,
    },
    instructions: `
For Rust projects:
- Use \`Cargo.toml\` for dependencies and metadata
- Main entry point is \`src/main.rs\` for binaries
- Use \`src/lib.rs\` for libraries
- Follow Rust naming conventions: snake_case for functions/variables
- Use proper error handling with Result<T, E>
- Prefer ownership and borrowing over cloning
- Structure: src/, tests/, benches/, examples/
`,
  },

  python: {
    name: 'Python',
    extension: '.py',
    packageManager: 'pip',
    structure: {
      'requirements.txt': () => `# Python dependencies
# Add packages here, e.g.:
# requests>=2.28.0
`,
      'main.py': () => `def main():
    """Main entry point for the application."""
    print("Hello from Python!")


if __name__ == "__main__":
    main()
`,
      '.gitignore': () => `__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv/
*.egg-info/
dist/
build/
`,
      'README.md': (projectName: string) => `# ${projectName}

## Setup

\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
\`\`\`

## Run

\`\`\`bash
python main.py
\`\`\`
`,
    },
    instructions: `
For Python projects:
- Use \`requirements.txt\` or \`pyproject.toml\` for dependencies
- Follow PEP 8 style guide
- Use snake_case for functions/variables, PascalCase for classes
- Include docstrings for all public functions
- Use virtual environments (venv)
- Structure: src/, tests/, docs/
- Main entry point typically in main.py or __main__.py
`,
  },

  go: {
    name: 'Go',
    extension: '.go',
    packageManager: 'go mod',
    structure: {
      'go.mod': (projectName: string) => `module ${projectName}

go 1.21
`,
      'main.go': () => `package main

import "fmt"

func main() {
    fmt.Println("Hello from Go!")
}
`,
      '.gitignore': () => `# Binaries for programs and plugins
*.exe
*.exe~
*.dll
*.so
*.dylib

# Test binary, built with \`go test -c\`
*.test

# Output of the go coverage tool
*.out

# Go workspace file
go.work
`,
    },
    instructions: `
For Go projects:
- Use \`go.mod\` for module management
- Follow Go conventions: MixedCaps for exported names
- Structure: cmd/, internal/, pkg/, api/
- Main package should be in main.go or cmd/appname/main.go
- Use gofmt for formatting
- Handle errors explicitly, don't ignore them
- Use interfaces for abstraction
- Prefer composition over inheritance
`,
  },

  nodejs: {
    name: 'Node.js',
    extension: '.js',
    packageManager: 'npm',
    structure: {
      'package.json': (projectName: string) => `{
  "name": "${projectName}",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "dependencies": {}
}
`,
      'index.js': () => `console.log('Hello from Node.js!');

export function main() {
    // Your code here
}

main();
`,
      '.gitignore': () => `node_modules/
npm-debug.log
.env
dist/
.DS_Store
`,
    },
    instructions: `
For Node.js projects:
- Use \`package.json\` for dependencies and scripts
- Prefer ES modules (\`type: "module"\`) for modern projects
- Use camelCase for variables/functions, PascalCase for classes
- Structure: src/, lib/, test/
- Use async/await for asynchronous operations
- Include a .gitignore for node_modules
- Consider using TypeScript for larger projects
`,
  },

  typescript: {
    name: 'TypeScript',
    extension: '.ts',
    packageManager: 'npm',
    structure: {
      'package.json': (projectName: string) => `{
  "name": "${projectName}",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "@types/node": "^20",
    "typescript": "^5"
  }
}
`,
      'tsconfig.json': () => `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
`,
      'src/index.ts': () => `console.log('Hello from TypeScript!');

export function main(): void {
    // Your code here
}

main();
`,
      '.gitignore': () => `node_modules/
dist/
npm-debug.log
.env
.DS_Store
`,
    },
    instructions: `
For TypeScript projects:
- Use \`tsconfig.json\` for compiler configuration
- Enable strict mode for type safety
- Use type annotations for function parameters and return types
- Prefer interfaces for object shapes
- Use enums or union types instead of magic strings
- Structure: src/, dist/, tests/
- Compile before running with \`tsc\`
`,
  },

  nextjs: {
    name: 'Next.js 15',
    extension: '.tsx',
    packageManager: 'npm',
    structure: {
      'package.json': (projectName: string) => `{
  "name": "${projectName}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.5.9",
    "react": "^19.2.1",
    "react-dom": "^19.2.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5"
  }
}
`,
      'next.config.ts': () => `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
`,
      'tsconfig.json': () => `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`,
      'src/app/page.tsx': () => `export default function Home() {
  return (
    <div>
      <h1>Hello from Next.js 15!</h1>
    </div>
  );
}
`,
      'src/app/layout.tsx': () => `export const metadata = {
  title: 'Next.js App',
  description: 'Generated by ADK Link',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
      '.gitignore': () => `node_modules/
.next/
out/
.env*.local
.DS_Store
`,
    },
    instructions: `
For Next.js 15 projects:
- Use App Router (app/ directory) instead of Pages Router
- Server Components by default, use 'use client' for client components
- Use Server Actions for data mutations ('use server')
- File-system based routing in app/
- Special files: layout.tsx, page.tsx, loading.tsx, error.tsx
- Use next/image for optimized images
- Use next/link for client-side navigation
- Structure: app/, components/, lib/, public/
- Enable Turbopack for faster dev builds
`,
  },
} as const;

export type SupportedLanguage = keyof typeof LANGUAGE_TEMPLATES;

export function getLanguageTemplate(language: SupportedLanguage) {
  return LANGUAGE_TEMPLATES[language];
}

export function getSupportedLanguages(): SupportedLanguage[] {
  return Object.keys(LANGUAGE_TEMPLATES) as SupportedLanguage[];
}
