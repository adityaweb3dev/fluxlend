"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useContracts } from "@/hooks/useContracts";
import { Skull } from "lucide-react";

export default function LiquidationForm({ onSuccess }) {
  const [targetUser, setTargetUser] = useState("");
  const [amount, setAmount] = useState("");
  const [isLiquidating, setIsLiquidating] = useState(false);
  const { getContract } = useContracts();

  const handleLiquidate = async (e) => {
    e.preventDefault();
    if (!targetUser || !amount) return;
    
    try {
      setIsLiquidating(true);
      const liquidation = getContract("Liquidation");
      const stablecoin = getContract("Stablecoin");
      
      const repayAmount = ethers.parseEther(amount);
      
      // 1. Approve stablecoin for liquidation contract
      const approveTx = await stablecoin.approve(await liquidation.getAddress(), repayAmount);
      await approveTx.wait();
      
      // 2. Liquidate
      const tx = await liquidation.liquidate(targetUser, repayAmount);
      await tx.wait();
      
      setAmount("");
      setTargetUser("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Liquidation error:", error);
      alert("Liquidation failed. Check if user is actually undercollateralized.");
    } finally {
      setIsLiquidating(false);
    }
  };

  return (
    <form onSubmit={handleLiquidate} className="space-y-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <Skull className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-bold text-slate-100">Liquidate Risky User</h3>
      </div>
      
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 uppercase">User Address</label>
        <input
          type="text"
          value={targetUser}
          onChange={(e) => setTargetUser(e.target.value)}
          placeholder="0x..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-mono text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 uppercase">Amount to Repay (USDX)</label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-mono"
            required
          />
          <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-bold">USDX</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLiquidating}
        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)] disabled:opacity-50"
      >
        {isLiquidating ? "Processing..." : "Liquidate Now"}
      </button>
    </form>
  );
}
