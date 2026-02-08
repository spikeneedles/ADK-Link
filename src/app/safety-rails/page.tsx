import { SafetyRailsForm } from '@/components/app/safety-rails-form';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function SafetyRailsPage() {
  return (
    <div className="p-4 md:p-8">
      <Card className="mb-8 border-0 shadow-none">
        <CardHeader className="p-0">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
                <ShieldCheck className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">AI Safety Rails</CardTitle>
              <CardDescription className="mt-2 max-w-2xl">
                Generate AI safety rails for your application. Describe your application and select desired safety levels to get started. The AI will generate code and an explanation for implementing these guardrails.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      <SafetyRailsForm />
    </div>
  );
}
