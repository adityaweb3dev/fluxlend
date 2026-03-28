"use client";

import WalletConnect from "./WalletConnect";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const PAGE_NAMES = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/deposit": "Deposit ETH",
  "/borrow": "Borrow USDX",
  "/liquidate": "Liquidation",
  "/markets": "Markets",
};

export default function TopNav() {
  const pathname = usePathname();
  const pageName = PAGE_NAMES[pathname] || "Protocol";

  return (
    <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500 font-medium">FluxLend</span>
        <ChevronRight className="w-4 h-4 text-slate-700" />
        <span className="text-slate-100 font-bold tracking-tight">{pageName}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-slate-900/50 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mainnet-v1</span>
          </div>
        </div>
        <WalletConnect />
      </div>
    </header>
  );
}
