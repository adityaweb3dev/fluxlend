"use client";

import Link from "next/link";
import { Zap, Shield, TrendingUp, ArrowLeft, BookOpen, Code, Info } from "lucide-react";
import { BeamsBackground } from "@/components/ui/beams-background";

export default function DocumentationPage() {
  const sections = [
    {
      title: "Protocol Overview",
      icon: Info,
      content: "FluxLend is a decentralized, non-custodial lending protocol where users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income, while borrowers are able to borrow in an over-collateralized manner."
    },
    {
      title: "How it Works",
      icon: BookOpen,
      content: "1. Deposit Collateral: Supply ETH to the protocol to establish borrowing power. \n2. Borrow Assets: Take out USDX loans up to 80% of your collateral value. \n3. Repay: Return the borrowed amount to unlock your collateral."
    },
    {
      title: "Health Factor & Liquidation",
      icon: Shield,
      content: "Your Health Factor represents the safety of your loan. If it drops below 1.0, your position becomes eligible for liquidation. Liquidators can repay a portion of your debt in exchange for your collateral at a discount."
    },
    {
      title: "Technical Architecture",
      icon: Code,
      content: "FluxLend uses a modular smart contract architecture. \n- CollateralManager: Syncs with Chainlink Price Feeds.\n- Borrowing: Issues USDX based on collateral health.\n- Liquidation: Publicly accessible safety mechanism."
    },
    {
      title: "Tech Stack & Connectivity",
      icon: Zap,
      content: "Built on Ethereum Sepolia. \n- Backend: Solidity & Hardhat.\n- Frontend: Next.js 15, ethers.js, Tailwind CSS v4.\n- Real-time: Canvas Beams for immersive feedback."
    },
    {
      title: "Developer Tools",
      icon: Code,
      content: "FluxLend includes built-in developer tools for testing on Sepolia. Use the Dashboard to mint test stablecoins or simulate price changes to see how the protocol reacts to market volatility."
    }
  ];

  return (
    <BeamsBackground className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto relative z-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-blue-500 fill-current" />
            <span className="text-2xl font-black tracking-tighter uppercase italic text-white">FluxLend Docs</span>
          </div>
        </div>

        {/* Hero */}
        <div className="mb-20">
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
            Understanding <br /> the Protocol.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
            Everything you need to know about depositing, borrowing, and keeping your positions safe on FluxLend.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-800 backdrop-blur-xl p-8 rounded-[40px] hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                   <section.icon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-white">{section.title}</h3>
              </div>
              <p className="text-slate-400 leading-relaxed whitespace-pre-line text-lg">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-20 p-12 rounded-[50px] bg-blue-600 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_50px_rgba(37,99,235,0.3)]">
          <div>
            <h2 className="text-3xl font-black mb-2">Ready to start?</h2>
            <p className="text-blue-100 font-medium">Jump into the dashboard and supply yours first collateral.</p>
          </div>
          <Link 
            href="/dashboard" 
            className="bg-white text-blue-600 px-10 py-4 rounded-3xl font-black hover:scale-105 transition-transform"
          >
            Launch Dashboard
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-slate-500 text-sm">
          &copy; 2026 FluxLend Protocol. Built for the future of finance.
        </div>
      </div>
    </BeamsBackground>
  );
}
