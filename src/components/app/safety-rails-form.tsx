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
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Code, Copy, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const safetyLevels = [
  { id: "fairness", label: "Fairness" },
  { id: "privacy", label: "Privacy" },
  { id: "security", label: "Security" },
  { id: "profanity-filter", label: "Profanity Filter" },
  { id: "fact-checking", label: "Fact Checking" },
] as const;

const formSchema = z.object({
  applicationDescription: z.string().min(20, "Please provide a more detailed description."),
  desiredSafetyLevels: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
});

type FormValues = z.infer<typeof formSchema>;

type SafetyRailsOutput = {
  safetyRailsCode: string;
  explanation: string;
}

export function SafetyRailsForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SafetyRailsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicationDescription: "",
      desiredSafetyLevels: [],
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setResult(null);
    try {
      const output = await generateAiSafetyRails(values);
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

          <FormField
            control={form.control}
            name="desiredSafetyLevels"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-lg">Desired Safety Levels</FormLabel>
                  <FormDescription>
                    Select the safety levels you want to implement.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {safetyLevels.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="desiredSafetyLevels"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

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
