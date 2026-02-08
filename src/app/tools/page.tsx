import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GanttChartSquare, Cpu, Database, FileJson } from 'lucide-react';

const tools = [
  {
    icon: Cpu,
    title: "Code Formatter",
    description: "Automatically format your code according to predefined style guides (e.g., Prettier, Black).",
  },
  {
    icon: FileJson,
    title: "API Client Generator",
    description: "Generate a type-safe client library for your REST or GraphQL API from an OpenAPI/Swagger spec.",
  },
  {
    icon: Database,
    title: "DB Schema Visualizer",
    description: "Create visual diagrams of your database schema for better understanding and documentation.",
  },
    {
    icon: Cpu,
    title: "Unit Test Generator",
    description: "Automatically generate unit test skeletons for your functions and classes.",
  },
  {
    icon: FileJson,
    title: "JSON to Type Converter",
    description: "Convert JSON objects into TypeScript, Python, or other language types/classes.",
  },
  {
    icon: Database,
    title: "Mock Data Generator",
    description: "Create realistic mock data for testing and development based on your data schemas.",
  },
];

export default function ToolsPage() {
  return (
    <div className="p-4 md:p-8">
        <Card className="mb-8 border-0 shadow-none">
            <CardHeader className="p-0">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                    <GanttChartSquare className="w-8 h-8 text-primary" />
                </div>
                <div>
                <CardTitle className="text-3xl font-bold tracking-tight">Tools</CardTitle>
                <CardDescription className="mt-2 max-w-2xl">
                    Powerful utilities that can be implemented directly into your program to streamline development.
                </CardDescription>
                </div>
            </div>
            </CardHeader>
        </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <tool.icon className="h-8 w-8 text-muted-foreground" />
                <CardTitle>{tool.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-muted-foreground mb-4">{tool.description}</p>
              <Button>Implement</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
