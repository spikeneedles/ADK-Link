'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Folder, File, ArrowUp, ChevronsRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// This is a simplified mock of the project's file system for demonstration.
const mockFileSystem: Record<string, string[]> = {
  '/': ['src', 'package.json', 'README.md', 'next.config.ts', 'tsconfig.json'],
  '/src': ['app', 'components', 'lib', 'ai', 'hooks'],
  '/src/app': ['layout.tsx', 'page.tsx', 'profile', 'settings', 'model-customization', 'prompt-library', 'safety-rails', 'tools', 'workflows', 'globals.css'],
  '/src/components': ['app', 'ui', 'logo.tsx', 'providers.tsx', 'app-shell.tsx'],
  '/src/components/app': ['main-nav.tsx', 'model-customization-form.tsx', 'prompt-suggester.tsx', 'safety-rails-form.tsx', 'file-navigator.tsx', 'chat-interface.tsx'],
  '/src/components/ui': ['button.tsx', 'card.tsx', 'dialog.tsx', 'input.tsx', 'label.tsx', 'sidebar.tsx'],
  '/src/lib': ['utils.ts', 'placeholder-images.ts', 'placeholder-images.json'],
  '/src/ai': ['genkit.ts', 'dev.ts', 'flows'],
  '/src/ai/flows': ['customize-model-personality.ts', 'generate-ai-safety-rails.ts', 'suggest-prompts-from-context.ts', 'chat.ts'],
  '/src/hooks': ['use-mobile.tsx', 'use-toast.ts'],
  '/src/app/profile': ['page.tsx'],
  '/src/app/settings': ['page.tsx'],
  '/src/app/model-customization': ['page.tsx'],
  '/src/app/prompt-library': ['page.tsx'],
  '/src/app/safety-rails': ['page.tsx'],
  '/src/app/tools': ['page.tsx'],
  '/src/app/workflows': ['page.tsx'],
};

export function FileNavigator() {
  const [currentPath, setCurrentPath] = useState('/src/app');

  const pathParts = currentPath.split('/').filter(Boolean);
  const filesAndFolders = mockFileSystem[currentPath] || [];

  const navigateUp = () => {
    if (currentPath === '/') return;
    const newPath = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/';
    setCurrentPath(newPath);
  };

  const navigateTo = (folder: string) => {
    const newPath = currentPath === '/' ? `/${folder}` : `${currentPath}/${folder}`;
    if (newPath in mockFileSystem) {
      setCurrentPath(newPath);
    }
  };

  const isFolder = (name: string) => {
    const newPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
    return newPath in mockFileSystem;
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="shadow-lg bg-background/80 backdrop-blur-sm min-w-[250px] justify-start">
             <div className="flex items-center gap-1.5 text-sm truncate">
                <Folder className="w-4 h-4 text-primary shrink-0" />
                <span className="text-muted-foreground">/</span>
                {pathParts.map((part, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                        <ChevronsRight className="w-3 h-3 text-muted-foreground" />
                        <span>{part}</span>
                    </div>
                ))}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="center" className="w-64 max-h-80 overflow-y-auto">
          <DropdownMenuItem onSelect={navigateUp} disabled={currentPath === '/'}>
            <ArrowUp className="mr-2 h-4 w-4" />
            <span>..</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {filesAndFolders.map((item) => {
            const isItemFolder = isFolder(item);
            return (
                <DropdownMenuItem 
                    key={item} 
                    onSelect={isItemFolder ? () => navigateTo(item) : (e) => e.preventDefault()} 
                    className={cn(!isItemFolder && "cursor-default focus:bg-transparent text-muted-foreground focus:text-muted-foreground")}
                >
                {isItemFolder ? (
                    <Folder className="mr-2 h-4 w-4 text-primary" />
                ) : (
                    <File className="mr-2 h-4 w-4" />
                )}
                <span>{item}</span>
                </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
