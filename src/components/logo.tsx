import { Link2 } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 p-2 group">
      <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
        <Link2 className="h-6 w-6 text-primary" />
      </div>
      <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tighter">
        ADK Link
      </h1>
    </Link>
  );
}
