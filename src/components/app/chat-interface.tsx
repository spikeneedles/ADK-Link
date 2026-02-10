'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Bot, LoaderCircle, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

type FormValues = z.infer<typeof formSchema>;

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    const userMessage: Message = { role: 'user', content: values.message };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    // Add empty assistant message that will be populated with streaming content
    const assistantMessageIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const history = [...messages, userMessage];
      
      // Call the streaming API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            
            if (data.error) {
              throw new Error(data.error);
            }
            
            if (data.content) {
              accumulatedContent += data.content;
              // Update the assistant message with accumulated content
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[assistantMessageIndex] = {
                  role: 'assistant',
                  content: accumulatedContent,
                };
                return newMessages;
              });
            }
          }
        }
      }

    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[assistantMessageIndex] = {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        };
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div key={index} className={cn('flex items-start gap-4', message.role === 'user' ? 'justify-end' : '')}>
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8">
                     <div className="w-full h-full flex items-center justify-center bg-accent/20 rounded-full">
                        <Bot className="w-5 h-5 text-accent" />
                     </div>
                  </Avatar>
                )}
                 <div className={cn(
                    "max-w-md p-3 rounded-lg whitespace-pre-wrap",
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                 )}>
                    <p className="text-sm">{message.content}</p>
                 </div>
                {message.role === 'user' && (
                    <Avatar className="w-8 h-8">
                         <div className="w-full h-full flex items-center justify-center bg-card-foreground/10 rounded-full">
                            <User className="w-5 h-5 text-card-foreground" />
                        </div>
                    </Avatar>
                )}
              </div>
            ))}
            {loading && (
                 <div className="flex items-start gap-4">
                    <Avatar className="w-8 h-8">
                        <div className="w-full h-full flex items-center justify-center bg-accent/20 rounded-full">
                            <Bot className="w-5 h-5 text-accent" />
                        </div>
                    </Avatar>
                    <div className="max-w-md p-3 rounded-lg bg-muted flex items-center">
                        <LoaderCircle className="w-5 h-5 animate-spin" />
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Ask Gemini..." {...field} autoComplete="off" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon" disabled={loading}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
