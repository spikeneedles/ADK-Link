'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  Filter, 
  Zap, 
  AlertTriangle, 
  CheckCircle2,
  Settings,
  Loader2,
  CloudOff, // New icon for blocking data
  Download,
  Check,
  Cpu
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useProject } from '@/contexts/project-context';
import { universalChat } from '@/ai/flows/universal-chat';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface SafetyConfig {
  // Content Safety
  contentFiltering: boolean;
  harmfulContentLevel: number;
  hateSpeechLevel: number;
  sexualContentLevel: number;
  violenceLevel: number;
  biasMitigation: number;
  
  // Security Armor
  inputSanitization: boolean;
  outputValidation: boolean;
  promptInjectionProtection: boolean;
  jailbreakDetection: boolean;
  hallucinationDetection: boolean;
  
  // Rate Limiting
  rateLimiting: boolean;
  requestsPerMinute: number;
  tokensPerRequest: number;
  
  // Privacy & Compliance
  piiDetection: boolean;
  dataRetention: boolean;
  auditLogging: boolean;
  blockExternalData: boolean; // New Feature
  
  // Model Behavior
  temperatureLimit: number;
  maxTokens: number;
  systemPromptLock: boolean;
}

export function ModelEnvironmentBuilder() {
  const { projectPath, isConnected } = useProject();
  const { toast } = useToast();
  
  const [config, setConfig] = useState<SafetyConfig>({
    // Content Safety
    contentFiltering: true,
    harmfulContentLevel: 3,
    hateSpeechLevel: 4,
    sexualContentLevel: 4,
    violenceLevel: 4,
    biasMitigation: 3,
    
    // Security Armor
    inputSanitization: true,
    outputValidation: true,
    promptInjectionProtection: true,
    jailbreakDetection: true,
    hallucinationDetection: true,
    
    // Rate Limiting
    rateLimiting: true,
    requestsPerMinute: 60,
    tokensPerRequest: 4000,
    
    // Privacy
    piiDetection: true,
    dataRetention: false,
    auditLogging: true,
    blockExternalData: true, // Default to true for max safety
    
    // Model Behavior
    temperatureLimit: 1.0,
    maxTokens: 8000,
    systemPromptLock: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([]);

  const [selectedModel, setSelectedModel] = useState<string>("");
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [modelDownloaded, setModelDownloaded] = useState(false);

  const handleDownloadModel = async () => {
    if (!isConnected || !projectPath) {
      toast({
        title: "Not Connected to Project",
        description: "Please connect to a project folder first.",
        variant: "destructive"
      });
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const response = await fetch('/api/download-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectPath,
          modelId: selectedModel
        }),
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      if (!response.body) throw new Error('ReadableStream not supported');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Process all complete lines
        buffer = lines.pop() || ''; // Keep the last partial line in buffer

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              if (data.progress) {
                setDownloadProgress(data.progress);
              }
            } catch (e) {
              console.warn('Error parsing progress:', e);
            }
          }
        }
      }

      setDownloadProgress(100);
      setIsDownloading(false);
      setModelDownloaded(true);
      toast({
        title: "Model Downloaded",
        description: `Successfully downloaded ${selectedModel} to /models folder.`,
      });
      
    } catch (error) {
      console.error(error);
      setIsDownloading(false);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const updateConfig = (key: keyof SafetyConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!isConnected || !projectPath) {
      toast({
        title: "Not Connected to Project",
        description: "Please click 'ADK Link' (top-left) to connect to a project folder first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedFiles([]);
    
    try {
      // Construct prompt based on config
      const prompt = `
Generate a comprehensive, production-ready implementation of an AI Model Environment based on this configuration:

--- Safety & Security Configuration ---
1. Content Safety:
   - Harmful Content Blocking (0-5): ${config.harmfulContentLevel}
   - Hate Speech Blocking (0-5): ${config.hateSpeechLevel}
   - Sexual Content Blocking (0-5): ${config.sexualContentLevel}
   - Violence Blocking (0-5): ${config.violenceLevel}
   - Bias Mitigation (0-5 Stubbornness): ${config.biasMitigation}

2. Security Armor:
   - Input Sanitization: ${config.inputSanitization}
   - Output Validation: ${config.outputValidation}
   - Prompt Injection Protection: ${config.promptInjectionProtection}
   - Jailbreak Detection: ${config.jailbreakDetection}
   - Hallucination Detection: ${config.hallucinationDetection}
   - System Prompt Lock: ${config.systemPromptLock}

3. Rate Limits:
   - Requests/Min: ${config.requestsPerMinute}
   - Tokens/Request: ${config.tokensPerRequest}
   - Temperature Limit: ${config.temperatureLimit}

4. Privacy & Compliance:
   - PII Detection/Redaction: ${config.piiDetection}
   - Data Retention Policy: ${config.dataRetention ? 'Review & Delete' : 'Keep'}
   - Audit Logging: ${config.auditLogging}
   - **BLOCK EXTERNAL DATA EXFILTRATION**: ${config.blockExternalData} (CRITICAL: Ensure no data leaves the environment context)

--- Instructions ---
Create a robust implementation (e.g., Python class wrapper, Middleware, or Config file) that enforces these rules.
If the project language is detectable, use it. Otherwise default to a Python 'ModelEnvironment' class.
The implementation MUST include specific logic for 'Block External Data' if enabled (e.g., network blocking, egress filtering).
      `;

      const result = await universalChat({
        history: [{ role: 'user', content: prompt }],
        projectPath: projectPath,
        // Let Rosetta infer language or default to Python for backend logic usually
        targetLanguage: 'python', 
      });

      // Write files
      if (result.files && result.files.length > 0) {
        const newFiles = [];
        for (const file of result.files) {
            const fullPath = `${projectPath}\\${file.path}`;
            const apiResponse = await fetch('/api/write-file', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'x-project-path': projectPath
              },
              body: JSON.stringify({ path: fullPath, content: file.content }),
            });
            
            if (apiResponse.ok) {
              newFiles.push(file.path);
            } else {
               const err = await apiResponse.json();
               console.error("Write error:", err);
               toast({
                 title: "Write Failed",
                 description: err.message,
                 variant: "destructive"
               });
            }
        }
        setGeneratedFiles(newFiles);
        toast({
          title: "Environment Generated",
          description: `Successfully created ${newFiles.length} files in your project.`,
        });
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "Generation Failed",
        description: "Could not generate model environment.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getSafetyLevel = () => {
    const activeFeatures = Object.values(config).filter(v => v === true || (typeof v === 'number' && v > 0)).length;
    // Adjust scoring for sliders (they count as active if > 0)
    // 5 sliders + 8 boolean switches + 3 rate limits = ~16 total possible points
    if (activeFeatures >= 14) return { level: 'Maximum', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/20' };
    if (activeFeatures >= 10) return { level: 'High', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' };
    if (activeFeatures >= 6) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950/20' };
    return { level: 'Low', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/20' };
  };

  const safety = getSafetyLevel();

  return (
    <div className="space-y-6">
      {/* Safety Level Indicator */}
      <Card className={safety.bg}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className={`w-6 h-6 ${safety.color}`} />
              <div>
                <CardTitle className={safety.color}>Security Level: {safety.level}</CardTitle>
                <CardDescription>Current environment protection status</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className={safety.color}>{safety.level}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            Model Selection
          </CardTitle>
          <CardDescription>
            Select and download open-source models to run in your local environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="model-select">Select Model</Label>
              <Select onValueChange={setSelectedModel} value={selectedModel} disabled={isDownloading || modelDownloaded}>
                <SelectTrigger id="model-select">
                  <SelectValue placeholder="Select a model..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TinyLlama-1.1B-Chat-v1.0">TinyLlama-1.1B-Chat-v1.0 (637MB)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedModel && !modelDownloaded && (
              <Button onClick={handleDownloadModel} disabled={isDownloading}>
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading... {Math.round(downloadProgress)}%
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
            )}

            {modelDownloaded && (
              <Button variant="secondary" disabled className="text-green-600 dark:text-green-400">
                <Check className="mr-2 h-4 w-4" />
                Downloaded
              </Button>
            )}
          </div>

          {isDownloading && (
            <div className="mt-4 space-y-2">
              <Progress value={downloadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {Math.round((downloadProgress / 100) * 637)} MB / 637 MB
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content Safety</TabsTrigger>
          <TabsTrigger value="armor">Security Armor</TabsTrigger>
          <TabsTrigger value="limits">Rate & Limits</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Compliance</TabsTrigger>
        </TabsList>

        {/* Content Safety Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Content Filtering
              </CardTitle>
              <CardDescription>
                Control what types of content the model can generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="content-filtering">Enable Content Filtering</Label>
                <Switch
                  id="content-filtering"
                  checked={config.contentFiltering}
                  onCheckedChange={(v) => updateConfig('contentFiltering', v)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Harmful Content Threshold</Label>
                    <Badge variant="outline">{config.harmfulContentLevel === 0 ? 'Off' : `${config.harmfulContentLevel}/5`}</Badge>
                  </div>
                  <Slider
                    value={[config.harmfulContentLevel]}
                    onValueChange={(v) => updateConfig('harmfulContentLevel', v[0])}
                    min={0}
                    max={5}
                    step={1}
                    disabled={!config.contentFiltering}
                  />
                  <p className="text-xs text-muted-foreground">
                    0 = Off, 1 = Permissive, 5 = Strictest blocking
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Hate Speech Detection</Label>
                    <Badge variant="outline">{config.hateSpeechLevel === 0 ? 'Off' : `${config.hateSpeechLevel}/5`}</Badge>
                  </div>
                  <Slider
                    value={[config.hateSpeechLevel]}
                    onValueChange={(v) => updateConfig('hateSpeechLevel', v[0])}
                    min={0}
                    max={5}
                    step={1}
                    disabled={!config.contentFiltering}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Sexual Content Filter</Label>
                    <Badge variant="outline">{config.sexualContentLevel === 0 ? 'Off' : `${config.sexualContentLevel}/5`}</Badge>
                  </div>
                  <Slider
                    value={[config.sexualContentLevel]}
                    onValueChange={(v) => updateConfig('sexualContentLevel', v[0])}
                    min={0}
                    max={5}
                    step={1}
                    disabled={!config.contentFiltering}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Violence & Gore Filter</Label>
                    <Badge variant="outline">{config.violenceLevel === 0 ? 'Off' : `${config.violenceLevel}/5`}</Badge>
                  </div>
                  <Slider
                    value={[config.violenceLevel]}
                    onValueChange={(v) => updateConfig('violenceLevel', v[0])}
                    min={0}
                    max={5}
                    step={1}
                    disabled={!config.contentFiltering}
                  />
                </div>

                <Separator />

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label>Bias Mitigation</Label>
                      <p className="text-xs text-muted-foreground">
                        Control how actively the model suppresses bias
                      </p>
                    </div>
                    <Badge variant="outline">{config.biasMitigation === 0 ? 'Off' : `${config.biasMitigation}/5`}</Badge>
                  </div>
                  <Slider
                    value={[config.biasMitigation]}
                    onValueChange={(v) => updateConfig('biasMitigation', v[0])}
                    min={0}
                    max={5}
                    step={1}
                    disabled={!config.contentFiltering}
                  />
                  <p className="text-xs text-muted-foreground flex justify-between">
                    <span>0 = Raw / Unfiltered</span>
                    <span>5 = Maximum Stubbornness</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Armor Tab */}
        <TabsContent value="armor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security Armor
              </CardTitle>
              <CardDescription>
                Protect against attacks, injections, and malicious use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Input Sanitization</Label>
                  <p className="text-xs text-muted-foreground">
                    Clean and validate all user inputs before processing
                  </p>
                </div>
                <Switch
                  checked={config.inputSanitization}
                  onCheckedChange={(v) => updateConfig('inputSanitization', v)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Output Validation</Label>
                  <p className="text-xs text-muted-foreground">
                    Verify model outputs before sending to users
                  </p>
                </div>
                <Switch
                  checked={config.outputValidation}
                  onCheckedChange={(v) => updateConfig('outputValidation', v)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Hallucination Detection</Label>
                  <p className="text-xs text-muted-foreground">
                    Cross-reference outputs to reduce factual errors
                  </p>
                </div>
                <Switch
                  checked={config.hallucinationDetection}
                  onCheckedChange={(v) => updateConfig('hallucinationDetection', v)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Prompt Injection Protection</Label>
                  <p className="text-xs text-muted-foreground">
                    Detect and block prompt injection attempts
                  </p>
                </div>
                <Switch
                  checked={config.promptInjectionProtection}
                  onCheckedChange={(v) => updateConfig('promptInjectionProtection', v)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Jailbreak Detection</Label>
                  <p className="text-xs text-muted-foreground">
                    Identify and prevent jailbreak attempts
                  </p>
                </div>
                <Switch
                  checked={config.jailbreakDetection}
                  onCheckedChange={(v) => updateConfig('jailbreakDetection', v)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Prompt Lock</Label>
                  <p className="text-xs text-muted-foreground">
                    Prevent users from modifying system instructions
                  </p>
                </div>
                <Switch
                  checked={config.systemPromptLock}
                  onCheckedChange={(v) => updateConfig('systemPromptLock', v)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rate & Limits Tab */}
        <TabsContent value="limits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Rate Limiting & Quotas
              </CardTitle>
              <CardDescription>
                Control resource usage and prevent abuse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label>Enable Rate Limiting</Label>
                <Switch
                  checked={config.rateLimiting}
                  onCheckedChange={(v) => updateConfig('rateLimiting', v)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Requests Per Minute</Label>
                  <Badge variant="outline">{config.requestsPerMinute} req/min</Badge>
                </div>
                <Slider
                  value={[config.requestsPerMinute]}
                  onValueChange={(v) => updateConfig('requestsPerMinute', v[0])}
                  min={10}
                  max={300}
                  step={10}
                  disabled={!config.rateLimiting}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Maximum Tokens Per Request</Label>
                  <Badge variant="outline">{config.tokensPerRequest} tokens</Badge>
                </div>
                <Slider
                  value={[config.tokensPerRequest]}
                  onValueChange={(v) => updateConfig('tokensPerRequest', v[0])}
                  min={500}
                  max={16000}
                  step={500}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Temperature Limit</Label>
                  <Badge variant="outline">{config.temperatureLimit.toFixed(1)}</Badge>
                </div>
                <Slider
                  value={[config.temperatureLimit * 100]}
                  onValueChange={(v) => updateConfig('temperatureLimit', v[0] / 100)}
                  min={0}
                  max={200}
                  step={10}
                />
                <p className="text-xs text-muted-foreground">
                  Lower = More deterministic, Higher = More creative
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy & Compliance Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Privacy & Compliance
              </CardTitle>
              <CardDescription>
                GDPR, CCPA, and data protection features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-destructive font-bold flex items-center gap-2">
                        <CloudOff className="w-4 h-4" />
                        Block External Data Exfiltration
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Strictly block any data from being sent outside the project environment.
                    </p>
                  </div>
                  <Switch
                    checked={config.blockExternalData}
                    onCheckedChange={(v) => updateConfig('blockExternalData', v)}
                    className="data-[state=checked]:bg-destructive"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>PII Detection & Redaction</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically detect and remove personally identifiable information
                  </p>
                </div>
                <Switch
                  checked={config.piiDetection}
                  onCheckedChange={(v) => updateConfig('piiDetection', v)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Data Retention Controls</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatic deletion of conversation data after specified period
                  </p>
                </div>
                <Switch
                  checked={config.dataRetention}
                  onCheckedChange={(v) => updateConfig('dataRetention', v)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Audit Logging</Label>
                  <p className="text-xs text-muted-foreground">
                    Log all requests for compliance and debugging
                  </p>
                </div>
                <Switch
                  checked={config.auditLogging}
                  onCheckedChange={(v) => updateConfig('auditLogging', v)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate Implementation Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating & Writing to Project...
              </>
            ) : (
              <>
                <Settings className="mr-2 h-5 w-5" />
                Generate & Implement Model Environment
              </>
            )}
          </Button>
          
          {generatedFiles.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Successfully Implemented in: {projectPath?.split(/[/\\]/).pop()}
                </div>
                <ul className="list-disc list-inside text-sm text-green-600 dark:text-green-300">
                    {generatedFiles.map(file => (
                        <li key={file}>{file}</li>
                    ))}
                </ul>
            </div>
          )}

          <p className="text-xs text-center text-muted-foreground mt-3">
            AI will generate production-ready code implementing your selected safety features and save it directly to your connected project folder.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
