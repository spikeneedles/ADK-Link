'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Download,
  Code2,
  Boxes,
  Smartphone,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SDK {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Mobile';
  description: string;
  downloadUrl: string;
  docsUrl?: string;
  icon: any;
  version?: string;
  frameworks: string[];
  installCommand?: string;
}

const SDKs: SDK[] = [
  // Frontend SDKs
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Frontend',
    description: 'JavaScript runtime for Next.js, React, Vue, Svelte, Astro',
    downloadUrl: 'https://nodejs.org/en/download',
    docsUrl: 'https://nodejs.org/docs',
    icon: Code2,
    version: 'LTS 20.x',
    frameworks: ['Next.js', 'React', 'Vue', 'Svelte', 'HTML+Tailwind', 'Astro', 'Express', 'NestJS'],
    installCommand: 'node --version',
  },
  
  // Backend SDKs
  {
    id: 'python',
    name: 'Python',
    category: 'Backend',
    description: 'Programming language for FastAPI, Django, CLI tools',
    downloadUrl: 'https://www.python.org/downloads/',
    docsUrl: 'https://docs.python.org/',
    icon: Code2,
    version: '3.12+',
    frameworks: ['FastAPI', 'Django', 'Python CLI'],
    installCommand: 'python --version',
  },
  {
    id: 'go',
    name: 'Go',
    category: 'Backend',
    description: 'Programming language for high-performance CLI tools',
    downloadUrl: 'https://go.dev/dl/',
    docsUrl: 'https://go.dev/doc/',
    icon: Code2,
    version: '1.21+',
    frameworks: ['Go CLI'],
    installCommand: 'go version',
  },
  {
    id: 'rust',
    name: 'Rust',
    category: 'Backend',
    description: 'Systems programming language for fast, safe CLI tools',
    downloadUrl: 'https://www.rust-lang.org/tools/install',
    docsUrl: 'https://doc.rust-lang.org/',
    icon: Code2,
    version: 'Latest',
    frameworks: ['Rust CLI'],
    installCommand: 'rustc --version',
  },
  
  // Mobile SDKs
  {
    id: 'flutter',
    name: 'Flutter SDK',
    category: 'Mobile',
    description: 'UI toolkit for cross-platform mobile apps',
    downloadUrl: 'https://docs.flutter.dev/get-started/install',
    docsUrl: 'https://docs.flutter.dev/',
    icon: Smartphone,
    version: '3.x',
    frameworks: ['Flutter'],
    installCommand: 'flutter --version',
  },
  {
    id: 'android-studio',
    name: 'Android Studio',
    category: 'Mobile',
    description: 'Official IDE for Android development with Kotlin',
    downloadUrl: 'https://developer.android.com/studio',
    docsUrl: 'https://developer.android.com/docs',
    icon: Smartphone,
    version: 'Latest',
    frameworks: ['Android Kotlin'],
    installCommand: 'adb --version',
  },
  {
    id: 'react-native-cli',
    name: 'React Native CLI',
    category: 'Mobile',
    description: 'Command-line tools for React Native development',
    downloadUrl: 'https://reactnative.dev/docs/environment-setup',
    docsUrl: 'https://reactnative.dev/docs/getting-started',
    icon: Smartphone,
    version: 'Latest',
    frameworks: ['React Native'],
    installCommand: 'npx react-native --version',
  },
  {
    id: 'expo',
    name: 'Expo CLI',
    category: 'Mobile',
    description: 'Simplified React Native development platform',
    downloadUrl: 'https://docs.expo.dev/get-started/installation/',
    docsUrl: 'https://docs.expo.dev/',
    icon: Smartphone,
    version: 'Latest',
    frameworks: ['React Native'],
    installCommand: 'npx expo --version',
  },
  
  // Additional Build Tools
  {
    id: 'java-jdk',
    name: 'Java JDK',
    category: 'Mobile',
    description: 'Java Development Kit required for Android development',
    downloadUrl: 'https://www.oracle.com/java/technologies/downloads/',
    docsUrl: 'https://docs.oracle.com/en/java/',
    icon: Code2,
    version: '17+',
    frameworks: ['Android Kotlin'],
    installCommand: 'java --version',
  },
  {
    id: 'gradle',
    name: 'Gradle',
    category: 'Mobile',
    description: 'Build automation tool for Android projects',
    downloadUrl: 'https://gradle.org/install/',
    docsUrl: 'https://docs.gradle.org/',
    icon: Boxes,
    version: '8.x',
    frameworks: ['Android Kotlin'],
    installCommand: 'gradle --version',
  },
];

export function FrameworkSDKs() {
  const { toast } = useToast();

  const handleDownload = (sdk: SDK) => {
    window.open(sdk.downloadUrl, '_blank');
    toast({
      title: `Opening ${sdk.name} Download`,
      description: 'Download and install, then return to ADK Link.',
    });
  };

  const handleDocs = (sdk: SDK) => {
    if (sdk.docsUrl) {
      window.open(sdk.docsUrl, '_blank');
    }
  };

  const categories = ['Frontend', 'Backend', 'Mobile'] as const;

  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const sdks = SDKs.filter(sdk => sdk.category === category);
        if (sdks.length === 0) return null;

        return (
          <div key={category}>
            <div className="mb-4">
              <h2 className="text-2xl font-bold tracking-tight">{category} SDKs</h2>
              <p className="text-muted-foreground text-sm">
                Development kits and tools for {category.toLowerCase()} frameworks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sdks.map((sdk) => {
                const Icon = sdk.icon;
                return (
                  <Card key={sdk.id} className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{sdk.name}</CardTitle>
                            {sdk.version && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                {sdk.version}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <CardDescription className="mt-2">
                        {sdk.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Frameworks this SDK supports */}
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">
                          Required for:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {sdk.frameworks.map((framework) => (
                            <Badge key={framework} variant="secondary" className="text-xs">
                              {framework}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Install command */}
                      {sdk.installCommand && (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-muted-foreground">
                            Verify installation:
                          </p>
                          <code className="block text-xs bg-muted p-2 rounded font-mono">
                            {sdk.installCommand}
                          </code>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleDownload(sdk)}
                          className="flex-1"
                          size="sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        {sdk.docsUrl && (
                          <Button
                            onClick={() => handleDocs(sdk)}
                            variant="outline"
                            size="sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
