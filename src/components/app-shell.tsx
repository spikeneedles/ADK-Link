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
import { Settings, User } from 'lucide-react';
import Link from 'next/link';
import { Separator } from './ui/separator';

export default function AppShell({ children }: { children: ReactNode }) {
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
           <Button variant="ghost" className="w-full justify-start gap-2" asChild>
             <Link href="#">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span>Settings</span>
             </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="#">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>Profile</span>
            </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
