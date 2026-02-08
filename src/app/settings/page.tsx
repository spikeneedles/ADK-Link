import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8">
      <Card className="mb-8 border-0 shadow-none">
        <CardHeader className="p-0">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
                <Settings className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">Settings</CardTitle>
              <CardDescription className="mt-2 max-w-2xl">
                Manage your account settings and preferences.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <div className="text-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg">
        <h3 className="mt-4 text-lg font-medium">Coming Soon</h3>
        <p className="mt-1 text-sm text-muted-foreground">This is where your settings will be.</p>
      </div>
    </div>
  );
}
