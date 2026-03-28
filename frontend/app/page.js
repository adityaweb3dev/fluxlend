"use client";

import Link from "next/link";
import { Zap, Shield, TrendingUp, ArrowRight, Github } from "lucide-react";
import { BeamsBackground } from "@/components/ui/beams-background";

export default function LandingPage() {
  return (
    <BeamsBackground className="min-h-screen">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-transform hover:scale-110">
            <Zap className="w-6 h-6 text-white fill-current" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic text-white">FluxLend</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/markets" className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors">Markets</Link>
          <Link href="/documentation" className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors">Documentation</Link>
          <Link 
            href="/dashboard" 
            className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-slate-200 transition-all flex items-center gap-2 group"
          >
            Launch App
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center relative z-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in mx-auto">
          <Zap className="w-3 h-3 fill-current" />
          Protocol is Now Live on Sepolia
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black tracking-tight leading-[0.9] mb-12 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
          LIQUIDITY <br /> REIMAGINED.
        </h1>
        
        <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed mb-16">
          FluxLend is the next generation decentralized lending protocol. 
          Deposit assets, earn institutional-grade yield, and access instant liquidity with over-collateralized loans.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-24">
          <Link 
            href="/dashboard" 
            className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-3xl text-lg font-black shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            Enter Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a 
            href="#" 
            className="w-full md:w-auto px-10 py-5 rounded-3xl border border-slate-800 text-lg font-bold text-slate-300 hover:border-slate-600 transition-all flex items-center justify-center gap-3 bg-slate-900/40 backdrop-blur-sm"
          >
            <Github className="w-5 h-5" />
            GitHub Code
          </a>
        </div>

        {/* Floating Stats Card (Glassmorphism) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { label: "Total Market Size", value: "$42.1M", icon: TrendingUp, color: "text-blue-500" },
            { label: "Protocol Security", value: "Audited", icon: Shield, color: "text-green-500" },
            { label: "Active Positions", value: "1,280+", icon: Zap, color: "text-yellow-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-800 backdrop-blur-xl p-8 rounded-[40px] group hover:border-blue-500/50 transition-all">
              <stat.icon className={`w-8 h-8 ${stat.color} mb-4 group-hover:scale-110 transition-transform`} />
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-3xl font-black">{stat.value}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Abstract Footer Glow */}
      <div className="h-40 bg-gradient-to-t from-blue-600/10 to-transparent relative z-20" />
    </BeamsBackground>
  );
}
