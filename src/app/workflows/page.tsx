import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Workflow } from 'lucide-react';

const mockWorkflows = [
  { id: 'wf_01', name: 'User Inquiry Routing', description: 'Routes user questions to the correct department.' },
  { id: 'wf_02', name: 'Code Generation Agent', description: 'Generates boilerplate code from a prompt.' },
  { id: 'wf_03', name: 'Sentiment Analysis', description: 'Analyzes text and returns a sentiment score.' },
  { id: 'wf_04', name: 'Automated Content Summary', description: 'Summarizes long articles or documents.' },
];

export default function WorkflowsPage() {
  return (
    <div className="h-full flex flex-col">
      <header className="p-4 md:p-8 border-b">
        <div className="flex items-center gap-4">
          <Workflow className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
            <p className="text-muted-foreground">Visually define and implement complex AI workflows.</p>
          </div>
        </div>
      </header>
      <div className="flex-1 grid md:grid-cols-[300px_1fr] h-[calc(100vh_-_113px)]">
        <aside className="hidden md:flex flex-col border-r">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Existing Workflows</h2>
            <Button variant="ghost" size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {mockWorkflows.map((wf) => (
                <Card key={wf.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm">{wf.name}</CardTitle>
                    <CardDescription className="text-xs">{wf.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </aside>
        <main className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/20">
            <Card className="w-full max-w-4xl h-full">
                <CardHeader>
                    <CardTitle>Workflow Editor</CardTitle>
                    <CardDescription>Select a workflow to edit or create a new one.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[calc(100%_-_80px)]">
                    <div className="text-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                        <Workflow className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">Visual Editor Area</h3>
                        <p className="mt-1 text-sm text-muted-foreground">This is where the visual workflow editor will be.</p>
                    </div>
                </CardContent>
            </Card>
        </main>
      </div>
    </div>
  );
}
