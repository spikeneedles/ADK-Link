# Copilot Instructions (ADK Link)

## Project Overview
- ADK Link is a portable AI developer toolkit; the Next.js 15 app-router UI lives in <a>../src/app</a> with shared layout in <a>../src/app/layout.tsx</a> and shell/navigation in <a>../src/components/app-shell.tsx</a>.
- AI features use Genkit with Gemini 2.5 Flash; core client is configured in <a>../src/ai/genkit.ts</a>.
- Genkit flows live in <a>../src/ai/flows</a> (e.g., <a>../src/ai/flows/ai-worker.ts</a>, <a>../src/ai/flows/chat.ts</a>, <a>../src/ai/flows/universal-chat.ts</a>).
- Server routes are Next API handlers in <a>../src/app/api</a>; chat streaming is implemented in <a>../src/app/api/chat/route.ts</a>.
- File system operations are centralized in Genkit tools at <a>../src/ai/tools/file-operations.ts</a> and invoked by API routes like <a>../src/app/api/write-file/route.ts</a>.

## Key Data Flows
- Sidebar chat UI (<a>../src/components/app/chat-interface.tsx</a>) posts to `/api/chat` and consumes SSE-style `data: { content }` lines; keep this wire format compatible when changing streaming.
- Project connection state is enforced both client-side and server-side: UI uses <a>../src/contexts/project-context.tsx</a>; APIs validate the `connectedProjectPath` (cookie or `x-project-path` header).
- Directory navigation uses `/api/list-directory` from <a>../src/components/app/file-navigator.tsx</a>.

## External Integrations
- Gemini API key is required: `GOOGLE_GENAI_API_KEY` or `GEMINI_API_KEY` (see <a>../src/ai/genkit.ts</a>).
- Firebase App Hosting config is in <a>../apphosting.yaml</a>.
- Data Connect config lives in <a>../dataconnect/dataconnect.yaml</a> with generated client in <a>../src/dataconnect-generated</a>.

## Local Workflows
- Dev server: `npm run dev` (Next dev on port 9002).
- Genkit dev: `npm run genkit:dev` or `npm run genkit:watch` (runs <a>../src/ai/dev.ts</a>).
- Build/test checks: `npm run build`, `npm run lint`, `npm run typecheck` (see <a>../package.json</a>).

## Project-Specific Conventions
- All Genkit flows use `ai.defineFlow` with `messages` arrays (no legacy prompt+history), as shown in <a>../src/ai/flows/universal-chat.ts</a>.
- `run-command` API spawns Windows `cmd.exe` via `start` (see <a>../src/app/api/run-command/route.ts</a>); keep Windows behavior in mind when modifying shell launch logic.
- `write-file` and `run-command` must refuse requests outside the connected project root; preserve the path normalization checks in <a>../src/app/api/write-file/route.ts</a>.

## Where to Look First
- UI entry: <a>../src/app/page.tsx</a>.
- AI flows and prompts: <a>../src/ai/flows</a>.
- Security defaults: <a>../security_config.json</a> and <a>../model_env.py</a>.
