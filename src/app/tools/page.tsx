'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GanttChartSquare, Cpu, Database, FileJson, FileCog, CheckCircle2, Loader2 } from 'lucide-react';
import { CodeGeneratorComponent } from '@/components/app/code-generator';
import { ProjectScaffolding } from '@/components/app/project-scaffolding';
import { ALL_INJECTABLE_TOOLS } from '@/ai/injectable-tools';

import { FrameworkSDKs } from '@/components/app/framework-sdks';

const toolIconMap: Record<string, any> = {
  'code-formatter': Cpu,
  'api-client-generator': FileJson,
  'unit-test-generator': Cpu,
  'json-to-type': FileJson,
  'mock-data-generator': Database,
  'docker-config': FileCog,
  'git-hooks': FileCog,
  'env-generator': FileCog,
  'eslint-config': Cpu,
  'github-actions-ci': GanttChartSquare,
  'zod-schemas': FileJson,
  'error-handler': FileCog,
};

export default function ToolsPage() {
  const [implementingTool, setImplementingTool] = useState<string | null>(null);
  const [implementedTools, setImplementedTools] = useState<Set<string>>(new Set());

  const handleImplementTool = async (toolId: string) => {
    setImplementingTool(toolId);

    try {
      // Get current project path and directory from localStorage
      const projectPath = localStorage.getItem('connectedProjectPath');
      const currentDir = localStorage.getItem('workingDirectory');

      if (!projectPath) {
        alert('Please connect to a project first using the ADK Link button.');
        setImplementingTool(null);
        return;
      }

      const tool = ALL_INJECTABLE_TOOLS.find(t => t.id === toolId);
      if (!tool) {
        alert('Tool not found');
        setImplementingTool(null);
        return;
      }

      // Write all tool files to the current directory
      const targetDir = currentDir || projectPath;
      
      for (const [filePath, content] of Object.entries(tool.files)) {
        const fullPath = `${targetDir}\\${filePath}`;
        
        const response = await fetch('/api/write-file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-project-path': projectPath,
          },
          body: JSON.stringify({
            path: fullPath,
            content,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          alert(`Failed to write file: ${error.message || 'Unknown error'}`);
          setImplementingTool(null);
          return;
        }
      }

      // Mark as implemented
      setImplementedTools(prev => new Set(prev).add(toolId));
      alert(`✓ ${tool.name} implemented successfully in ${targetDir}`);
    } catch (error) {
      console.error('Error implementing tool:', error);
      alert('Failed to implement tool. Check console for details.');
    } finally {
      setImplementingTool(null);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <Card className="mb-8 border-0 shadow-none">
        <CardHeader className="p-0">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <GanttChartSquare className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">Tools</CardTitle>
              <CardDescription className="mt-2 max-w-2xl">
                Powerful utilities powered by Link, the polyglot AI architect.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Link - Polyglot Code Generator */}
      <CodeGeneratorComponent />

      {/* Project Scaffolding - Shows when no project root detected */}
      <ProjectScaffolding />

      {/* Framework SDKs - Download development kits */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-2">Framework SDKs & Development Kits</h2>
        <p className="text-muted-foreground mb-6">
          Download the required SDKs and tools to run your generated projects
        </p>
        <FrameworkSDKs />
      </div>

      {/* Injectable Tools */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Injectable Tools</h2>
        <p className="text-muted-foreground mb-6">
          Click "Add to Project" to inject working tools into your current directory
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_INJECTABLE_TOOLS.map((tool) => {
            const Icon = toolIconMap[tool.id] || FileCog;
            const isImplementing = implementingTool === tool.id;
            const isImplemented = implementedTools.has(tool.id);

            return (
              <Card key={tool.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                    <CardTitle>{tool.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2 mb-4">
                    <p className="text-muted-foreground">{tool.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono bg-muted px-2 py-1 rounded">{tool.language}</span>
                      <span>•</span>
                      <span>{Object.keys(tool.files).length} files</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleImplementTool(tool.id)}
                    disabled={isImplementing}
                    variant={isImplemented ? 'outline' : 'default'}
                  >
                    {isImplementing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : isImplemented ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Added
                      </>
                    ) : (
                      'Add to Project'
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
