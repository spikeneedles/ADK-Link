'use client';

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Settings, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LogEntry {
  timestamp: string | null;
  message: string;
  details: string;
  fullContent: string;
}

export default function SettingsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/logs');
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch logs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = async () => {
    try {
      const response = await fetch('/api/logs', { method: 'DELETE' });
      if (response.ok) {
        setLogs([]);
        toast({
          title: 'Success',
          description: 'Error logs cleared',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear logs',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <Card className="mb-8 border-0 shadow-none">
        <CardHeader className="p-0">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Settings className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">Settings</CardTitle>
              <CardDescription className="mt-2 max-w-2xl">
                Manage your account settings and preferences.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Error Logs Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <CardTitle className="text-xl">Error Logs</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchLogs}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={clearLogs}
                disabled={logs.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Logs
              </Button>
            </div>
          </div>
          <CardDescription>
            View and manage application error logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No errors logged</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Error logs will appear here when they occur
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] w-full rounded-md border p-4">
              <div className="space-y-4">
                {logs.map((log, index) => (
                  <div key={index}>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="font-mono text-xs">
                              ERROR
                            </Badge>
                            {log.timestamp && (
                              <span className="text-xs text-muted-foreground font-mono">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm font-medium text-destructive">
                            {log.message}
                          </p>
                          {log.details && (
                            <pre className="mt-2 text-xs text-muted-foreground font-mono bg-muted p-2 rounded overflow-x-auto">
                              {log.details}
                            </pre>
                          )}
                        </div>
                      </div>
                    </div>
                    {index < logs.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
