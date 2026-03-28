"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useContracts } from "@/hooks/useContracts";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export default function DepositForm({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const { getContract } = useContracts();

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount) return;
    
    try {
      setIsDepositing(true);
      const collateralManager = getContract("CollateralManager");
      const tx = await collateralManager.depositCollateral({
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      setAmount("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Deposit error:", error);
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <form onSubmit={handleDeposit} className="space-y-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <ArrowUpCircle className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-bold text-slate-100">Deposit ETH</h3>
      </div>
      
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 uppercase">Amount to deposit</label>
        <div className="relative">
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
            required
          />
          <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-bold">ETH</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isDepositing}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] disabled:opacity-50"
      >
        {isDepositing ? "Processing..." : "Deposit"}
      </button>
    </form>
  );
}
