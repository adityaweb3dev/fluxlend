import { useState } from "react";
import { useWeb3 } from "@/context/Web3Context";
import { Wallet, LogOut, ExternalLink, Copy, Check } from "lucide-react";

export default function WalletConnect() {
  const { account, connectWallet, isConnecting } = useWeb3();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const disconnect = () => {
    // Basic state reset/reload for demo
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-4">
      {account ? (
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-all font-mono"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-slate-200">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 z-[9999]">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
                title="Copy full address"
              >
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  <span>Copy Address</span>
                </div>
                {copied && <Check className="w-4 h-4 text-green-500" />}
              </button>
              
              <a
                href={`https://sepolia.etherscan.io/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on Explorer</span>
              </a>

              <div className="h-px bg-slate-800 my-2 mx-2" />

              <button
                onClick={disconnect}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50"
        >
          <Wallet className="w-4 h-4" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
}
