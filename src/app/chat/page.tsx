import { ChatInterface } from '@/components/app/chat-interface';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <Card className="mb-8 border-0 shadow-none">
        <CardHeader className="p-0">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
                <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">Gemini Chat</CardTitle>
              <CardDescription className="mt-2 max-w-2xl">
                Have a conversation with Gemini. Ask questions, get help with code, and more.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <ChatInterface />
    </div>
  );
}
