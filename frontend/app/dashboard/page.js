"use client";

import { useEffect, useState, useCallback } from "react";
import { useWeb3 } from "@/context/Web3Context";
import { useContracts } from "@/hooks/useContracts";
import Link from "next/link";
import LoanPositionCard from "@/components/LoanPositionCard";
import TestTools from "@/components/TestTools";
import { Zap, ArrowDownLeft, Skull, ShieldCheck } from "lucide-react";

export default function Dashboard() {
  const { account } = useWeb3();
  const { fetchUserData, fetchPoolData } = useContracts();
  const [userData, setUserData] = useState({ collateral: "0", borrows: "0", healthFactor: "0" });
  const [poolData, setPoolData] = useState({ totalLiquidity: "0" });

  const refreshData = useCallback(async () => {
    if (!account) return;
    const [uData, pData] = await Promise.all([
      fetchUserData(),
      fetchPoolData()
    ]);
    if (uData) setUserData(uData);
    if (pData) setPoolData(pData);
  }, [account, fetchUserData, fetchPoolData]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, [refreshData]);

  if (!account) return (
    <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
      <div className="bg-blue-600/10 p-8 rounded-full border border-blue-500/20 mb-4 animate-bounce">
        <Zap className="w-12 h-12 text-blue-500" />
      </div>
      <h2 className="text-4xl font-bold tracking-tight">Connect your wallet</h2>
      <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
        Access the FluxLend dashboard to manage your deposits and loans.
      </p>
    </div>
  );

  return (
    <div className="p-8 space-y-10 max-w-6xl mx-auto">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LoanPositionCard 
          collateral={userData.collateral}
          borrows={userData.borrows}
          healthFactor={userData.healthFactor}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Protocol Supply</span>
            <div className="mt-4">
              <div className="text-2xl font-black text-white">{parseFloat(poolData.totalLiquidity).toLocaleString()}</div>
              <div className="text-[10px] text-slate-500">USDX Liquidity</div>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Protocol Debt</span>
            <div className="mt-4">
              <div className="text-2xl font-black text-white">4.12M</div>
              <div className="text-[10px] text-slate-500">USDX Borrowed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/deposit" className="group bg-blue-600 px-6 py-8 rounded-3xl space-y-4 hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            <Zap className="w-8 h-8 text-white fill-current" />
            <div>
              <div className="font-bold text-xl">Supply ETH</div>
              <p className="text-blue-100/70 text-sm">Add collateral to your position</p>
            </div>
          </Link>
          <Link href="/borrow" className="group bg-slate-900 border border-slate-800 px-6 py-8 rounded-3xl space-y-4 hover:border-slate-600 transition-all">
            <ArrowDownLeft className="w-8 h-8 text-purple-500" />
            <div>
              <div className="font-bold text-xl">Borrow USDX</div>
              <p className="text-slate-400 text-sm">Get instant liquidity</p>
            </div>
          </Link>
          <Link href="/liquidate" className="group bg-slate-900 border border-slate-800 px-6 py-8 rounded-3xl space-y-4 hover:border-slate-600 transition-all">
            <Skull className="w-8 h-8 text-red-500" />
            <div>
              <div className="font-bold text-xl">Liquidate</div>
              <p className="text-slate-400 text-sm">Earn 5% bonus rewards</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
        <div className="lg:col-span-2">
           <TestTools onUpdate={refreshData} />
        </div>
        
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
              <h3 className="font-bold text-blue-100 text-lg">Secure Protocol</h3>
            </div>
            <p className="text-blue-200/70 leading-relaxed">
              FluxLend uses Chainlink Price Feeds and audited OpenZeppelin contracts to ensure the safety of your assets. 
              All positions are overcollateralized.
            </p>
        </div>
      </div>
    </div>
  );
}
