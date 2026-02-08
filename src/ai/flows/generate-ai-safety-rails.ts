'use server';
/**
 * @fileOverview Generates AI safety rails based on the application's specifics.
 *
 * - generateAiSafetyRails - A function that generates AI safety rails.
 * - GenerateAiSafetyRailsInput - The input type for the generateAiSafetyRails function.
 * - GenerateAiSafetyRailsOutput - The return type for the generateAiSafetyRails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiSafetyRailsInputSchema = z.object({
  applicationDescription: z
    .string()
    .describe('A detailed description of the application.'),
  desiredSafetyLevels: z
    .array(z.string())
    .describe(
      'A list of desired safety levels, such as fairness, privacy, and security.'
    ),
});
export type GenerateAiSafetyRailsInput = z.infer<typeof GenerateAiSafetyRailsInputSchema>;

const GenerateAiSafetyRailsOutputSchema = z.object({
  safetyRailsCode: z
    .string()
    .describe(
      'The generated code for implementing the AI safety rails in the application.'
    ),
  explanation: z
    .string()
    .describe(
      'An explanation of the implemented safety rails and how they address the specified safety levels.'
    ),
});
export type GenerateAiSafetyRailsOutput = z.infer<typeof GenerateAiSafetyRailsOutputSchema>;

export async function generateAiSafetyRails(
  input: GenerateAiSafetyRailsInput
): Promise<GenerateAiSafetyRailsOutput> {
  return generateAiSafetyRailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiSafetyRailsPrompt',
  input: {schema: GenerateAiSafetyRailsInputSchema},
  output: {schema: GenerateAiSafetyRailsOutputSchema},
  prompt: `You are an AI safety expert. Your task is to generate AI safety rails for a given application based on its description and the desired safety levels.

Application Description: {{{applicationDescription}}}
Desired Safety Levels: {{#each desiredSafetyLevels}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Based on the above information, generate the code for the AI safety rails and provide an explanation of how these rails address the specified safety levels. The code should be well-documented and easy to integrate into the application.

Here's an example:
```typescript
// Safety rail to check for profanity in user input
function checkForProfanity(input: string): boolean {
  const profanityList = ["badword1", "badword2", "badword3"]; // Example list
  return profanityList.some(word => input.includes(word));
}

// Apply the safety rail before processing the input
function processInput(input: string): string {
  if (checkForProfanity(input)) {
    throw new Error("Profanity detected in input.");
  }
  return input;
}
```

Make sure to include similar Typescript code to help illustrate your approach.
`,
});

const generateAiSafetyRailsFlow = ai.defineFlow(
  {
    name: 'generateAiSafetyRailsFlow',
    inputSchema: GenerateAiSafetyRailsInputSchema,
    outputSchema: GenerateAiSafetyRailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
