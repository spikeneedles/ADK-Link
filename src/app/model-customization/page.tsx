import { ModelCustomizationForm } from '@/components/app/model-customization-form';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export default function ModelCustomizationPage() {
  return (
    <div className="p-4 md:p-8">
      <Card className="mb-8 border-0 shadow-none">
        <CardHeader className="p-0">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/10 rounded-lg">
                <Bot className="w-8 h-8 text-accent" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">Model Customization</CardTitle>
              <CardDescription className="mt-2 max-w-2xl">
                Define a unique personality for your AI model. Provide a description and examples to shape its tone, style, and responses.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <ModelCustomizationForm />
    </div>
  );
}
