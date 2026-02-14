'use client';

import { Link2, Unplug, FolderOpen } from 'lucide-react';
import { useProject } from '@/contexts/project-context';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { useState, useRef } from 'react';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

export function Logo() {
  const { isConnected, projectPath, connectProject, disconnectProject } = useProject();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPath, setSelectedPath] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (isConnected) {
      // Disconnect
      disconnectProject();
      toast({
        title: "Disconnected from Project",
        description: "Now in sandbox mode. No file operations will execute.",
        variant: "destructive",
      });
    } else {
      // Show connection dialog
      setShowDialog(true);
    }
  };

  const handleConnect = () => {
    if (!selectedPath.trim()) {
      toast({
        title: "Invalid Path",
        description: "Please select a project folder.",
        variant: "destructive",
      });
      return;
    }

    connectProject(selectedPath);
    setShowDialog(false);
    setSelectedPath('');
    toast({
      title: "Connected to Project",
      description: `Connected to: ${selectedPath}`,
    });
  };

  const handleBrowseClick = () => {
    // Trigger the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Get the path from the first file (webkitRelativePath gives us folder/file)
      const firstFile = files[0];
      // @ts-ignore - webkitRelativePath exists on File in browsers
      const relativePath = firstFile.webkitRelativePath || '';
      
      if (relativePath) {
        // Extract folder path from the relative path
        const folderName = relativePath.split('/')[0];
        
        // For browser security, we can't get the absolute path
        // So we'll construct a reasonable path based on common locations
        let absolutePath = '';
        
        // Try to get the directory handle if File System Access API is available
        if ('showDirectoryPicker' in window) {
          // Modern API available - we'll use it instead
          handleModernDirectoryPicker();
          return;
        }
        
        // Fallback: Show the folder name and let user confirm/edit
        setSelectedPath(folderName);
        toast({
          title: "Folder Selected",
          description: `Selected: ${folderName}. Please verify the full path below.`,
        });
      }
    }
  };

  const handleModernDirectoryPicker = async () => {
    try {
      // @ts-ignore - showDirectoryPicker is available in modern browsers
      const dirHandle = await window.showDirectoryPicker();
      
      // Get the directory name
      const dirName = dirHandle.name;
      
      // We still can't get the absolute path for security reasons
      // But we can use the directory handle for operations
      // For now, prompt user to enter the full path
      const userPath = prompt(`Selected folder: "${dirName}"\n\nPlease enter the full absolute path to this folder:\n(Example: C:\\Users\\YourName\\Desktop\\${dirName})`, '');
      
      if (userPath) {
        setSelectedPath(userPath);
      }
    } catch (err: any) {
      // User cancelled the picker - this is normal, don't show error
      if (err.name === 'AbortError') {
        return; // Silent return, no error message
      }
      
      // Actual error - log it
      console.error('Directory picker error:', err);
      toast({
        title: "Error Selecting Folder",
        description: err.message || "An error occurred while selecting the folder.",
        variant: "destructive",
      });
    }
  };

  const handleBrowse = () => {
    // Check if modern File System Access API is available
    if ('showDirectoryPicker' in window) {
      handleModernDirectoryPicker();
    } else {
      // Fall back to file input method
      handleBrowseClick();
    }
  };

  return (
    <>
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
        <div className="flex-1">
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
              'text-xs transition-colors truncate max-w-[180px]',
              isConnected ? 'text-primary' : 'text-destructive'
            )}
          >
            {isConnected ? projectPath?.split(/[/\\]/).pop() || 'Connected' : 'Sandbox Mode'}
          </p>
        </div>
      </Button>

      {/* Hidden file input for folder selection */}
      <input
        ref={fileInputRef}
        type="file"
        // @ts-ignore - webkitdirectory is a valid attribute
        webkitdirectory=""
        directory=""
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to Project</DialogTitle>
            <DialogDescription>
              Select the project folder you want to work with. All file operations will be restricted to this folder and its subfolders.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Folder Path</label>
              <div className="flex gap-2">
                <Input
                  placeholder="C:\projects\my-app or /home/user/my-app"
                  value={selectedPath}
                  onChange={(e) => setSelectedPath(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleBrowse} variant="outline" type="button">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Browse
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Click "Browse" to open folder picker, or enter the absolute path manually
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleConnect}>
                Connect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
