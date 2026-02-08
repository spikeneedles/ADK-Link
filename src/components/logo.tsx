'use client';

import { Link2, Unplug } from 'lucide-react';
import { useIDEConnection } from '@/components/providers';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';

export function Logo() {
  const { isConnected, toggleConnection } = useIDEConnection();
  const { toast } = useToast();

  const handleClick = () => {
    toggleConnection();
    toast({
        title: isConnected ? "Disconnected from IDE" : "Connected to IDE",
        description: isConnected ? "Connection terminated." : "Connection established successfully.",
    });
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="flex items-center gap-2 p-2 group text-left w-full h-auto justify-start"
    >
      <div
        className={cn(
          'p-2 rounded-lg transition-colors',
          isConnected
            ? 'bg-primary/20 group-hover:bg-primary/30'
            : 'bg-muted group-hover:bg-muted/80'
        )}
      >
        {isConnected ? (
          <Link2 className="h-6 w-6 text-primary" />
        ) : (
          <Unplug className="h-6 w-6 text-muted-foreground" />
        )}
      </div>
      <div>
        <h1
          className={cn(
            'font-headline text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tighter',
            isConnected && 'group-hover:text-primary'
          )}
        >
          ADK Link
        </h1>
        <p
          className={cn(
            'text-xs transition-colors',
            isConnected ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {isConnected ? 'Connected' : 'Disconnected'}
        </p>
      </div>
    </Button>
  );
}
