import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Sidebar />
      <div className="ml-[232px] min-h-screen px-6 py-6">{children}</div>
    </div>
  );
}
