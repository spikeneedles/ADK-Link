"use client";

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
import { Settings, User, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Separator } from './ui/separator';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { FileNavigator } from './app/file-navigator';

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const settingsActive = pathname === '/settings';
  const profileActive = pathname === '/profile';
  const chatActive = pathname === '/chat';

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
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
        {children}
        <FileNavigator />
      </SidebarInset>
    </>
  );
}
