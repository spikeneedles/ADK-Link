import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Fetch available models from OpenAI API
    const response = await fetch(
      'https://api.openai.com/v1/models',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filter and format models for chat/text generation
    const models = data.data
      .filter((model: any) => {
        // Only include GPT models for chat/completion
        const isGPTModel = model.id.includes('gpt-4') || model.id.includes('gpt-3.5-turbo');
        // Exclude deprecated, instruct-only, and special variants
        const notDeprecated = !model.id.includes('0314') && 
                             !model.id.includes('0613') && 
                             !model.id.includes('instruct') &&
                             !model.id.includes('vision');
        return isGPTModel && notDeprecated;
      })
      .map((model: any) => {
        // Create friendly labels
        let label = model.id;
        let description = 'OpenAI model';
        
        if (model.id.includes('gpt-4-turbo')) {
          label = 'GPT-4 Turbo';
          description = 'Latest GPT-4 with 128K context';
        } else if (model.id.includes('gpt-4o')) {
          label = 'GPT-4o';
          description = 'Multimodal flagship model';
        } else if (model.id === 'gpt-4') {
          label = 'GPT-4';
          description = 'Most capable model';
        } else if (model.id.includes('gpt-3.5-turbo')) {
          label = 'GPT-3.5 Turbo';
          description = 'Fast and cost-effective';
        }
        
        return {
          value: model.id,
          label,
          description,
          created: model.created,
        };
      })
      .sort((a: any, b: any) => {
        // Sort by creation date (newest first)
        return b.created - a.created;
      });

    return NextResponse.json({ models });
  } catch (error) {
    console.error('[API/openai-models] Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch models',
        fallback: true,
        models: [
          { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: 'Latest GPT-4' },
          { value: 'gpt-4', label: 'GPT-4', description: 'Most capable' },
          { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Fast, cost-effective' },
          { value: 'gpt-4o', label: 'GPT-4o', description: 'Multimodal' },
        ]
      },
      { status: 200 } // Return fallback models instead of error
    );
  }
}
