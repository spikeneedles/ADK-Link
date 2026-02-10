'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ReactNode } from 'react';
import { Logo } from '@/components/logo';
import { MainNav } from '@/components/app/main-nav';
import { Button } from './ui/button';
import { Settings, User, MessageSquare, Send, ChevronUp, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Separator } from './ui/separator';
import { FileNavigator } from './app/file-navigator';
import { ChatInterface } from './app/chat-interface';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function AppShell({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const router = useRouter();

  const handleExportClick = () => {
    toast({
      title: 'Changes Applied Instantly',
      description: "This app's code is modified automatically when generated.",
    });
  };

  const handleSignOut = () => {
    toast({
      title: 'Signed Out',
      description: 'You have been signed out successfully.',
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <User className="w-4 h-4" />
                <span>Account</span>
                <ChevronUp className="w-4 h-4 ml-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
