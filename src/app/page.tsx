import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, GanttChartSquare, LayoutDashboard, Library, Plug, ShieldCheck, Workflow } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Workflow,
    title: 'Workflows',
    description: 'Visually define and implement complex AI workflows.',
    href: '/workflows',
    color: 'text-primary',
  },
  {
    icon: ShieldCheck,
    title: 'Safety Rails',
    description: 'Integrate safety rails to ensure responsible AI behavior.',
    href: '/safety-rails',
    color: 'text-destructive',
  },
  {
    icon: Library,
    title: 'Prompt Library',
    description: 'Utilize a vast library of pre-built prompts.',
    href: '/prompt-library',
    color: 'text-accent',
  },
  {
    icon: GanttChartSquare,
    title: 'Tools',
    description: 'Implement powerful tools into your connected program.',
    href: '/tools',
    color: 'text-primary',
  },
  {
    icon: Bot,
    title: 'Model Customization',
    description: 'Customize your model with a unique personality.',
    href: '/model-customization',
    color: 'text-accent',
  },
];

export default function Home() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-3 bg-card/50 border-primary/50 shadow-lg shadow-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IDE Connection</CardTitle>
            <Plug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Connected</div>
            <p className="text-xs text-muted-foreground">Actively linked to Visual Studio Code</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="hover:bg-card/80 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
              <feature.icon className={`h-6 w-6 ${feature.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
              <Button asChild variant="outline" size="sm">
                <Link href={feature.href}>Go to {feature.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
