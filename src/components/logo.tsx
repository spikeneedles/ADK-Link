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
            : 'bg-destructive/20 group-hover:bg-destructive/30'
        )}
      >
        {isConnected ? (
          <Link2 className="h-6 w-6 text-primary" />
        ) : (
          <Unplug className="h-6 w-6 text-destructive" />
        )}
      </div>
      <div>
        <h1
          className={cn(
            'font-headline text-xl font-bold transition-colors tracking-tighter',
            isConnected ? 'text-primary' : 'text-destructive'
          )}
        >
          ADK Link
        </h1>
        <p
          className={cn(
            'text-xs transition-colors',
            isConnected ? 'text-primary' : 'text-destructive'
          )}
        >
          {isConnected ? 'Connected' : 'Disconnected'}
        </p>
      </div>
    </Button>
  );
}
