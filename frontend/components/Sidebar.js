"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Coins, 
  ArrowDownLeft, 
  Skull, 
  BarChart3, 
  Zap,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Deposit ETH", href: "/deposit", icon: Coins },
  { name: "Borrow USDX", href: "/borrow", icon: ArrowDownLeft },
  { name: "Liquidate", href: "/liquidate", icon: Skull },
  { name: "Market Stats", href: "/markets", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)]">
          <Zap className="w-5 h-5 text-white fill-current" />
        </div>
        <span className="text-xl font-black tracking-tighter text-white">FLUXLEND</span>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"
              )} />
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <Settings className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Protocol</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            v1.0.0-beta <br />
            Sepolia Testnet
          </p>
        </div>
      </div>
    </aside>
  );
}
