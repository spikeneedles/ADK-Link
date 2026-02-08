import { PromptSuggester } from '@/components/app/prompt-suggester';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Library } from 'lucide-react';

const promptCategories = [
  {
    category: "Code Generation",
    prompts: [
      { title: "Create a React component", content: "Create a React functional component named '...' that takes props '...' and renders..." },
      { title: "Write a Python function", content: "Write a Python function to '...' that accepts '...' as input and returns '...'." },
      { title: "Generate SQL Query", content: "Generate a SQL query to select '...' from table '...' where '...'." }
    ]
  },
  {
    category: "Debugging",
    prompts: [
      { title: "Explain this error message", content: "Explain the following error message and suggest a fix:\n\n[Paste error message here]" },
      { title: "Find bugs in this code", content: "Review the following code for potential bugs or issues:\n\n[Paste code here]" },
    ]
  },
  {
    category: "Documentation",
    prompts: [
        { title: "Write a docstring", content: "Write a comprehensive docstring for the following function:\n\n[Paste function here]" },
        { title: "Generate README file", content: "Generate a README.md file for a project with the following description: '...'" }
    ]
  }
];

export default function PromptLibraryPage() {
  return (
    <div className="p-4 md:p-8">
      <Card className="mb-8 border-0 shadow-none">
        <CardHeader className="p-0">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/10 rounded-lg">
                <Library className="w-8 h-8 text-accent" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">Prompt Library</CardTitle>
              <CardDescription className="mt-2 max-w-2xl">
                Browse pre-built prompts or provide context from your project to get tailored suggestions.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
            <h2 className="font-headline text-2xl font-semibold tracking-tight mb-4">Prompt Suggester</h2>
            <PromptSuggester />
        </div>
        <div>
            <h2 className="font-headline text-2xl font-semibold tracking-tight mb-4">Pre-built Prompts</h2>
            <Accordion type="single" collapsible className="w-full">
                {promptCategories.map((category) => (
                    <AccordionItem value={category.category} key={category.category}>
                        <AccordionTrigger className="text-lg">{category.category}</AccordionTrigger>
                        <AccordionContent>
                           <div className="space-y-2">
                            {category.prompts.map(prompt => (
                                <Card key={prompt.title} className="bg-muted/50">
                                    <CardHeader className="p-4">
                                        <CardTitle className="text-base">{prompt.title}</CardTitle>
                                        <CardDescription className="font-code text-xs pt-2">{prompt.content}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </div>
    </div>
  );
}
