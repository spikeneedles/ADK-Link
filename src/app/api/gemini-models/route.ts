import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Fetch available models from Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filter and format models for text generation
    const models = data.models
      .filter((model: any) => {
        // Only include models that support generateContent
        const supportsGeneration = model.supportedGenerationMethods?.includes('generateContent');
        // Exclude embedding models and other non-chat models
        const isTextModel = !model.name.includes('embedding') && 
                           !model.name.includes('aqa') &&
                           !model.name.includes('vision');
        return supportsGeneration && isTextModel;
      })
      .map((model: any) => ({
        value: model.name.replace('models/', ''), // Remove 'models/' prefix
        label: model.displayName || model.name.replace('models/', ''),
        description: model.description || 'Gemini model',
        version: model.version,
      }))
      .sort((a: any, b: any) => {
        // Sort by version (newer first), then name
        if (a.version && b.version) {
          return b.version.localeCompare(a.version);
        }
        return a.label.localeCompare(b.label);
      });

    return NextResponse.json({ models });
  } catch (error) {
    console.error('[API/gemini-models] Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch models',
        fallback: true,
        models: [
          { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (Experimental)', description: 'Latest experimental' },
          { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', description: 'Fast, efficient' },
          { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', description: 'Most capable' },
        ]
      },
      { status: 200 } // Return fallback models instead of error
    );
  }
}
