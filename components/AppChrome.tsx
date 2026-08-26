"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { Sidebar } from "@/components/Sidebar";

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/class") || pathname.startsWith("/print")) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="app-shell">
        <Sidebar />
        <main className="main">{children}</main>
      </div>
      <ChatPanel />
    </>
  );
}
