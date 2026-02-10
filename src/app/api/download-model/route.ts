import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Map of available models to their real download URLs
const MODEL_URLS: Record<string, string> = {
  'TinyLlama-1.1B-Chat-v1.0': 'https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf',
};

export async function POST(req: NextRequest) {
  try {
    const { projectPath, modelId } = await req.json();

    if (!projectPath || !modelId) {
      return NextResponse.json({ error: 'Missing projectPath or modelId' }, { status: 400 });
    }

    const modelUrl = MODEL_URLS[modelId];
    if (!modelUrl) {
      return NextResponse.json({ error: 'Invalid model ID' }, { status: 400 });
    }

    // Ensure models directory exists
    const modelsDir = path.join(projectPath, 'models');
    if (!fs.existsSync(modelsDir)) {
      try {
        fs.mkdirSync(modelsDir, { recursive: true });
      } catch (err) {
        return NextResponse.json({ error: 'Failed to create models directory' }, { status: 500 });
      }
    }

    const destinationPath = path.join(modelsDir, `${modelId}.gguf`);
    
    // Start the fetch from Hugging Face
    const response = await fetch(modelUrl);
    
    if (!response.ok || !response.body) {
      return NextResponse.json({ error: `Failed to fetch model: ${response.statusText}` }, { status: response.status });
    }

    const totalLength = response.headers.get('content-length');
    const contentLength = totalLength ? parseInt(totalLength, 10) : 0;

    // Create a TransformStream to track progress and pass data through
    const encoder = new TextEncoder();
    let receivedLength = 0;

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const fileStream = fs.createWriteStream(destinationPath);

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Write to disk
            fileStream.write(Buffer.from(value));

            // Update progress
            receivedLength += value.length;
            const progress = contentLength > 0 ? (receivedLength / contentLength) * 100 : 0;

            // Send progress update to client
            // We use a newline delimiter to separate JSON chunks
            const message = JSON.stringify({ progress, loaded: receivedLength, total: contentLength });
            controller.enqueue(encoder.encode(message + '\n'));
          }

          fileStream.end();
          controller.close();
        } catch (err) {
          console.error('Streaming error:', err);
          fileStream.destroy(err as Error);
          controller.error(err);
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('Download setup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
