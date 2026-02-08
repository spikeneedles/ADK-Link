import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="p-4 md:p-8">
      <Card className="mb-8 border-0 shadow-none">
        <CardHeader className="p-0">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
                <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">Profile</CardTitle>
              <CardDescription className="mt-2 max-w-2xl">
                View and manage your public profile.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="text-center p-8 border-2 border-dashed border-muted-foreground/30 rounded-lg">
        <h3 className="mt-4 text-lg font-medium">Coming Soon</h3>
        <p className="mt-1 text-sm text-muted-foreground">This is where your profile will be.</p>
      </div>
    </div>
  );
}
