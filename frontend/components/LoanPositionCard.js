"use client";

import HealthFactorIndicator from "./HealthFactorIndicator";

export default function LoanPositionCard({ collateral, borrows, healthFactor }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-blue-500/20 transition-all" />
      
      <div className="flex flex-col gap-8 relative z-10">
        <HealthFactorIndicator value={healthFactor} />
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">Collateral</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{collateral}</span>
              <span className="text-sm text-slate-400 font-semibold">ETH</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">Total Borrowed</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{borrows}</span>
              <span className="text-sm text-slate-400 font-semibold">USDX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
