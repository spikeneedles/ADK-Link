'use client';

import { useState, useEffect } from 'react';
import { useProject } from '@/contexts/project-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, GanttChartSquare, Library, Plug, ShieldCheck, Unplug, Workflow, Sparkles, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { FrameworkSelector } from '@/components/app/framework-selector';

const features = [
  {
    icon: Workflow,
    title: 'Workflows',
    description: 'Visually define and implement complex AI workflows.',
    href: '/workflows',
    color: 'text-primary',
  },
  {
    icon: ShieldCheck,
    title: 'Safety Rails',
    description: 'Integrate safety rails to ensure responsible AI behavior.',
    href: '/safety-rails',
    color: 'text-destructive',
  },
  {
    icon: Library,
    title: 'Prompt Library',
    description: 'Utilize a vast library of pre-built prompts.',
    href: '/prompt-library',
    color: 'text-accent',
  },
  {
    icon: GanttChartSquare,
    title: 'Tools',
    description: 'Implement powerful tools into your connected program.',
    href: '/tools',
    color: 'text-primary',
  },
  {
    icon: Bot,
    title: 'Model Customization',
    description: 'Customize your model with a unique personality.',
    href: '/model-customization',
    color: 'text-accent',
  },
];

export default function Home() {
  const { isConnected, projectPath, connectProject } = useProject();
  const router = useRouter();
  const [hasProjectRoot, setHasProjectRoot] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showFrameworkSelector, setShowFrameworkSelector] = useState(false);

  // Auto-reconnect after project generation reload
  useEffect(() => {
    const reconnectPath = localStorage.getItem('adklink_reconnect_path');
    if (reconnectPath && !isConnected) {
      console.log('[Dashboard] Auto-reconnecting to:', reconnectPath);
      connectProject(reconnectPath);
      localStorage.removeItem('adklink_reconnect_path');
    }
  }, [isConnected, connectProject]);

  // Scan for project root when connected
  useEffect(() => {
    console.log('[Dashboard] Connection state:', { isConnected, projectPath, hasProjectRoot });
    
    if (!isConnected || !projectPath) {
      setHasProjectRoot(null);
      return;
    }

    const scanForProject = async () => {
      setIsScanning(true);
      console.log('[Dashboard] Scanning for project at:', projectPath);
      try {
        const response = await fetch('/api/check-project-root', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: projectPath }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('[Dashboard] Scan result:', data);
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

  const handleConnect = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    // @ts-ignore - webkitdirectory is not in types but works
    input.webkitdirectory = true;
    input.onchange = (e: any) => {
      const files = e.target?.files;
      if (files && files.length > 0) {
        const path = files[0].path.split(/[/\\]/).slice(0, -1).join('\\');
        connectProject(path);
      }
    };
    input.click();
  };

  const handleGenerateRoot = () => {
    setShowFrameworkSelector(true);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className={cn("col-span-1 lg:col-span-3 transition-colors", isConnected ? "bg-card/50 border-primary/50 shadow-lg shadow-primary/10" : "bg-muted/30 border-destructive/30")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Connection</CardTitle>
            {isConnected ? <Plug className="h-4 w-4 text-primary" /> : <Unplug className="h-4 w-4 text-destructive" />}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className={cn("text-2xl font-bold", isConnected ? "text-primary" : "text-destructive")}>
              {isConnected ? "Connected" : "Disconnected"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isConnected 
                ? `Linked to: ${projectPath}` 
                : "Connect to a project folder to get started"}
            </p>
            
            {/* Status Messages */}
            {isScanning && (
              <p className="text-xs text-muted-foreground">🔍 Scanning for project...</p>
            )}
            {!isScanning && isConnected && hasProjectRoot === true && (
              <p className="text-xs text-green-500">✓ Project root detected</p>
            )}
            {!isScanning && isConnected && hasProjectRoot === false && (
              <p className="text-xs text-yellow-500">⚠️ No project root found</p>
            )}
            
            {/* Button Section */}
            <div className="flex flex-col gap-2 pt-2">
              {/* Generate Project Root Button - ONLY shows when connected but NO project root */}
              {isConnected && hasProjectRoot === false && (
                <Button
                  onClick={handleGenerateRoot}
                  className="w-full gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Project Root</span>
                </Button>
              )}
              
              {/* Connect Tool Source Button - Always shows */}
              <Button
                onClick={() => alert('Tool Source connection coming soon!')}
                variant="outline"
                className="w-full gap-2"
              >
                <Plug className="w-4 h-4" />
                <span>Connect Tool Source</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="hover:bg-card/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
              <feature.icon className={`h-6 w-6 ${feature.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
              <Button asChild variant="outline" size="sm">
                <Link href={feature.href}>Go to {feature.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Framework Selector Dialog */}
      <FrameworkSelector
        open={showFrameworkSelector}
        onOpenChange={setShowFrameworkSelector}
      />
    </div>
  );
}
