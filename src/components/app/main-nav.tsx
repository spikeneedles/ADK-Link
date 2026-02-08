'use client';

import {
  Bot,
  GanttChartSquare,
  LayoutDashboard,
  Library,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '../ui/sidebar';
import { cn } from '@/lib/utils';

const links = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/workflows',
    label: 'Workflows',
    icon: Workflow,
  },
  {
    href: '/safety-rails',
    label: 'Safety Rails',
    icon: ShieldCheck,
  },
  {
    href: '/prompt-library',
    label: 'Prompt Library',
    icon: Library,
  },
  {
    href: '/tools',
    label: 'Tools',
    icon: GanttChartSquare,
  },
  {
    href: '/model-customization',
    label: 'Model Customization',
    icon: Bot,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col p-2">
      <SidebarMenu>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href} className="w-full">
                <SidebarMenuButton
                  isActive={isActive}
                  className={cn(isActive && 'bg-sidebar-accent text-sidebar-accent-foreground')}
                  tooltip={link.label}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </nav>
  );
}
