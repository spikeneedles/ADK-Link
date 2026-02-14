'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useProject } from '@/contexts/project-context';
import { useRouter } from 'next/navigation';

export function ProjectDetector() {
  const { isConnected, projectPath } = useProject();
  const [hasProjectRoot, setHasProjectRoot] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();

  // Scan for project root when connection changes
  useEffect(() => {
    if (!isConnected || !projectPath) {
      setHasProjectRoot(null);
      return;
    }

    const scanForProject = async () => {
      setIsScanning(true);
      try {
        const response = await fetch('/api/check-project-root', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: projectPath }),
        });

        if (response.ok) {
          const data = await response.json();
          setHasProjectRoot(data.hasProjectRoot);
        }
      } catch (error) {
        console.error('Failed to scan for project:', error);
        setHasProjectRoot(false);
      } finally {
        setIsScanning(false);
      }
    };

    scanForProject();
  }, [isConnected, projectPath]);

  // Don't show anything if not connected or still scanning
  if (!isConnected || isScanning || hasProjectRoot === null) {
    return null;
  }

  // Only show button if NO project root found
  if (hasProjectRoot) {
    return null;
  }

  const handleGenerateRoot = () => {
    // Navigate to tools page where user can scaffold a project
    router.push('/tools');
  };

  return (
    <div className="px-2 pb-2">
      <Button
        onClick={handleGenerateRoot}
        variant="default"
        className="w-full gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
        size="sm"
      >
        <Sparkles className="w-4 h-4" />
        <span>Generate Project Root</span>
      </Button>
    </div>
  );
}
