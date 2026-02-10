import { ai } from '@/ai/genkit';
import { MessageData } from 'genkit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { messages } = await request.json();

        if (!Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Add system prompt
        const systemPrompt = "You are a helpful AI assistant powered by Gemini 2.5 Flash, integrated into ADK Link developer tool. Respond helpfully and conversationally.";

        const genkitMessages: MessageData[] = [
            { role: 'user', content: [{ text: systemPrompt }] },
            ...messages.map((msg: any) => ({
                role: (msg.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
                content: [{ text: msg.content }]
            }))
        ];

        // Create a streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Use streamFlow for streaming responses
                    const { stream: responseStream } = await ai.generateStream({
                        messages: genkitMessages,
                        model: 'googleai/gemini-2.5-flash',
                        config: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                        },
                    });

                    // Stream the response
                    for await (const chunk of responseStream) {
                        const text = chunk.text;
                        if (text) {
                            const data = JSON.stringify({ content: text, done: false });
                            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                        }
                    }

                    // Send completion signal
                    const doneData = JSON.stringify({ content: '', done: true });
                    controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
                    controller.close();

                } catch (error: any) {
                    console.error('[Chat Stream Error]:', error);
                    const errorData = JSON.stringify({
                        error: error.message || 'Failed to generate response',
                        done: true
                    });
                    controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error: any) {
        console.error('[Chat API Error]:', error);
        return new Response(
            JSON.stringify({ error: error.message || 'Internal server error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
