'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus, Terminal } from 'lucide-react';
import { useProject } from '@/contexts/project-context';
import { universalChat } from '@/ai/flows/universal-chat';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

const FRAMEWORKS = [
  { id: 'nextjs', label: 'Next.js 15', icon: '⚡' },
  { id: 'react', label: 'React', icon: '⚛️' },
  { id: 'python', label: 'Python (FastAPI/Flask)', icon: '🐍' },
  { id: 'rust', label: 'Rust', icon: '🦀' },
  { id: 'go', label: 'Go', icon: '🐹' },
  { id: 'nodejs', label: 'Node.js', icon: '💚' },
];

export function ProjectCreationWizard() {
  const { projectPath } = useProject();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleFramework = (id: string) => {
    setSelectedFrameworks(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
  };

  const handleCopyError = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied to Clipboard",
            description: "Error message details copied.",
            duration: 2000,
        });
    }
  };

  const handleCreate = async () => {
    if (!projectPath) return;
    
    setIsGenerating(true);
    
    // Construct the prompt
    const explicitFrameworks = FRAMEWORKS.filter(f => selectedFrameworks.includes(f.id)).map(f => f.label);
    const techStack = [...explicitFrameworks];
    if (customInput.trim()) {
        techStack.push(customInput.trim());
    }

    const prompt = `Create a new project in ${projectPath}.
    
Requested Tech Stack: ${techStack.join(', ')}.

If multiple frameworks are requested (e.g. Frontend + Backend), please structure the project with multiple roots (e.g. /frontend, /backend) and a shared root configuration if applicable.
Please generate all necessary configuration files, README, and ignore files.`;

    try {
      console.log('Sending request to AI with stack:', techStack);
      const result = await universalChat({
        history: [{ role: 'user', content: prompt }],
        projectPath: projectPath,
        techStack: techStack,
      });
      console.log('AI Response:', result);
      
      if (result.files && result.files.length > 0) {
        let successCount = 0;
        let failCount = 0;
        
        for (const file of result.files) {
             try {
                 const separator = projectPath.endsWith('\\') || projectPath.endsWith('/') ? '' : '\\';
                 const fullPath = `${projectPath}${separator}${file.path}`;
                 
                 console.log(`Writing file: ${fullPath}`);
                 
                 const res = await fetch('/api/write-file', {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    'x-project-path': projectPath,
                  },
                  body: JSON.stringify({ path: fullPath, content: file.content }),
                });
                
                if (!res.ok) {
                    const err = await res.json();
                    console.error('Write failed:', err);
                    failCount++;
                } else {
                    successCount++;
                }
             } catch (e) {
                 console.error(e);
                 failCount++;
             }
        }
        
        if (successCount > 0) {
            toast({
                title: "Project Scaffolded",
                description: `Link created ${successCount} files. ${failCount > 0 ? `(${failCount} failed)` : ''}`,
            });
            setIsOpen(false);
            window.location.reload(); 
        } else {
             const errorMsg = "AI generated files but they could not be saved. Check console for permissions.";
             toast({
                title: "File Write Failed",
                description: errorMsg,
                variant: "destructive",
                action: (
                    <ToastAction altText="Copy error" onClick={() => handleCopyError(errorMsg)}>
                        Copy Error
                    </ToastAction>
                ),
            });
        }

      } else {
         console.warn('No files returned by AI');
         const errorMsg = result.response || "No files were returned by Link. Try again.";
         toast({
            title: "Generation Failed",
            description: errorMsg,
            variant: "destructive",
            action: (
                <ToastAction altText="Copy error" onClick={() => handleCopyError(errorMsg)}>
                    Copy Error
                </ToastAction>
            ),
        });
      }

    } catch (error: any) {
      console.error(error);
      const errorText = error.message || "Failed to create project scaffold.";
      toast({
            title: "Error",
            description: errorText,
            variant: "destructive",
            action: (
                <ToastAction altText="Copy error" onClick={() => handleCopyError(errorText)}>
                    Copy Error
                </ToastAction>
            ),
        });
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Project with Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Initialize Project</DialogTitle>
          <DialogDescription>
            Select the technologies you want to use. Link will detect if a multi-root structure is needed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            {FRAMEWORKS.map((fw) => (
              <div key={fw.id} className="flex items-start space-x-2 bg-muted/50 p-3 rounded-md border border-transparent hover:border-primary/50 transition-colors">
                <Checkbox 
                    id={fw.id} 
                    checked={selectedFrameworks.includes(fw.id)}
                    onCheckedChange={() => toggleFramework(fw.id)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor={fw.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                  >
                    <span>{fw.icon}</span> {fw.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="custom-stack">Other Requirements / Custom Stack</Label>
            <Input 
                id="custom-stack" 
                placeholder="e.g. TailwindCSS, Prisma, Docker..." 
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
             <div className="text-xs text-muted-foreground self-center">
                Target: <code className="bg-muted px-1 rounded">{projectPath?.split('\\').pop()}</code>
             </div>
             <Button onClick={handleCreate} disabled={isGenerating || (selectedFrameworks.length === 0 && !customInput.trim())}>
                {isGenerating ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scaffolding...
                    </>
                ) : (
                    <>
                        <Terminal className="mr-2 h-4 w-4" />
                        Create Project
                    </>
                )}
             </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
