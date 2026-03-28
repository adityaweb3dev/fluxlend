// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title LendingPool
 * @dev Handles user deposits and withdrawals of the borrowable asset (e.g., Stablecoin).
 * In this simplified version, it tracks the pool's liquidity.
 */
contract LendingPool is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable borrowToken;
    uint256 public totalPoolLiquidity;

    mapping(address => uint256) public userPoolDeposits;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _borrowToken) Ownable(msg.sender) {
        borrowToken = IERC20(_borrowToken);
    }

    /**
     * @notice Deposit borrowable tokens into the pool to earn interest (simplified)
     * @param amount The amount of tokens to deposit
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        borrowToken.safeTransferFrom(msg.sender, address(this), amount);
        userPoolDeposits[msg.sender] += amount;
        totalPoolLiquidity += amount;
        emit Deposited(msg.sender, amount);
    }

    /**
     * @notice Withdraw deposited tokens from the pool
     * @param amount The amount of tokens to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(userPoolDeposits[msg.sender] >= amount, "Insufficient balance");
        require(totalPoolLiquidity >= amount, "Insufficient pool liquidity");

        userPoolDeposits[msg.sender] -= amount;
        totalPoolLiquidity -= amount;
        borrowToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @dev Internal function for Borrowing contract to take funds from the pool
     */
    function _transferToUser(address user, uint256 amount) internal {
        require(totalPoolLiquidity >= amount, "Insufficient liquidity");
        totalPoolLiquidity -= amount;
        borrowToken.safeTransfer(user, amount);
    }

    /**
     * @dev Internal function for Borrowing contract to return funds to the pool
     */
    function _transferFromUser(address user, uint256 amount) internal {
        borrowToken.safeTransferFrom(user, address(this), amount);
        totalPoolLiquidity += amount;
    }
}
