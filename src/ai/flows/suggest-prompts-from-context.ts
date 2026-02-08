'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting prompts from a prompt library based on the current context of a program.
 *
 * - suggestPromptsFromContext - A function that takes program context as input and returns a list of suggested prompts.
 * - SuggestPromptsFromContextInput - The input type for the suggestPromptsFromContext function.
 * - SuggestPromptsFromContextOutput - The output type for the suggestPromptsFromContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPromptsFromContextInputSchema = z.object({
  programContext: z.string().describe('The current context of the program, e.g., code snippets, error messages, or descriptions of the task at hand.'),
});
export type SuggestPromptsFromContextInput = z.infer<typeof SuggestPromptsFromContextInputSchema>;

const SuggestPromptsFromContextOutputSchema = z.object({
  suggestedPrompts: z.array(z.string()).describe('A list of suggested prompts relevant to the program context.'),
});
export type SuggestPromptsFromContextOutput = z.infer<typeof SuggestPromptsFromContextOutputSchema>;

export async function suggestPromptsFromContext(input: SuggestPromptsFromContextInput): Promise<SuggestPromptsFromContextOutput> {
  return suggestPromptsFromContextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPromptsFromContextPrompt',
  input: {schema: SuggestPromptsFromContextInputSchema},
  output: {schema: SuggestPromptsFromContextOutputSchema},
  prompt: `You are an AI assistant that suggests relevant prompts from a prompt library based on the context of a program.

  Given the following program context:
  {{programContext}}

  Suggest a list of prompts that would be most helpful to the developer in this situation. Consider prompts related to debugging, code generation, documentation, and other common development tasks.
  Return only the prompts and nothing else. No intro or conclusion.
  `,
});

const suggestPromptsFromContextFlow = ai.defineFlow(
  {
    name: 'suggestPromptsFromContextFlow',
    inputSchema: SuggestPromptsFromContextInputSchema,
    outputSchema: SuggestPromptsFromContextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
