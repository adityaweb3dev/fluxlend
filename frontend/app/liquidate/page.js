"use client";

import { useEffect, useState, useCallback } from "react";
import { useWeb3 } from "@/context/Web3Context";
import { useContracts } from "@/hooks/useContracts";
import LiquidationForm from "@/components/LiquidationForm";
import LoanPositionCard from "@/components/LoanPositionCard";
import { Skull, AlertTriangle } from "lucide-react";

export default function LiquidatePage() {
  const { account } = useWeb3();
  const { fetchUserData } = useContracts();
  const [userData, setUserData] = useState({ collateral: "0", borrows: "0", healthFactor: "0" });

  const refreshData = useCallback(async () => {
    if (!account) return;
    const data = await fetchUserData();
    if (data) setUserData(data);
  }, [account, fetchUserData]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, [refreshData]);

  if (!account) return (
    <div className="p-12 text-center">
      <h2 className="text-2xl font-bold">Please connect your wallet</h2>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-red-600/20 p-3 rounded-2xl">
          <Skull className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Liquidations</h1>
          <p className="text-slate-400">Repay bad debt and earn a 5% liquidation bonus.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LiquidationForm onSuccess={refreshData} />
          
          <div className="mt-8 bg-amber-600/5 border border-amber-500/10 rounded-3xl p-6">
            <div className="flex items-center gap-2 text-amber-500 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-bold uppercase tracking-wider text-sm">How it works</h4>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              When a user's Health Factor drops below 1.0, their position becomes eligible for liquidation. 
              As a liquidator, you can repay a portion of their debt in USDX. In return, you receive an equivalent 
              value of their ETH collateral plus a 5% bonus.
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <LoanPositionCard 
            collateral={userData.collateral}
            borrows={userData.borrows}
            healthFactor={userData.healthFactor}
          />
        </div>
      </div>
    </div>
  );
}
