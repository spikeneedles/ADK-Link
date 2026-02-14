'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { ALL_TEMPLATES } from '@/ai/project-templates';
import { useProject } from '@/contexts/project-context';
import { useToast } from '@/hooks/use-toast';

interface FrameworkSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FrameworkSelector({ open, onOpenChange }: FrameworkSelectorProps) {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const { projectPath } = useProject();
  const { toast } = useToast();

  const handleToggleFramework = (frameworkId: string) => {
    setSelectedFrameworks(prev => 
      prev.includes(frameworkId)
        ? prev.filter(id => id !== frameworkId)
        : [...prev, frameworkId]
    );
  };

  const handleCreateProject = async () => {
    if (selectedFrameworks.length === 0 || !projectPath) return;

    setIsGenerating(true);
    setGeneratedCount(0);
    let successCount = 0;
    const isMonorepo = selectedFrameworks.length > 1;

    try {
      // If monorepo, create root structure first
      if (isMonorepo) {
        console.log('[FrameworkSelector] Creating monorepo structure...');
        
        // Create root package.json for monorepo
        const rootPackageJson = {
          name: 'monorepo',
          version: '1.0.0',
          private: true,
          workspaces: selectedFrameworks.map(id => `packages/${id}`),
          scripts: {
            'install-all': 'npm install',
          },
        };

        await fetch('/api/write-file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-project-path': projectPath,
          },
          body: JSON.stringify({
            path: `${projectPath}\\package.json`,
            content: JSON.stringify(rootPackageJson, null, 2),
          }),
        });

        // Create root README
        const rootReadme = `# Monorepo\n\nThis is a monorepo containing multiple projects:\n\n${selectedFrameworks.map(id => {
          const template = ALL_TEMPLATES.find(t => t.id === id);
          return `- **${template?.name}** in \`packages/${id}/\``;
        }).join('\n')}\n\n## Getting Started\n\nEach package is independent. Navigate to the package directory to work with it.\n`;

        await fetch('/api/write-file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-project-path': projectPath,
          },
          body: JSON.stringify({
            path: `${projectPath}\\README.md`,
            content: rootReadme,
          }),
        });
      }

      // Generate each selected framework
      for (const frameworkId of selectedFrameworks) {
        const template = ALL_TEMPLATES.find(t => t.id === frameworkId);
        if (!template) continue;

        console.log(`[FrameworkSelector] Generating ${template.name}...`);

        // Determine base path: root for single, packages/[id]/ for monorepo
        const basePath = isMonorepo ? `packages\\${frameworkId}` : '';

        // Write all files for this template
        for (const [filePath, content] of Object.entries(template.files)) {
          const fullPath = basePath 
            ? `${projectPath}\\${basePath}\\${filePath}`
            : `${projectPath}\\${filePath}`;

          try {
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
              console.error(`Failed to write ${filePath}:`, error);
              throw new Error(`Failed to write ${filePath}`);
            }
          } catch (err) {
            console.error('Error writing file:', err);
            throw err;
          }
        }

        successCount++;
        setGeneratedCount(successCount);
        console.log(`[FrameworkSelector] ✓ Generated ${template.name}`);
      }

      // Success!
      toast({
        title: '🎉 Project Created!',
        description: `Successfully scaffolded ${successCount} framework${successCount > 1 ? 's' : ''} in ${projectPath}`,
      });

      // Close dialog and reset
      setTimeout(() => {
        onOpenChange(false);
        setSelectedFrameworks([]);
        setGeneratedCount(0);
        
        // Store projectPath for auto-reconnect after reload
        localStorage.setItem('adklink_reconnect_path', projectPath);
        
        // Trigger page reload to re-scan for project root
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('[FrameworkSelector] Generation failed:', error);
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to create project scaffolding',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      onOpenChange(false);
      setSelectedFrameworks([]);
      setGeneratedCount(0);
    }
  };

  // Group templates by category
  const categories = ['Frontend', 'Backend', 'Mobile'];
  const groupedTemplates = categories.map(category => ({
    category,
    templates: ALL_TEMPLATES.filter(t => t.category === category)
  })).filter(group => group.templates.length > 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Generate Project Root
          </DialogTitle>
          <DialogDescription>
            Select one or more frameworks to scaffold. Multiple selections create a monorepo structure.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Framework Selection by Category */}
          {groupedTemplates.map(({ category, templates }) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates.map((template) => {
                  const isSelected = selectedFrameworks.includes(template.id);
                  
                  return (
                    <div
                      key={template.id}
                      className={`
                        border rounded-lg p-4 cursor-pointer transition-all
                        ${isSelected 
                          ? 'border-primary bg-primary/5 shadow-sm' 
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                      onClick={() => !isGenerating && handleToggleFramework(template.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => !isGenerating && handleToggleFramework(template.id)}
                          disabled={isGenerating}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-1">
                          <Label 
                            htmlFor={template.id}
                            className="text-sm font-semibold cursor-pointer"
                          >
                            {template.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Selected Count */}
          {selectedFrameworks.length > 0 && (
            <div className="text-sm text-muted-foreground text-center">
              {selectedFrameworks.length} framework{selectedFrameworks.length > 1 ? 's' : ''} selected
              {selectedFrameworks.length > 1 && ' (monorepo structure)'}
            </div>
          )}

          {/* Generation Progress */}
          {isGenerating && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating project scaffolding...</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {generatedCount} of {selectedFrameworks.length} completed
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            disabled={selectedFrameworks.length === 0 || isGenerating}
            className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Create Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
