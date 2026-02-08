"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import React, { createContext, useContext, useState, type ReactNode } from "react";

type IDEConnectionContextType = {
  isConnected: boolean;
  toggleConnection: () => void;
};

const IDEConnectionContext = createContext<IDEConnectionContextType | undefined>(undefined);

export function useIDEConnection() {
  const context = useContext(IDEConnectionContext);
  if (context === undefined) {
    throw new Error('useIDEConnection must be used within an IDEConnectionProvider');
  }
  return context;
}

export function Providers({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(true);

  const toggleConnection = () => {
    setIsConnected((prev) => !prev);
  };

  return (
    <IDEConnectionContext.Provider value={{ isConnected, toggleConnection }}>
        <SidebarProvider defaultOpen>{children}</SidebarProvider>
    </IDEConnectionContext.Provider>
  );
}
