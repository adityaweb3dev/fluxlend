import CollateralManagerABI from "../lib/contracts/CollateralManager.json";
import BorrowingABI from "../lib/contracts/Borrowing.json";
import LiquidationABI from "../lib/contracts/Liquidation.json";
import ERC20ABI from "../lib/contracts/MockStablecoin.json";
import PriceOracleABI from "../lib/contracts/MockPriceOracle.json";

export const CONTRACT_ADDRESSES = {
  // Sepolia Testnet Addresses
  CollateralManager: "0xd5347711CF9A84eBc7E7d2000cf0649022360622", 
  Borrowing: "0x257490d54fA3bf71D81D4D0EFd8D6cd978D74302",
  Liquidation: "0xB874760Ca979F55c13E551c50a62e1A25eF0A713",
  Stablecoin: "0xa021E8d76029a6E19D85149CAf3E4f342f38b85F",
  PriceOracle: "0xFB4eE4702cC08e755C5191f6B7193d82309Ef5b0",
};

export const getABIs = () => ({
  CollateralManager: CollateralManagerABI.abi,
  Borrowing: BorrowingABI.abi,
  Liquidation: LiquidationABI.abi,
  Stablecoin: ERC20ABI.abi,
  PriceOracle: PriceOracleABI.abi,
});
