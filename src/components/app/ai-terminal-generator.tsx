'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TerminalSquare, Loader2, CheckCircle2, Play, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProject } from '@/contexts/project-context';

const TERMINAL_TYPES = [
  { value: 'vibe', label: 'Vibe Code (Interactive REPL)', description: 'A flexible environment to experiment and code with AI assistance.' },
  { value: 'standalone', label: 'Production Ready (CLI App)', description: 'A complete, standalone CLI chat application ready to deploy.' },
];

const MODEL_PROVIDERS = [
  { value: 'google', label: 'Google GenAI (Gemini)', package: '@genkit-ai/google-genai' },
  { value: 'ollama', label: 'Local LLM (Ollama)', package: 'genkitx-ollama' },
  { value: 'openai', label: 'OpenAI Compatible', package: 'genkitx-openai' },
];

export function AIChatTerminalGenerator() {
  const [terminalType, setTerminalType] = useState<string>('vibe');
  const [provider, setProvider] = useState<string>('google');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);
  const { toast } = useToast();
  const { projectPath, isConnected } = useProject();

  const getTemplateCode = (type: string, provider: string) => {
    // ... (template code logic remains same, but omitted for brevity in this replace block if not changing)
    // Actually, I need to include the full template code function unless I use multi_replace.
    // Let's use multi_replace for cleaner diffs or just include it all.
    // Since I'm replacing the whole component body basically, I'll include it.
    
    // Wait, the user asked to remove the INPUT field.
    // So I will just rewrite the render part and the state initialization.
    
    const providerConfig = MODEL_PROVIDERS.find(p => p.value === provider);
    const imports = `/**
 * ADK AI Terminal - ${type === 'vibe' ? 'Vibe Code Mode' : 'Production Mode'}
 * 
 * SETUP:
 * 1. Install dependencies:
 *    npm install genkit ${providerConfig?.package}
 * 
 * 2. Set Environment Variables (create a .env file or set in terminal):
 *    ${provider === 'openai' ? 'export OPENAI_API_KEY=your_key' : provider === 'google' ? 'export GOOGLE_GENAI_API_KEY=your_key' : '# No API key needed for Ollama (ensure Ollama is running)'}
 * 
 * RUN:
 *    npx tsx ${type === 'vibe' ? 'vibe-terminal.ts' : 'ai-cli.ts'}
 */

import { genkit } from 'genkit';
import { ${provider === 'google' ? 'googleAI, gemini15Flash' : provider === 'ollama' ? 'ollama' : 'openai'} } from '${providerConfig?.package}';
import * as readline from 'readline';`;

    const plugins = provider === 'google' 
      ? `plugins: [googleAI()], model: gemini15Flash`
      : provider === 'ollama'
      ? `plugins: [ollama({ models: [{ name: 'llama3', type: 'chat' }] })], model: 'ollama/llama3'`
      : `plugins: [openai({ apiKey: process.env.OPENAI_API_KEY })], model: 'openai/gpt-4o'`;

    if (type === 'vibe') {
      return `${imports}

const ai = genkit({
  ${plugins}
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.clear();
console.log("\\x1b[36m%s\\x1b[0m", "🌊 Vibe Code Terminal v1.0");
console.log("Type your code or question. The AI will assist you.");
console.log("---------------------------------------------------");

async function chat() {
  rl.question('\\x1b[33m> \\x1b[0m', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    try {
      const result = await ai.generate({
        prompt: \`You are a helpful coding assistant in a REPL environment. 
User Input: \${input}
Provide a concise, helpful response or code snippet.\`
      });
      
      console.log("\\n\\x1b[32mAI:\\x1b[0m", result.text);
    } catch (error) {
      console.error("\\x1b[31mError:\\x1b[0m", error);
    }
    
    chat();
  });
}

chat();
`;
    } else {
      return `${imports}

const ai = genkit({
  ${plugins}
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.clear();
console.log("\\x1b[35m%s\\x1b[0m", "🚀 ADK AI Terminal - Production Ready");
console.log("---------------------------------------");

const history: any[] = [];

async function chat() {
  rl.question('\\x1b[36mUser: \\x1b[0m', async (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log("Goodbye!");
      rl.close();
      return;
    }

    history.push({ role: 'user', content: [{ text: input }] });

    try {
      // Show loading indicator
      process.stdout.write("\\x1b[90mThinking...\\x1b[0m");
      
      const result = await ai.generate({
        prompt: input,
        history: history,
      });

      // Clear loading line
      readline.cursorTo(process.stdout, 0);
      readline.clearLine(process.stdout, 0);

      const responseText = result.text;
      console.log("\\x1b[32mAI:\\x1b[0m", responseText);
      console.log("-".repeat(20));

      history.push({ role: 'model', content: [{ text: responseText }] });
    } catch (error) {
        readline.cursorTo(process.stdout, 0);
        readline.clearLine(process.stdout, 0);
      console.error("\\x1b[31mError generating response (check your API keys or model connections):\\x1b[0m", error);
    }
    
    chat();
  });
}

chat();
`;
    }
  };

  const handleGenerate = async () => {
    if (!isConnected || !projectPath) {
      toast({
        title: "No Project Connected",
        description: "Please connect to a project using the ADK Link button (top left).",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedFiles([]);

    try {
      const filename = terminalType === 'vibe' ? 'vibe-terminal.ts' : 'ai-cli.ts';
      const content = getTemplateCode(terminalType, provider);
      
      // Path is directly effectively project root
      const fullPath = `${projectPath}\\${filename}`;

      // Call API to write file
      const response = await fetch('/api/write-file', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-project-path': projectPath
        },
        body: JSON.stringify({ path: fullPath, content })
      });

      if (!response.ok) {
        throw new Error('Failed to write file');
      }

      setGeneratedFiles([filename]);
      
      toast({
        title: "Terminal Generated!",
        description: `Created ${filename} in ${projectPath}`,
      });

      // Launch it automatically
      const packageToInstall = MODEL_PROVIDERS.find(p => p.value === provider)?.package;
      // We assume user has npm/npx
      // Construct a command that installs deps (if missed) and runs the file
      // We use 'call' to ensure npm commands don't terminate the excessive batch context immediately
      const launchCommand = `cmd /k "echo Installing dependencies... && npm install genkit ${packageToInstall} tsx && cls && npx tsx ${filename}"`;
      
      try {
        await fetch('/api/run-command', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-project-path': projectPath
            },
            body: JSON.stringify({ 
                command: launchCommand, 
                cwd: projectPath 
            })
        });
        toast({
            title: "Launching Terminal...",
            description: "A new window should appear shortly.",
        });
      } catch (err) {
          console.error("Failed to auto-launch", err);
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "Generation Failed",
        description: "Could not create the terminal file.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isConnected) {
     return (
        <Card className="border-l-4 border-l-muted">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                        <TerminalSquare className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-muted-foreground">AI Terminal Generator</CardTitle>
                        <CardDescription>
                            Connect to a project to use this tool.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
        </Card>
     );
  }

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TerminalSquare className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>AI Terminal Generator</CardTitle>
            <CardDescription>
              Create standalone AI chat interfaces for your project.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Terminal Type</Label>
              <Select value={terminalType} onValueChange={setTerminalType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TERMINAL_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {TERMINAL_TYPES.find(t => t.value === terminalType)?.description}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Model Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODEL_PROVIDERS.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col justify-end space-y-4">
             <div className="p-3 bg-muted/50 rounded-lg border border-border text-xs font-mono text-muted-foreground break-all">
                <span className="font-semibold text-primary">Target:</span> {projectPath}
            </div>
            
            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              Generate & Launch Terminal
            </Button>
          </div>
        </div>

        {generatedFiles.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-semibold flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Generated Successfully
            </h4>
            <div className="font-mono text-sm space-y-1">
              {generatedFiles.map(f => (
                <div key={f} className="text-muted-foreground">{f}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
