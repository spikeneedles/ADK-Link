'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Folder, File, ArrowUp, ChevronsRight, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useProject } from '@/contexts/project-context';

interface FileItem {
  name: string;
  isDirectory: boolean;
}

export function FileNavigator() {
  const { isConnected, projectPath } = useProject();
  const [currentPath, setCurrentPath] = useState<string>('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize currentPath when project is connected
  useEffect(() => {
    if (isConnected && projectPath) {
      setCurrentPath(projectPath);
    } else {
      setCurrentPath('');
      setFiles([]);
    }
  }, [isConnected, projectPath]);

  // Load directory contents
  useEffect(() => {
    if (!currentPath || !isConnected) {
      setFiles([]);
      return;
    }

    const loadDirectory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/list-directory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: currentPath }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setFiles(data.files || []);
        }
      } catch (error) {
        console.error('Failed to load directory:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDirectory();
  }, [currentPath, isConnected]);

  // Store current path in localStorage for Link to use
  useEffect(() => {
    if (typeof window !== 'undefined' && currentPath) {
      localStorage.setItem('workingDirectory', currentPath);
    }
  }, [currentPath]);

  // Don't render if not connected (this must come AFTER all hooks)
  if (!isConnected || !projectPath || !currentPath) {
    return null;
  }

  const pathParts = currentPath.split(/[/\\\\]/).filter(Boolean);
  const projectPathParts = projectPath.split(/[/\\\\]/).filter(Boolean);

  const navigateUp = () => {
    // Normalize paths for comparison
    const normalizedCurrent = currentPath.replace(/\\/g, '/').toLowerCase();
    const normalizedProject = projectPath.replace(/\\/g, '/').toLowerCase();
    
    // Don't allow navigation above project root
    if (normalizedCurrent === normalizedProject) return;
    
    const lastSlash = Math.max(currentPath.lastIndexOf('/'), currentPath.lastIndexOf('\\'));
    if (lastSlash <= 0) return;
    
    const newPath = currentPath.substring(0, lastSlash);
    
    // Verify new path is still within project
    const normalizedNew = newPath.replace(/\\/g, '/').toLowerCase();
    if (normalizedNew.startsWith(normalizedProject)) {
      setCurrentPath(newPath);
    }
  };

  const navigateTo = (folder: string) => {
    const separator = currentPath.includes('\\') ? '\\' : '/';
    const newPath = `${currentPath}${separator}${folder}`;
    setCurrentPath(newPath);
  };

  const navigateToRoot = () => {
    setCurrentPath(projectPath);
  };

  // Check if we're at project root
  const isAtRoot = currentPath.replace(/\\/g, '/').toLowerCase() === projectPath.replace(/\\/g, '/').toLowerCase();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="shadow-lg bg-background/80 backdrop-blur-sm min-w-[300px] justify-start">
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
        <DropdownMenuContent side="top" align="center" className="w-80 max-h-96 overflow-y-auto">
          <div className="px-2 py-1.5 text-xs text-muted-foreground font-mono truncate">
            {currentPath}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={navigateToRoot} disabled={isAtRoot}>
            <Home className="mr-2 h-4 w-4 text-primary" />
            <span>Project Root</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={navigateUp} disabled={isAtRoot}>
            <ArrowUp className="mr-2 h-4 w-4" />
            <span>Parent Directory (..)</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {isLoading ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : files.length === 0 ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              Empty directory
            </div>
          ) : (
            files.map((item) => (
                <DropdownMenuItem 
                    key={item.name} 
                    onSelect={item.isDirectory ? () => navigateTo(item.name) : undefined} 
                    className={cn(!item.isDirectory && "cursor-default focus:bg-transparent text-muted-foreground focus:text-muted-foreground")}
                >
                {item.isDirectory ? (
                    <Folder className="mr-2 h-4 w-4 text-primary" />
                ) : (
                    <File className="mr-2 h-4 w-4 text-muted-foreground" />
                )}
                <span>{item.name}</span>
                </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
