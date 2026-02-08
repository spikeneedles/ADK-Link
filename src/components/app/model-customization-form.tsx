"use client";

import { customizeModelPersonality } from "@/ai/flows/customize-model-personality";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Copy, LoaderCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const formSchema = z.object({
  personalityDescription: z.string().min(10, "Please describe the personality."),
  examplePrompts: z.string().min(10, "Please provide at least one example."),
});

type FormValues = z.infer<typeof formSchema>;

export function ModelCustomizationForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalityDescription: "",
      examplePrompts: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setResult(null);
    try {
      const output = await customizeModelPersonality(values);
      setResult(output.updatedInstructions);
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Failed to customize model. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Instructions copied to clipboard!" });
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="personalityDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Desired Personality</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., A witty and slightly sarcastic assistant who is an expert in Python."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe the personality you want the AI model to have.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="examplePrompts"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Example Prompts & Responses</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="User: How do I sort a list?\nAI: You could read the docs... or just use the .sort() method."
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide examples of how the AI should respond to guide its personality.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Customize Model
          </Button>
        </form>
      </Form>

      {loading && (
        <Card className="mt-8">
          <CardContent className="flex items-center justify-center p-16">
            <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
          </CardContent>
        </Card>
      )}
      
      {result && (
        <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Generated Instructions</h2>
            <Card>
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle>Updated System Instructions</CardTitle>
                        <CardDescription>Use these instructions as the system prompt for your model.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(result)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm whitespace-pre-wrap">{result}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
