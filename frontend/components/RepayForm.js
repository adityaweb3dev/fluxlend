import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useContracts } from "@/hooks/useContracts";
import { RefreshCw } from "lucide-react";

export default function RepayForm({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState("0");
  const [isRepaying, setIsRepaying] = useState(false);
  const { getContract, fetchWalletBalance } = useContracts();

  useEffect(() => {
    const updateBalance = async () => {
      const bal = await fetchWalletBalance("Stablecoin");
      setWalletBalance(bal);
    };
    updateBalance();
    const interval = setInterval(updateBalance, 5000);
    return () => clearInterval(interval);
  }, [fetchWalletBalance]);

  const handleRepay = async (e) => {
    e.preventDefault();
    if (!amount) return;
    
    try {
      setIsRepaying(true);
      const borrowing = getContract("Borrowing");
      const stablecoin = getContract("Stablecoin");
      
      const repayAmount = ethers.parseEther(amount);
      
      // 1. Approve stablecoin
      const approveTx = await stablecoin.approve(await borrowing.getAddress(), repayAmount);
      await approveTx.wait();
      
      // 2. Repay
      const tx = await borrowing.repay(repayAmount);
      await tx.wait();
      
      setAmount("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Repay error:", error);
    } finally {
      setIsRepaying(false);
    }
  };

  return (
    <form onSubmit={handleRepay} className="space-y-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <RefreshCw className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-bold text-slate-100">Repay USDX</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Amount to repay</label>
          <span className="text-[10px] text-slate-400">Wallet: {parseFloat(walletBalance).toFixed(2)} USDX</span>
        </div>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-mono"
            required
          />
          <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-bold">USDX</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isRepaying || parseFloat(walletBalance) === 0}
        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] disabled:opacity-50"
      >
        {parseFloat(walletBalance) === 0 ? "Insufficient USDX" : isRepaying ? "Processing..." : "Repay"}
      </button>
    </form>
  );
}
