// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LendingPool.sol";
import "./CollateralManager.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Borrowing
 * @dev Manages borrowing and repayment of stablecoins.
 */
contract Borrowing is LendingPool {
    CollateralManager public collateralManager;

    // User borrow balances (in stablecoin units)
    mapping(address => uint256) public userBorrows;

    event Borrowed(address indexed user, uint256 amount);
    event Repaid(address indexed user, uint256 amount);

    constructor(address _borrowToken, address _collateralManager) LendingPool(_borrowToken) {
        collateralManager = CollateralManager(_collateralManager);
    }

    /**
     * @notice Borrow tokens from the lending pool
     * @param amount The amount of tokens to borrow
     */
    function borrow(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        
        userBorrows[msg.sender] += amount;
        
        // Check health factor and borrow power after update
        (, uint256 borrowPowerUSD, uint256 healthFactor) = collateralManager.getAccountData(msg.sender, userBorrows[msg.sender]);
        require(userBorrows[msg.sender] <= borrowPowerUSD, "Exceeds borrowing power");
        require(healthFactor >= 1e18, "Insufficient health factor after borrow");

        _transferToUser(msg.sender, amount);
        emit Borrowed(msg.sender, amount);
    }

    /**
     * @dev Function for liquidation contract to repay debt
     */
    function _repayOnBehalf(address user, uint256 amount) external {
        require(userBorrows[user] >= amount, "Repaying more than debt");
        userBorrows[user] -= amount;
        _transferFromUser(msg.sender, amount);
        emit Repaid(user, amount);
    }

    /**
     * @notice Repay borrowed tokens
     * @param amount The amount of tokens to repay
     */
    function repay(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(userBorrows[msg.sender] >= amount, "Repaying more than borrowed");

        userBorrows[msg.sender] -= amount;
        _transferFromUser(msg.sender, amount);
        emit Repaid(msg.sender, amount);
    }

    /**
     * @dev External view for frontend to check health factor
     */
    function getHealthFactor(address user) external view returns (uint256) {
        (,, uint256 healthFactor) = collateralManager.getAccountData(user, userBorrows[user]);
        return healthFactor;
    }
}
