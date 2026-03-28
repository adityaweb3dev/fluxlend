"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useContracts } from "@/hooks/useContracts";
import { useWeb3 } from "@/context/Web3Context";
import { Settings, TrendingDown, Coins, Zap } from "lucide-react";

export default function TestTools({ onUpdate }) {
  const [newPrice, setNewPrice] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const { getContract } = useContracts();
  const { account } = useWeb3();

  const handleUpdatePrice = async () => {
    if (!newPrice) return;
    try {
      setIsUpdating(true);
      const oracle = getContract("PriceOracle");
      // Chainlink prices have 8 decimals in this mock
      const priceIn8Decimals = BigInt(Math.floor(parseFloat(newPrice) * 1e8));
      const tx = await oracle.updatePrice(priceIn8Decimals);
      await tx.wait();
      if (onUpdate) onUpdate();
      alert("Price updated on-chain!");
    } catch (error) {
      console.error("Price update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMintTokens = async () => {
    try {
      setIsMinting(true);
      const stablecoin = getContract("Stablecoin");
      const tx = await stablecoin.mint(account, ethers.parseEther("1000"));
      await tx.wait();
      alert("1000 USDX minted to your wallet!");
    } catch (error) {
      console.error("Mint error:", error);
    } finally {
      setIsMinting(false);
    }
  };

  const handleFundPool = async () => {
    try {
      setIsUpdating(true);
      const borrowing = getContract("Borrowing");
      const stablecoin = getContract("Stablecoin");
      const amount = ethers.parseEther("5000");

      // 1. Approve
      const approveTx = await stablecoin.approve(await borrowing.getAddress(), amount);
      await approveTx.wait();

      // 2. Deposit
      const tx = await borrowing.deposit(amount);
      await tx.wait();
      
      if (onUpdate) onUpdate();
      alert("Lending Pool funded with 5000 USDX!");
    } catch (error) {
      console.error("Funding error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-amber-500/20 rounded-3xl p-6 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-5 h-5 text-amber-500" />
        <h3 className="font-bold text-amber-100 uppercase tracking-tighter">Developer Tools</h3>
      </div>
      
      <div className="space-y-4">
        {/* Price Manipulation */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase">Simulate ETH Price ($)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="e.g. 2000"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none text-sm font-mono"
            />
            <button
              onClick={handleUpdatePrice}
              disabled={isUpdating}
              className="bg-amber-600 hover:bg-amber-500 text-white p-2 rounded-xl transition-all disabled:opacity-50"
              title="Update Price"
            >
              <TrendingDown className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 italic">Lower the price to trigger liquidations.</p>
        </div>

        {/* Minting & Funding */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <button
            onClick={handleMintTokens}
            disabled={isMinting}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold py-2.5 rounded-xl transition-all border border-slate-700"
          >
            <Coins className="w-4 h-4" />
            {isMinting ? "Minting..." : "Mint 1000 USDX"}
          </button>
          
          <button
            onClick={handleFundPool}
            disabled={isUpdating}
            className="w-full flex items-center justify-center gap-2 bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 text-sm font-bold py-2.5 rounded-xl transition-all border border-amber-500/20"
          >
            <Zap className="w-4 h-4" />
            {isUpdating ? "Funding..." : "Fund Pool (5k USDX)"}
          </button>
          <p className="text-[10px] text-slate-500 mt-2 text-center">Protocol needs liquidity to lend. Fund it first!</p>
        </div>
      </div>
    </div>
  );
}
