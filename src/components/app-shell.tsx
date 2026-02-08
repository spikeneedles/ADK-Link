'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
} from '@/components/ui/sidebar';
import type { ReactNode } from 'react';
import { Logo } from '@/components/logo';
import { MainNav } from '@/components/app/main-nav';
import { Button } from './ui/button';
import { Settings, User, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';
import { Separator } from './ui/separator';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { FileNavigator } from './app/file-navigator';
import { ChatInterface } from './app/chat-interface';
import { useToast } from '@/hooks/use-toast';

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const settingsActive = pathname === '/settings';
  const profileActive = pathname === '/profile';
  const { toast } = useToast();

  const handleExportClick = () => {
    toast({
      title: 'Changes Applied Instantly',
      description: "This app's code is modified automatically when generated.",
    });
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent className="flex flex-col p-0">
          <div className="p-2">
            <MainNav />
          </div>
          <Separator className="my-0" />
          <div className="flex-1 flex flex-col min-h-0 p-2 gap-2">
            <h3 className="px-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              <span>Gemini Chat</span>
            </h3>
            <ChatInterface />
          </div>
        </SidebarContent>
        <SidebarFooter className="flex flex-col gap-2">
          <Separator className="my-1" />
           <Button variant="ghost" className={cn("w-full justify-start gap-2", settingsActive && "bg-sidebar-accent text-sidebar-accent-foreground")} asChild>
             <Link href="/settings">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
             </Link>
          </Button>
          <Button variant="ghost" className={cn("w-full justify-start gap-2", profileActive && "bg-sidebar-accent text-sidebar-accent-foreground")} asChild>
            <Link href="/profile">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Button onClick={handleExportClick} className="fixed top-4 right-4 z-50 shadow-lg">
          <Send />
          Export Changes
        </Button>
        {children}
        <FileNavigator />
      </SidebarInset>
    </>
  );
}
