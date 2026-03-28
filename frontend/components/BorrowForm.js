import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useContracts } from "@/hooks/useContracts";
import { ArrowDownCircle } from "lucide-react";

export default function BorrowForm({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [maxBorrow, setMaxBorrow] = useState("0");
  const [isBorrowing, setIsBorrowing] = useState(false);
  const { getContract, fetchBorrowingPower } = useContracts();

  useEffect(() => {
    const updateMax = async () => {
      const power = await fetchBorrowingPower();
      setMaxBorrow(power);
    };
    updateMax();
    const interval = setInterval(updateMax, 5000);
    return () => clearInterval(interval);
  }, [fetchBorrowingPower]);

  const handleBorrow = async (e) => {
    e.preventDefault();
    if (!amount) return;

    if (parseFloat(amount) > parseFloat(maxBorrow)) {
      alert("Amount exceeds your borrowing power! Deposit more ETH first.");
      return;
    }
    
    try {
      setIsBorrowing(true);
      const borrowing = getContract("Borrowing");
      const tx = await borrowing.borrow(ethers.parseEther(amount));
      await tx.wait();
      setAmount("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Borrow error:", error);
      alert(error.reason || "Borrow transaction failed.");
    } finally {
      setIsBorrowing(false);
    }
  };

  return (
    <form onSubmit={handleBorrow} className="space-y-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <ArrowDownCircle className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-bold text-slate-100">Borrow USDX</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Amount to borrow</label>
          <span className="text-[10px] text-slate-400">Available: {parseFloat(maxBorrow).toFixed(2)} USDX</span>
        </div>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono"
            required
          />
          <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-bold">USDX</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isBorrowing || parseFloat(maxBorrow) === 0}
        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.2)] disabled:opacity-50"
      >
        {parseFloat(maxBorrow) === 0 ? "Deposit ETH first" : isBorrowing ? "Processing..." : "Borrow"}
      </button>
    </form>
  );
}
