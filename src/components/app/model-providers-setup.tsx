'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  Download, 
  Server, 
  Key, 
  CheckCircle2, 
  Copy,
  Loader2,
  Play,
  Terminal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProject } from '@/contexts/project-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ModelProvidersSetup() {
  const { toast } = useToast();
  const { projectPath, isConnected } = useProject();
  
  // API Keys
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  
  // Model Selection
  const [geminiModel, setGeminiModel] = useState('gemini-2.0-flash-exp');
  const [openaiModel, setOpenaiModel] = useState('gpt-4-turbo');
  const [ollamaModel, setOllamaModel] = useState('llama3.2:3b');
  
  // Gemini models (loaded from API)
  const [geminiModels, setGeminiModels] = useState<Array<{value: string, label: string, description: string}>>([
    { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (Experimental)', description: 'Loading models...' }
  ]);
  const [loadingGeminiModels, setLoadingGeminiModels] = useState(true);

  // OpenAI models (loaded from API)
  const [openaiModels, setOpenaiModels] = useState<Array<{value: string, label: string, description: string}>>([
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: 'Loading models...' }
  ]);
  const [loadingOpenAIModels, setLoadingOpenAIModels] = useState(true);
  
  // Status
  const [geminiSaved, setGeminiSaved] = useState(false);
  const [openaiSaved, setOpenaiSaved] = useState(false);
  const [ollamaInstalling, setOllamaInstalling] = useState(false);
  const [ollamaDownloading, setOllamaDownloading] = useState(false);

  // Fetch Gemini models on mount
  useEffect(() => {
    const fetchGeminiModels = async () => {
      try {
        const response = await fetch('/api/gemini-models');
        const data = await response.json();
        
        if (data.models && data.models.length > 0) {
          setGeminiModels(data.models);
          // Set first model as default if current selection doesn't exist
          if (!data.models.find((m: any) => m.value === geminiModel)) {
            setGeminiModel(data.models[0].value);
          }
        }
      } catch (error) {
        console.error('Failed to fetch Gemini models:', error);
        // Keep fallback models if fetch fails
      } finally {
        setLoadingGeminiModels(false);
      }
    };

    fetchGeminiModels();
  }, []);

  // Fetch OpenAI models on mount
  useEffect(() => {
    const fetchOpenAIModels = async () => {
      try {
        const response = await fetch('/api/openai-models');
        const data = await response.json();
        
        if (data.models && data.models.length > 0) {
          setOpenaiModels(data.models);
          // Set first model as default if current selection doesn't exist
          if (!data.models.find((m: any) => m.value === openaiModel)) {
            setOpenaiModel(data.models[0].value);
          }
        }
      } catch (error) {
        console.error('Failed to fetch OpenAI models:', error);
        // Keep fallback models if fetch fails
      } finally {
        setLoadingOpenAIModels(false);
      }
    };

    fetchOpenAIModels();
  }, []);

  // Model options
  // geminiModels and openaiModels are now loaded from API above

  // Models that run well on RTX 2070 (8GB VRAM)
  const ollamaModels = [
    { value: 'llama3.2:3b', label: 'Llama 3.2 (3B)', vram: '2.5GB', description: 'Fast, efficient' },
    { value: 'phi3:mini', label: 'Phi-3 Mini (3.8B)', vram: '2.8GB', description: 'Microsoft\'s efficient model' },
    { value: 'mistral:7b', label: 'Mistral 7B', vram: '4.5GB', description: 'Popular, balanced' },
    { value: 'gemma2:9b', label: 'Gemma 2 (9B)', vram: '5.5GB', description: 'Google\'s latest' },
    { value: 'qwen2.5:7b', label: 'Qwen 2.5 (7B)', vram: '4.5GB', description: 'Strong performance' },
    { value: 'llama3.1:8b', label: 'Llama 3.1 (8B)', vram: '5GB', description: 'Meta\'s latest' },
  ];

  const handleSaveGeminiKey = async () => {
    if (!isConnected || !projectPath) {
      toast({
        title: 'Not Connected',
        description: 'Connect to a project first via ADK Link button.',
        variant: 'destructive',
      });
      return;
    }

    if (!geminiKey.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your Gemini API key.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create .env file with Gemini key
      const envContent = `# Gemini API Configuration
GOOGLE_GENAI_API_KEY=${geminiKey}
GEMINI_API_KEY=${geminiKey}

# Model Settings
GEMINI_MODEL=${geminiModel}
`;

      const response = await fetch('/api/write-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-project-path': projectPath,
        },
        body: JSON.stringify({
          path: `${projectPath}\\.env`,
          content: envContent,
        }),
      });

      if (response.ok) {
        setGeminiSaved(true);
        toast({
          title: '✅ Gemini Configured!',
          description: 'API key saved to .env file.',
        });
      } else {
        throw new Error('Failed to write .env file');
      }
    } catch (error) {
      console.error('Error saving Gemini key:', error);
      toast({
        title: 'Save Failed',
        description: 'Could not save API key to project.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveOpenAIKey = async () => {
    if (!isConnected || !projectPath) {
      toast({
        title: 'Not Connected',
        description: 'Connect to a project first via ADK Link button.',
        variant: 'destructive',
      });
      return;
    }

    if (!openaiKey.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your OpenAI API key.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create .env file with OpenAI key
      const envContent = `# OpenAI API Configuration
OPENAI_API_KEY=${openaiKey}

# Model Settings
OPENAI_MODEL=${openaiModel}
`;

      const response = await fetch('/api/write-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-project-path': projectPath,
        },
        body: JSON.stringify({
          path: `${projectPath}\\.env`,
          content: envContent,
        }),
      });

      if (response.ok) {
        setOpenaiSaved(true);
        toast({
          title: '✅ OpenAI Configured!',
          description: 'API key saved to .env file.',
        });
      } else {
        throw new Error('Failed to write .env file');
      }
    } catch (error) {
      console.error('Error saving OpenAI key:', error);
      toast({
        title: 'Save Failed',
        description: 'Could not save API key to project.',
        variant: 'destructive',
      });
    }
  };

  const handleInstallOllama = () => {
    // Open Ollama download page
    window.open('https://ollama.com/download', '_blank');
    toast({
      title: 'Opening Ollama Download',
      description: 'Download and run the installer, then return here.',
    });
  };

  const handleStartOllama = async () => {
    setOllamaInstalling(true);
    
    try {
      // Run ollama serve command
      const response = await fetch('/api/run-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-project-path': projectPath || '',
        },
        body: JSON.stringify({
          command: 'start',
          args: ['ollama', 'serve'],
        }),
      });

      if (response.ok) {
        toast({
          title: '✅ Ollama Server Starting',
          description: 'Ollama is now running in the background on port 11434.',
        });
      } else {
        throw new Error('Failed to start Ollama');
      }
    } catch (error) {
      console.error('Error starting Ollama:', error);
      toast({
        title: 'Start Failed',
        description: 'Make sure Ollama is installed first.',
        variant: 'destructive',
      });
    } finally {
      setOllamaInstalling(false);
    }
  };

  const handleDownloadOllamaModel = async () => {
    if (!ollamaModel) {
      toast({
        title: 'Select a Model',
        description: 'Please select a model to download.',
        variant: 'destructive',
      });
      return;
    }

    setOllamaDownloading(true);

    try {
      // Run ollama pull command
      const response = await fetch('/api/run-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-project-path': projectPath || '',
        },
        body: JSON.stringify({
          command: 'cmd',
          args: ['/c', 'start', 'cmd', '/k', `ollama pull ${ollamaModel}`],
        }),
      });

      if (response.ok) {
        toast({
          title: '📥 Downloading Model',
          description: `Pulling ${ollamaModel}... Check the terminal window for progress.`,
        });
      } else {
        throw new Error('Failed to download model');
      }
    } catch (error) {
      console.error('Error downloading model:', error);
      toast({
        title: 'Download Failed',
        description: 'Make sure Ollama server is running first.',
        variant: 'destructive',
      });
    } finally {
      setOllamaDownloading(false);
    }
  };

  const handleCopyEnvExample = (provider: 'gemini' | 'openai' | 'ollama') => {
    let content = '';
    
    if (provider === 'gemini') {
      content = `GOOGLE_GENAI_API_KEY=your_key_here\nGEMINI_MODEL=gemini-2.0-flash-exp`;
    } else if (provider === 'openai') {
      content = `OPENAI_API_KEY=your_key_here\nOPENAI_MODEL=gpt-4-turbo`;
    } else {
      content = `OLLAMA_HOST=http://localhost:11434\nOLLAMA_MODEL=llama2`;
    }
    
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied to clipboard!' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5" />
          Model Provider Setup
        </CardTitle>
        <CardDescription>
          Configure API keys and servers for Gemini, OpenAI, or local Ollama models
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gemini" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gemini">Gemini</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="ollama">Ollama (Local)</TabsTrigger>
          </TabsList>

          {/* Gemini Tab */}
          <TabsContent value="gemini" className="space-y-4">
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/50">
                <Key className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">Google AI Studio API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    Get your free API key from Google AI Studio
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Get API Key
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gemini-model">Select Model</Label>
                <Select value={geminiModel} onValueChange={setGeminiModel} disabled={loadingGeminiModels}>
                  <SelectTrigger id="gemini-model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {geminiModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{model.label}</span>
                          <span className="text-xs text-muted-foreground">{model.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingGeminiModels && (
                  <p className="text-xs text-muted-foreground">
                    Loading available models from Gemini API...
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gemini-key">Gemini API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="gemini-key"
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    disabled={geminiSaved}
                  />
                  <Button
                    onClick={handleSaveGeminiKey}
                    disabled={geminiSaved || !geminiKey}
                  >
                    {geminiSaved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Saved
                      </>
                    ) : (
                      'Save to .env'
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your key will be saved to .env file in your project
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyEnvExample('gemini')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy .env Template
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* OpenAI Tab */}
          <TabsContent value="openai" className="space-y-4">
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/50">
                <Key className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">OpenAI API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    Create an API key from your OpenAI account
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Get API Key
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="openai-model">Select Model</Label>
                <Select value={openaiModel} onValueChange={setOpenaiModel} disabled={loadingOpenAIModels}>
                  <SelectTrigger id="openai-model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {openaiModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{model.label}</span>
                          <span className="text-xs text-muted-foreground">{model.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingOpenAIModels && (
                  <p className="text-xs text-muted-foreground">
                    Loading available models from OpenAI API...
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="openai-key"
                    type="password"
                    placeholder="sk-..."
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    disabled={openaiSaved}
                  />
                  <Button
                    onClick={handleSaveOpenAIKey}
                    disabled={openaiSaved || !openaiKey}
                  >
                    {openaiSaved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Saved
                      </>
                    ) : (
                      'Save to .env'
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your key will be saved to .env file in your project
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyEnvExample('openai')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy .env Template
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Ollama Tab */}
          <TabsContent value="ollama" className="space-y-4">
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/50">
                <Download className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">Ollama Local Server</h3>
                  <p className="text-sm text-muted-foreground">
                    Run LLMs locally on your machine - completely private and offline
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleInstallOllama}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Ollama
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('https://ollama.com/library', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Browse Models
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ollama-model">Select Local Model</Label>
                  <Select value={ollamaModel} onValueChange={setOllamaModel}>
                    <SelectTrigger id="ollama-model">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ollamaModels.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          <div className="flex justify-between items-center w-full gap-4">
                            <div className="flex flex-col">
                              <span className="font-medium">{model.label}</span>
                              <span className="text-xs text-muted-foreground">{model.description}</span>
                            </div>
                            <span className="text-xs font-mono text-muted-foreground">{model.vram}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    VRAM requirements shown for each model
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Download className="w-5 h-5 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold">Download Selected Model</h3>
                    <p className="text-sm text-muted-foreground">
                      Pull the model to your local machine (requires Ollama server running)
                    </p>
                    <Button
                      onClick={handleDownloadOllamaModel}
                      disabled={ollamaDownloading}
                    >
                      {ollamaDownloading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Pull {ollamaModel}
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Terminal className="w-5 h-5 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold">Start Ollama Server</h3>
                    <p className="text-sm text-muted-foreground">
                      After installing, start the Ollama server to run models
                    </p>
                    <Button
                      onClick={handleStartOllama}
                      disabled={ollamaInstalling}
                    >
                      {ollamaInstalling ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Starting...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Ollama Serve
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Quick Start Commands</Label>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm space-y-1">
                    <div># Pull a model (after Ollama is running)</div>
                    <div className="text-primary">ollama pull {ollamaModel}</div>
                    <div className="mt-2"># Run a model</div>
                    <div className="text-primary">ollama run {ollamaModel}</div>
                    <div className="mt-2"># List installed models</div>
                    <div className="text-primary">ollama list</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyEnvExample('ollama')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy .env Template
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
