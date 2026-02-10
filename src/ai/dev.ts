import { config } from 'dotenv';
config();

import '@/ai/flows/customize-model-personality.ts';
import '@/ai/flows/generate-ai-safety-rails.ts';
import '@/ai/flows/suggest-prompts-from-context.ts';
import '@/ai/flows/chat.ts';
import '@/ai/flows/universal-chat.ts';
import '@/ai/flows/ai-worker.ts';

