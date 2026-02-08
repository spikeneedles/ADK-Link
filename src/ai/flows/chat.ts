'use server';
/**
 * @fileOverview A simple chat flow that interacts with the Gemini model.
 *
 * - chat - A function that takes chat history and a new message, and returns the model's response.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {MessageData} from 'genkit';

const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).describe("The chat history."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("The model's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const history: MessageData[] = input.history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user', // genkit uses 'model' for assistant
      content: [{text: msg.content}]
    }));

    const {output} = await ai.generate({
      prompt: "You are a helpful AI assistant integrated into a developer tool called ADK Link. Respond to the user's query.",
      history: history,
      model: 'googleai/gemini-2.5-flash',
    });

    return {
      response: output!.text,
    };
  }
);
