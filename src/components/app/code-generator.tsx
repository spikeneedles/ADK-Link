'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Code2, FileCode2, Loader2, CheckCircle2, Zap } from 'lucide-react';
import { universalChat } from '@/ai/flows/universal-chat';
import { ALL_TEMPLATES } from '@/ai/project-templates';

const SUPPORTED_LANGUAGES = [
  { value: 'rust', label: 'Rust', icon: '🦀' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'go', label: 'Go', icon: '🐹' },
  { value: 'nodejs', label: 'Node.js', icon: '💚' },
  { value: 'typescript', label: 'TypeScript', icon: '💙' },
  {value: 'nextjs', label: 'Next.js', icon: '⚡' },
] as const;

export function CodeGeneratorComponent() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('rust');
  const [projectPath, setProjectPath] = useState<string>('');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [filesCreated, setFilesCreated] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('auto');

  // Auto-load working directory from FileNavigator
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const workingDir = localStorage.getItem('workingDirectory');
      if (workingDir) {
        setProjectPath(workingDir);
      }
    }
  }, []);

  const handleGenerate = async () => {
    if (!userPrompt.trim() || !projectPath.trim()) return;

    setIsGenerating(true);
    setResponse('');
    setFilesCreated([]);

    try {
      const result = await universalChat({
        history: [{ role: 'user', content: userPrompt }],
        projectPath: projectPath,
        targetLanguage: selectedLanguage as any,
      });

      // If AI returned files, write them to disk
      if (result.files && result.files.length > 0) {
        const createdFiles: string[] = [];
        
        for (const file of result.files) {
          try {
            const fullPath = `${projectPath}\\${file.path}`;
            const apiResponse = await fetch('/api/write-file', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'x-project-path': projectPath,
              },
              body: JSON.stringify({ path: fullPath, content: file.content }),
            });
            
            if (apiResponse.ok) {
              createdFiles.push(file.path);
            } else {
              // Handle sandbox mode or permission errors
              const errorData = await apiResponse.json();
              if (errorData.error === 'SANDBOX_MODE') {
                setResponse(`🔒 **SANDBOX MODE**\n\n${errorData.message}\n\nClick the "ADK Link" button at the top left to connect to a project.`);
                setIsGenerating(false);
                return;
              } else if (errorData.error === 'PATH_NOT_ALLOWED') {
                setResponse(`⛔ **ACCESS DENIED**\n\n${errorData.message}`);
                setIsGenerating(false);
                return;
              }
            }
          } catch (err) {
            console.error('Failed to write file:', file.path, err);
          }
        }

        setFilesCreated(createdFiles);
        setResponse(result.response);
      } else {
        setResponse(result.response);
      }
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Link - Polyglot Code Generator</CardTitle>
              <CardDescription>
                Generate complete projects with files written directly to disk
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Selector */}
          <div className="space-y-2">
            <Label htmlFor="template" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Quick Start Template
            </Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Auto-detect from prompt" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">⚡ Auto-detect from prompt</SelectItem>
                {ALL_TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
                <SelectItem value="none">🤖 Pure AI (no template)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Templates provide instant scaffolding. Link can customize them based on your prompt.
            </p>
          </div>

          {/* Language Selector */}
          <div className="space-y-2">
            <Label htmlFor="language">Target Language</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    <span className="flex items-center gap-2">
                      <span>{lang.icon}</span>
                      <span>{lang.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Project Path - REQUIRED */}
          <div className="space-y-2">
            <Label htmlFor="projectPath">
              Project Path <span className="text-destructive">*</span>
            </Label>
            <Input
              id="projectPath"
              placeholder="C:\\projects\\my-app or /home/user/my-app"
              value={projectPath}
              onChange={(e) => setProjectPath(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              <strong>Required:</strong> Absolute path where Link will create project files on disk
            </p>
            {!projectPath && (
              <p className="text-xs text-destructive">
                ⚠️ Project path is required for Link to write files to disk
              </p>
            )}
          </div>

          {/* User Prompt */}
          <div className="space-y-2">
            <Label htmlFor="prompt">What would you like to build?</Label>
            <Textarea
              id="prompt"
              placeholder="Example: Create a CLI tool that fetches weather data from an API and displays it in the terminal"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              rows={4}
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !userPrompt.trim() || !projectPath.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating & Writing Files...
              </>
            ) : (
              <>
                <FileCode2 className="mr-2 h-4 w-4" />
                Generate {selectedLanguage && SUPPORTED_LANGUAGES.find(l => l.value === selectedLanguage)?.label} Project
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Files Created */}
      {filesCreated.length > 0 && (
        <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              {filesCreated.length} Files Created Successfully
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {filesCreated.map((file, idx) => (
                <li key={idx} className="text-sm font-mono text-green-600 dark:text-green-300">
                  ✓ {file}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Response Display */}
      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Link's Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="p-4 bg-muted rounded-lg overflow-x-auto whitespace-pre-wrap">
                <code className="text-sm font-mono">{response}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
