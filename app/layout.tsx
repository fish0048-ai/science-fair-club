import type { ReactNode } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

export const metadata = {
  title: "國中科展社團課",
  description: "對齊台灣全國科展的 17 週社團講義，含限定知識庫 AI 助教",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="main">{children}</main>
        </div>
        <ChatPanel />
      </body>
    </html>
  );
}
