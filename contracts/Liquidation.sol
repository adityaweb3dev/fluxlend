// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Borrowing.sol";
import "./CollateralManager.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Liquidation
 * @dev Handles liquidation of undercollateralized loans.
 */
contract Liquidation is ReentrancyGuard {
    Borrowing public borrowing;
    CollateralManager public collateralManager;

    // Liquidation bonus (e.g., 5% -> 500 basis points)
    uint256 public constant LIQUIDATION_BONUS = 500;
    uint256 public constant PERCENTAGE_PRECISION = 10000;

    event Liquidated(address indexed user, address indexed liquidator, uint256 repaidAmount, uint256 collateralSeized);

    constructor(address _borrowing, address _collateralManager) {
        borrowing = Borrowing(_borrowing);
        collateralManager = CollateralManager(_collateralManager);
    }

    /**
     * @notice Liquidate a risky position
     * @param user The address of the user to liquidate
     * @param debtToRepay The amount of debt the liquidator will repay
     */
    function liquidate(address user, uint256 debtToRepay) external nonReentrant {
        uint256 healthFactor = borrowing.getHealthFactor(user);
        require(healthFactor < 1e18, "Position is safe");

        uint256 userDebt = borrowing.userBorrows(user);
        require(debtToRepay <= userDebt, "Repaying more than debt");

        // Calculate collateral to seize
        // 1. Get debt price (Stablecoin = $1)
        // 2. Get ETH price from collateral manager
        uint256 ethPrice = collateralManager.getLatestPrice(); // 8 decimals
        
        // debtToRepay is in stablecoin (e.g., 18 decimals)
        // Value in ETH = (debtToRepay * 1e8) / ethPrice
        // Seized ETH = ETH_Value * (1 + bonus)
        uint256 ethValueToSeize = (debtToRepay * 1e8) / ethPrice;
        uint256 bonus = (ethValueToSeize * LIQUIDATION_BONUS) / PERCENTAGE_PRECISION;
        uint256 totalETHToSeize = ethValueToSeize + bonus;

        require(collateralManager.userCollateral(user) >= totalETHToSeize, "Insufficient collateral to seize");

        // Update state across contracts
        borrowing._repayOnBehalf(user, debtToRepay);
        collateralManager._seizeCollateral(user, msg.sender, totalETHToSeize);

        emit Liquidated(user, msg.sender, debtToRepay, totalETHToSeize);
    }
}
