"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ProjectProvider } from "@/contexts/project-context";
import { useEffect } from "react";
import { initializePathDetection } from "@/lib/path-detector";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  // Initialize path detection on app startup
  useEffect(() => {
    initializePathDetection().catch(err => {
      console.error('[Providers] Path detection failed:', err);
    });
  }, []);

  return (
    <ProjectProvider>
      <SidebarProvider defaultOpen>{children}</SidebarProvider>
    </ProjectProvider>
  );
}
