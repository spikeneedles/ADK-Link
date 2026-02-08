
"use client";

import { generateAiSafetyRails } from "@/ai/flows/generate-ai-safety-rails";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Code, Copy, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

const safetyLevels = [
  { id: "fairness", label: "Fairness" },
  { id: "privacy", label: "Privacy" },
  { id: "security", label: "Security" },
  { id: "profanity-filter", label: "Profanity Filter" },
  { id: "fact-checking", label: "Fact Checking" },
] as const;

const sliderLevels = [
    { value: 0, label: "None" },
    { value: 1, label: "Low" },
    { value: 2, label: "Medium" },
    { value: 3, label: "High" },
    { value: 4, label: "All" },
] as const;

const safetyCategoryIds = safetyLevels.map(s => s.id);

const formSchema = z.object({
  applicationDescription: z.string().min(20, "Please provide a more detailed description."),
  desiredSafetyLevels: z.object(
    Object.fromEntries(
        safetyCategoryIds.map(id => [id, z.number().min(0).max(4).default(0)])
    ) as { [key in typeof safetyCategoryIds[number]]: z.ZodNumber }
  ),
});

type FormValues = z.infer<typeof formSchema>;

type SafetyRailsOutput = {
  safetyRailsCode: string;
  explanation: string;
}

function SafetySlider({ idPrefix, value, onChange }: { idPrefix: string, value: number; onChange: (value: number) => void }) {
  return (
    <RadioGroup
      value={String(value)}
      onValueChange={(val) => onChange(parseInt(val, 10))}
      className="safety-slider"
    >
      <div className="safety-slider-track" />
      {sliderLevels.map((level) => (
        <div key={level.value} className="safety-slider-item">
            <FormControl>
                <RadioGroupItem value={String(level.value)} id={`${idPrefix}-${level.value}`} className="safety-slider-radio"/>
            </FormControl>
            <Label htmlFor={`${idPrefix}-${level.value}`} className="safety-slider-label">
                {level.label}
            </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

export function SafetyRailsForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SafetyRailsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicationDescription: "",
      desiredSafetyLevels: {
        fairness: 0,
        privacy: 0,
        security: 0,
        "profanity-filter": 0,
        "fact-checking": 0,
      },
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setResult(null);
    
    const levelMap: Record<number, string> = {
        0: "None",
        1: "Low",
        2: "Medium",
        3: "High",
        4: "All",
    };

    const desiredSafetyLevels = Object.entries(values.desiredSafetyLevels)
        .filter(([, value]) => value > 0)
        .map(([key, value]) => {
            const safetyLevelLabel = safetyLevels.find(s => s.id === key)?.label || key;
            const blockLevelLabel = levelMap[value as keyof typeof levelMap];
            return `${safetyLevelLabel}: ${blockLevelLabel}`;
        });

    try {
      const output = await generateAiSafetyRails({
        applicationDescription: values.applicationDescription,
        desiredSafetyLevels,
      });
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Failed to generate safety rails. Please try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to clipboard!",
    });
  };


  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="applicationDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Application Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., A customer service chatbot for an e-commerce store that helps users with their orders."
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe your application in detail. The more context you provide, the better the generated safety rails will be.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <div className="mb-4">
                <FormLabel className="text-lg">Desired Safety Levels</FormLabel>
                <FormDescription>
                Adjust the blocking level for each safety category.
                </FormDescription>
            </div>
            <div className="space-y-6">
                {safetyLevels.map((item) => (
                    <FormField
                        key={item.id}
                        control={form.control}
                        name={`desiredSafetyLevels.${item.id}`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{item.label}</FormLabel>
                                <SafetySlider idPrefix={item.id} value={field.value} onChange={field.onChange} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
            </div>
          </FormItem>


          <Button type="submit" disabled={loading}>
            {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Generate Rails
          </Button>
        </form>
      </Form>
      
      {loading && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Generating...</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-16">
                <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
            </CardContent>
        </Card>
      )}

      {result && (
        <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Generated Safety Rails</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Explanation</CardTitle>
                    <CardDescription>How these rails address your specified safety levels.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{result.explanation}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2"><Code /> Generated Code</CardTitle>
                        <CardDescription>Copy and integrate this TypeScript code into your application.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(result.safetyRailsCode)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="bg-muted/50 rounded-lg">
                    <pre className="p-4 rounded-md overflow-x-auto"><code className="font-code text-sm">{result.safetyRailsCode}</code></pre>
                </CardContent>
            </Card>
        </div>
      )}
    </>
  );
}
