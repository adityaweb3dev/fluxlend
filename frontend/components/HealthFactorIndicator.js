"use client";

import { cn } from "@/lib/utils";

export default function HealthFactorIndicator({ value }) {
  const hf = parseFloat(value);
  
  const getStatus = () => {
    if (hf > 2) return { label: "Safe", color: "text-green-400", bg: "bg-green-400/10" };
    if (hf > 1.1) return { label: "Moderate", color: "text-yellow-400", bg: "bg-yellow-400/10" };
    if (hf > 0) return { label: "Risky", color: "text-red-400", bg: "bg-red-400/10" };
    return { label: "No Position", color: "text-slate-400", bg: "bg-slate-400/10" };
  };

  const status = getStatus();

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center px-1">
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Health Factor</span>
        <span className={cn("text-xs px-2 py-0.5 rounded-full font-bold", status.color, status.bg)}>
          {status.label}
        </span>
      </div>
      <div className="text-3xl font-bold text-white font-mono">
        {hf > 1000 ? "∞" : hf.toFixed(2)}
      </div>
    </div>
  );
}
