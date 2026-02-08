'use server';

/**
 * @fileOverview Customize the AI model's personality to better fit the tone and style of the application.
 *
 * - customizeModelPersonality - A function that handles the model personality customization.
 * - CustomizeModelPersonalityInput - The input type for the customizeModelPersonality function.
 * - CustomizeModelPersonalityOutput - The return type for the customizeModelPersonality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomizeModelPersonalityInputSchema = z.object({
  personalityDescription: z
    .string()
    .describe('A description of the desired AI model personality.'),
  examplePrompts: z
    .string()
    .describe('Example prompts and expected responses to guide the personality.'),
});
export type CustomizeModelPersonalityInput = z.infer<
  typeof CustomizeModelPersonalityInputSchema
>;

const CustomizeModelPersonalityOutputSchema = z.object({
  updatedInstructions: z
    .string()
    .describe('The updated instructions for the AI model.'),
});
export type CustomizeModelPersonalityOutput = z.infer<
  typeof CustomizeModelPersonalityOutputSchema
>;

export async function customizeModelPersonality(
  input: CustomizeModelPersonalityInput
): Promise<CustomizeModelPersonalityOutput> {
  return customizeModelPersonalityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customizeModelPersonalityPrompt',
  input: {schema: CustomizeModelPersonalityInputSchema},
  output: {schema: CustomizeModelPersonalityOutputSchema},
  prompt: `You are an AI model personality customizer. You will take a description of the desired AI model personality and example prompts and responses and generate updated instructions for the AI model.

Desired Personality: {{{personalityDescription}}}

Example Prompts and Responses: {{{examplePrompts}}}

Updated Instructions:`,
});

const customizeModelPersonalityFlow = ai.defineFlow(
  {
    name: 'customizeModelPersonalityFlow',
    inputSchema: CustomizeModelPersonalityInputSchema,
    outputSchema: CustomizeModelPersonalityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
