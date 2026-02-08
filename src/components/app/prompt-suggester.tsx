"use client";

import { suggestPromptsFromContext } from "@/ai/flows/suggest-prompts-from-context";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Copy, Lightbulb, LoaderCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  programContext: z.string().min(10, "Please provide some context."),
});

type FormValues = z.infer<typeof formSchema>;

export function PromptSuggester() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programContext: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setSuggestions([]);
    try {
      const result = await suggestPromptsFromContext(values);
      setSuggestions(result.suggestedPrompts);
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Failed to suggest prompts. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  }
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Prompt copied to clipboard!" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="programContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Context</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste a code snippet, error message, or task description here..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The AI will suggest relevant prompts based on this context.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Suggest Prompts
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <div className="text-center p-8">
          <LoaderCircle className="mx-auto w-8 h-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Generating suggestions...</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="text-primary w-5 h-5"/>
                Suggested Prompts
            </h3>
            <div className="space-y-2">
            {suggestions.map((prompt, index) => (
                <Card key={index} className="bg-muted/50">
                    <div className="p-3 flex items-start justify-between gap-2">
                        <p className="font-code text-sm flex-1">{prompt}</p>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleCopy(prompt)}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </Card>
            ))}
            </div>
        </div>
      )}
    </div>
  );
}
