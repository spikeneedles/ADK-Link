'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FolderPlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useProject } from '@/contexts/project-context';
import { universalChat } from '@/ai/flows/universal-chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const FRAMEWORKS = [
  { id: 'rust', name: 'Rust', icon: '🦀', description: 'Systems programming language' },
  { id: 'python', name: 'Python', icon: '🐍', description: 'General-purpose scripting' },
  { id: 'go', name: 'Go', icon: '🐹', description: 'Fast & efficient backend' },
  { id: 'nodejs', name: 'Node.js', icon: '💚', description: 'JavaScript runtime' },
  { id: 'typescript', name: 'TypeScript', icon: '💙', description: 'Typed JavaScript' },
  { id: 'nextjs', name: 'Next.js', icon: '⚡', description: 'React framework' },
] as const;

export function ProjectScaffolding() {
  const { isConnected, projectPath, isPathAllowed } = useProject();
  const [currentPath, setCurrentPath] = useState<string>('');
  const [hasProjectRoot, setHasProjectRoot] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<{
    success: boolean;
    message: string;
    filesCreated: string[];
  } | null>(null);

  // Load current path from localStorage (from FileNavigator)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const workingDir = localStorage.getItem('workingDirectory');
      if (workingDir) {
        setCurrentPath(workingDir);
      }
    }
  }, []);

  // Check if current directory has a project root
  useEffect(() => {
    const checkForProjectRoot = async () => {
      if (!currentPath || !isConnected) {
        setHasProjectRoot(true); // Don't show button if not connected
        return;
      }

      setIsChecking(true);
      try {
        const response = await fetch('/api/check-project-root', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: currentPath }),
        });

        if (response.ok) {
          const data = await response.json();
          setHasProjectRoot(data.hasProjectRoot);
        }
      } catch (error) {
        console.error('Failed to check project root:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkForProjectRoot();
  }, [currentPath, isConnected]);

  const toggleFramework = (frameworkId: string) => {
    setSelectedFrameworks(prev =>
      prev.includes(frameworkId)
        ? prev.filter(id => id !== frameworkId)
        : [...prev, frameworkId]
    );
  };

  const handleCreateScaffolding = async () => {
    if (selectedFrameworks.length === 0 || !currentPath) return;

    setIsGenerating(true);
    setGenerationStatus(null);

    try {
      const allFilesCreated: string[] = [];
      const isMultiRoot = selectedFrameworks.length > 1;

      for (const framework of selectedFrameworks) {
        const targetPath = isMultiRoot 
          ? `${currentPath}\\${framework}-project`
          : currentPath;

        const prompt = `Create a complete ${framework} project scaffolding with all necessary configuration files, directory structure, and a basic example. This is for ${isMultiRoot ? 'a multi-root workspace' : 'a standalone project'}. Include README.md with setup instructions.`;

        const result = await universalChat({
          history: [{ role: 'user', content: prompt }],
          projectPath: targetPath,
          targetLanguage: framework as any,
        });

        // Write files to disk
        if (result.files && result.files.length > 0) {
          for (const file of result.files) {
            try {
              const fullPath = `${targetPath}\\${file.path}`;
              const apiResponse = await fetch('/api/write-file', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-project-path': projectPath || '',
                },
                body: JSON.stringify({ path: fullPath, content: file.content }),
              });

              if (apiResponse.ok) {
                const displayPath = isMultiRoot 
                  ? `${framework}-project/${file.path}`
                  : file.path;
                allFilesCreated.push(displayPath);
              } else {
                const errorData = await apiResponse.json();
                if (errorData.error === 'SANDBOX_MODE') {
                  setGenerationStatus({
                    success: false,
                    message: '🔒 Sandbox Mode: Please connect to a project first.',
                    filesCreated: [],
                  });
                  setIsGenerating(false);
                  return;
                }
              }
            } catch (err) {
              console.error('Failed to write file:', file.path, err);
            }
          }
        }
      }

      setGenerationStatus({
        success: true,
        message: `Successfully created ${isMultiRoot ? 'multi-root' : 'project'} scaffolding!`,
        filesCreated: allFilesCreated,
      });

      // Reset and close after success
      setTimeout(() => {
        setIsDialogOpen(false);
        setSelectedFrameworks([]);
        setHasProjectRoot(true); // Hide button after creating project
      }, 3000);

    } catch (error) {
      setGenerationStatus({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        filesCreated: [],
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Don't show if connected and has project root, or if checking
  if (!isConnected || hasProjectRoot || isChecking) {
    return null;
  }

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FolderPlus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">No Project Detected</CardTitle>
              <CardDescription>
                Create scaffolding for a new project in: <br />
                <code className="text-xs font-mono mt-1 inline-block">{currentPath}</code>
              </CardDescription>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="animate-pulse">
                <FolderPlus className="mr-2 h-5 w-5" />
                Create Project Scaffolding
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Create Project Scaffolding</DialogTitle>
                <DialogDescription>
                  Select one or more frameworks to generate project structure. Multi-selection creates a multi-root workspace.
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[400px] pr-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {FRAMEWORKS.map((framework) => (
                      <div
                        key={framework.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedFrameworks.includes(framework.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-primary/50'
                        }`}
                        onClick={() => toggleFramework(framework.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedFrameworks.includes(framework.id)}
                            onCheckedChange={() => toggleFramework(framework.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{framework.icon}</span>
                              <Label className="cursor-pointer font-semibold">
                                {framework.name}
                              </Label>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {framework.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedFrameworks.length > 1 && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Multi-root workspace: Each framework will have its own subfolder
                      </p>
                    </div>
                  )}

                  {selectedFrameworks.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Frameworks:</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedFrameworks.map(id => {
                          const framework = FRAMEWORKS.find(f => f.id === id);
                          return (
                            <Badge key={id} variant="secondary">
                              {framework?.icon} {framework?.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {generationStatus && (
                <div className={`p-4 rounded-lg ${
                  generationStatus.success 
                    ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {generationStatus.success ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                    <p className={`font-medium ${
                      generationStatus.success 
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {generationStatus.message}
                    </p>
                  </div>
                  {generationStatus.filesCreated.length > 0 && (
                    <ScrollArea className="max-h-32">
                      <ul className="space-y-1 mt-2">
                        {generationStatus.filesCreated.map((file, idx) => (
                          <li key={idx} className="text-xs font-mono text-green-600 dark:text-green-300">
                            ✓ {file}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateScaffolding}
                  disabled={selectedFrameworks.length === 0 || isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FolderPlus className="mr-2 h-4 w-4" />
                      Create {selectedFrameworks.length > 0 && `(${selectedFrameworks.length})`}
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
    </Card>
  );
}
