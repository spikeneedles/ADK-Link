import { ModelEnvironmentBuilder } from '@/components/app/model-environment-builder';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function SafetyRailsPage() {
  return (
    <div className="p-4 md:p-8">
      <Card className="mb-8 border-0 shadow-none">
        <CardHeader className="p-0">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
                <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">Model Environment Builder</CardTitle>
              <CardDescription className="mt-2 max-w-2xl">
                Configure your LLM environment with safety rails, content filters, rate limiting, and security armor. Build a production-ready AI system with comprehensive protection.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      <ModelEnvironmentBuilder />
    </div>
  );
}
