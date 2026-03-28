"use client";

import { useEffect, useState, useCallback } from "react";
import { useWeb3 } from "@/context/Web3Context";
import { useContracts } from "@/hooks/useContracts";
import { BarChart3, TrendingUp, Users, Zap } from "lucide-react";

export default function MarketsPage() {
  const { account } = useWeb3();
  const { fetchPoolData } = useContracts();
  const [poolData, setPoolData] = useState({ totalLiquidity: "0" });

  const refreshData = useCallback(async () => {
    const pData = await fetchPoolData();
    if (pData) setPoolData(pData);
  }, [fetchPoolData]);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, [refreshData]);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-blue-600/20 p-3 rounded-2xl">
          <BarChart3 className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Market Overview</h1>
          <p className="text-slate-400">Protocol-wide statistics and asset performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Total Market Size</span>
          </div>
          <div className="text-3xl font-black text-white">
            {parseFloat(poolData.totalLiquidity).toLocaleString()} <span className="text-sm font-normal text-slate-500">USDX</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Total Borrowed</span>
          </div>
          <div className="text-3xl font-black text-white">
            4.12M <span className="text-sm font-normal text-slate-500">USDX</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Active Users</span>
          </div>
          <div className="text-3xl font-black text-white">
            1,284
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="font-bold text-lg">Supported Assets</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 text-slate-500 text-xs font-bold uppercase tracking-widest">
              <th className="px-6 py-4">Asset</th>
              <th className="px-6 py-4">Total Supplied</th>
              <th className="px-6 py-4">Total Borrowed</th>
              <th className="px-6 py-4">LTV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">ETH</div>
                  <div>
                    <div className="font-bold">Ethereum</div>
                    <div className="text-[10px] text-slate-500 font-mono">0x000...000</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 font-mono text-sm text-slate-300">842.15 ETH</td>
              <td className="px-6 py-5 font-mono text-sm text-slate-300">-</td>
              <td className="px-6 py-5 font-mono text-sm text-slate-300">80%</td>
            </tr>
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs text-white">USDX</div>
                  <div>
                    <div className="font-bold">Flux Stablecoin</div>
                    <div className="text-[10px] text-slate-500 font-mono">0xa02...b85f</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 font-mono text-sm text-slate-300">{parseFloat(poolData.totalLiquidity).toLocaleString()} USDX</td>
              <td className="px-6 py-5 font-mono text-sm text-slate-300">4.12M USDX</td>
              <td className="px-6 py-5 font-mono text-sm text-slate-300">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
