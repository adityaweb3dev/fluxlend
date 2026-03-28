"use client";

import { useEffect, useState, useCallback } from "react";
import { useWeb3 } from "@/context/Web3Context";
import { useContracts } from "@/hooks/useContracts";
import BorrowForm from "@/components/BorrowForm";
import RepayForm from "@/components/RepayForm";
import LoanPositionCard from "@/components/LoanPositionCard";
import { ArrowDownLeft, Info } from "lucide-react";

export default function BorrowPage() {
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
        <div className="bg-purple-600/20 p-3 rounded-2xl">
          <ArrowDownLeft className="w-8 h-8 text-purple-500" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Borrow Assets</h1>
          <p className="text-slate-400">Borrow USDX against your ETH collateral with instant liquidity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <BorrowForm onSuccess={refreshData} />
          <RepayForm onSuccess={refreshData} />
        </div>
        
        <div className="space-y-6">
          <LoanPositionCard 
            collateral={userData.collateral}
            borrows={userData.borrows}
            healthFactor={userData.healthFactor}
          />
          
          <div className="bg-purple-600/5 border border-purple-500/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-purple-400">
              <Info className="w-5 h-5" />
              <h4 className="font-bold text-sm uppercase tracking-wider">Borrowing Info</h4>
            </div>
            <ul className="text-xs text-slate-400 space-y-3">
              <li className="flex justify-between">
                <span>Borrow Interest</span>
                <span className="text-slate-200">0.00% (Fixed)</span>
              </li>
              <li className="flex justify-between">
                <span>Asset</span>
                <span className="text-slate-200">USDX (Stable)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
