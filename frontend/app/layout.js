import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/context/Web3Context";
import AppShell from "@/components/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FluxLend | DeFi Lending Protocol",
  description: "Secure, institutional-grade lending and borrowing protocol on Sepolia Testnet.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 min-h-screen`}
      >
        <Web3Provider>
          <AppShell>
            {children}
          </AppShell>
        </Web3Provider>
      </body>
    </html>
  );
}
