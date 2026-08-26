import type { ReactNode } from "react";
import { AppChrome } from "@/components/AppChrome";
import "./globals.css";

export const metadata = {
  title: "國中科展社團課",
  description: "對齊台灣全國科展的 17 週社團講義，含限定知識庫 AI 助教與上課模式",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
