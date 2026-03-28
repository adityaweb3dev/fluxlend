"use client";

import { useWeb3 } from "@/context/Web3Context";
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, getABIs } from "@/utils/contracts";
import { useState, useCallback } from "react";

export function useContracts() {
  const { signer, provider, account } = useWeb3();
  const [loading, setLoading] = useState(false);

  const getContract = useCallback((name) => {
    const address = CONTRACT_ADDRESSES[name];
    if (!signer || !address || !ethers.isAddress(address)) {
      return null;
    }
    return new ethers.Contract(address, getABIs()[name], signer);
  }, [signer]);

  // Add common interaction functions here (e.g., fetchUserData, fetchPoolData)
  const fetchUserData = async () => {
    if (!account || !signer) return null;
    try {
      const borrowing = getContract("Borrowing");
      const collateralManager = getContract("CollateralManager");
      
      if (!borrowing || !collateralManager) return null;
      
      const borrows = await borrowing.userBorrows(account);
      const collateral = await collateralManager.userCollateral(account);
      const hf = await borrowing.getHealthFactor(account);
      
      return {
        borrows: ethers.formatEther(borrows),
        collateral: ethers.formatEther(collateral),
        healthFactor: ethers.formatEther(hf),
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const fetchBorrowingPower = async () => {
    if (!account || !signer) return "0";
    try {
      const collateralManager = getContract("CollateralManager");
      const borrowing = getContract("Borrowing");
      if (!collateralManager || !borrowing) return "0";
      
      const userDebt = await borrowing.userBorrows(account);
      const data = await collateralManager.getAccountData(account, userDebt);
      
      // ethers v6 Result objects can be accessed by index or name
      // data = [totalCollateralUSD, borrowPowerUSD, healthFactor]
      if (data && data.length >= 2) {
        return ethers.formatEther(data[1]);
      }
      
      // Fallback for named properties if index list is missing
      if (data && data.borrowPowerUSD) {
        return ethers.formatEther(data.borrowPowerUSD);
      }

      return "0";
    } catch (error) {
      console.error("Borrowing power fetch error:", error);
      return "0";
    }
  };

  const fetchWalletBalance = async (tokenName) => {
    if (!account || !signer) return "0";
    try {
      const token = getContract(tokenName);
      const balance = await token.balanceOf(account);
      return ethers.formatEther(balance);
    } catch (error) {
      return "0";
    }
  };

  const fetchPoolData = async () => {
    if (!signer) return null;
    try {
      const borrowing = getContract("Borrowing");
      const liquidity = await borrowing.totalPoolLiquidity();
      return {
        totalLiquidity: ethers.formatEther(liquidity),
      };
    } catch (error) {
      console.error("Pool data error:", error);
      return null;
    }
  };

  return { getContract, fetchUserData, fetchBorrowingPower, fetchWalletBalance, fetchPoolData, loading, setLoading };
}
