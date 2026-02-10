'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ProjectContextType {
  isConnected: boolean;
  projectPath: string | null;
  connectProject: (path: string) => void;
  disconnectProject: () => void;
  isPathAllowed: (path: string) => boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [projectPath, setProjectPath] = useState<string | null>(null);

  // Load saved connection on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPath = localStorage.getItem('connectedProjectPath');
      if (savedPath) {
        setProjectPath(savedPath);
        setIsConnected(true);
      }
    }
  }, []);

  const connectProject = (path: string) => {
    setProjectPath(path);
    setIsConnected(true);
    localStorage.setItem('connectedProjectPath', path);
    localStorage.setItem('workingDirectory', path); // Also set as working directory
  };

  const disconnectProject = () => {
    setProjectPath(null);
    setIsConnected(false);
    localStorage.removeItem('connectedProjectPath');
  };

  const isPathAllowed = (targetPath: string): boolean => {
    if (!isConnected || !projectPath) return false;
    
    // Normalize paths for comparison (handle both / and \)
    const normalizedTarget = targetPath.replace(/\\/g, '/').toLowerCase();
    const normalizedProject = projectPath.replace(/\\/g, '/').toLowerCase();
    
    // Check if target path starts with project path
    return normalizedTarget.startsWith(normalizedProject);
  };

  return (
    <ProjectContext.Provider value={{ isConnected, projectPath, connectProject, disconnectProject, isPathAllowed }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
