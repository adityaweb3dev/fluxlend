"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      setIsConnecting(true);
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await _provider.send("eth_requestAccounts", []);
      const _signer = await _provider.getSigner();
      const network = await _provider.getNetwork();

      setAccount(accounts[0]);
      setProvider(_provider);
      setSigner(_signer);
      setChainId(network.chainId);
    } catch (error) {
      console.error("Wallet connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        chainId,
        isConnecting,
        connectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context);
