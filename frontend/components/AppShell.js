"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isImmersive = pathname === "/" || pathname === "/documentation";

  return (
    <div className="flex min-h-screen">
      {!isImmersive && <Sidebar />}
      <div className="flex-1 flex flex-col min-h-screen">
        {!isImmersive && <TopNav />}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
