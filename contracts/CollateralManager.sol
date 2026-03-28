// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "./IBorrowing.sol";
import "hardhat/console.sol";

/**
 * @title CollateralManager
 * @dev Manages ETH collateral deposits and calculates borrowing power / health factor.
 */
contract CollateralManager is ReentrancyGuard, Ownable {
    AggregatorV3Interface internal immutable priceFeed;

    // Collateral balances in ETH (wei)
    mapping(address => uint256) public userCollateral;
    
    // 80% LTV (Loan to Value) -> 8000 (basis points)
    uint256 public constant LTV = 8000; 
    // 85% Liquidation Threshold -> 8500
    uint256 public constant LIQUIDATION_THRESHOLD = 8500;
    uint256 public constant PERCENTAGE_PRECISION = 10000;

    address public borrowingContract;

    event CollateralDeposited(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);

    constructor(address _priceFeed) Ownable(msg.sender) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    /**
     * @notice Deposit ETH as collateral
     */
    function depositCollateral() external payable nonReentrant {
        require(msg.value > 0, "Amount must be > 0");
        userCollateral[msg.sender] += msg.value;
        emit CollateralDeposited(msg.sender, msg.value);
    }

    function setBorrowingContract(address _borrowingContract) external onlyOwner {
        borrowingContract = _borrowingContract;
    }

    /**
     * @notice Withdraw ETH collateral
     * @param amount The amount of ETH (wei) to withdraw
     */
    function withdrawCollateral(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(userCollateral[msg.sender] >= amount, "Insufficient collateral");
        
        userCollateral[msg.sender] -= amount;

        // Safety check: if user has debt, health factor must stay >= 1
        if (borrowingContract != address(0)) {
            uint256 userDebt = IBorrowing(borrowingContract).userBorrows(msg.sender);
            if (userDebt > 0) {
                (,, uint256 healthFactor) = this.getAccountData(msg.sender, userDebt);
                require(healthFactor >= 1e18, "Withdrawal makes position unsafe");
            }
        }
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit CollateralWithdrawn(msg.sender, amount);
    }

    /**
     * @dev Internal function for Liquidation contract to seize collateral
     */
    function _seizeCollateral(address user, address liquidator, uint256 amount) external {
        require(userCollateral[user] >= amount, "Insufficient collateral to seize");
        userCollateral[user] -= amount;
        (bool success, ) = payable(liquidator).call{value: amount}("");
        require(success, "Transfer failed during seizure");
        emit CollateralWithdrawn(user, amount);
    }

    /**
     * @notice Returns the latest ETH/USD price from Chainlink
     */
    function getLatestPrice() public view returns (uint256) {
        (
            /* uint80 roundID */,
            int price,
            /* uint startedAt */,
            /* uint timeStamp */,
            /* uint80 answeredInRound */
        ) = priceFeed.latestRoundData();
        return uint256(price); // Chainlink USD feeds have 8 decimals
    }

    /**
     * @notice Calculate the value of a user's collateral in USD
     * @param user The address of the user
     * @return The value in USD (multiplied by 1e8 for precision alignment with Chainlink)
     */
    function getCollateralValueUSD(address user) public view returns (uint256) {
        uint256 ethAmount = userCollateral[user];
        uint256 price = getLatestPrice();
        // (wei * price) / 1e18 = USD (8 decimals)
        return (ethAmount * price) / 1e18;
    }

    /**
     * @notice Get user account data for borrowing
     */
    function getAccountData(address user, uint256 totalBorrowedUSD) external view returns (
        uint256 totalCollateralUSD,
        uint256 borrowPowerUSD,
        uint256 healthFactor
    ) {
        // totalCollateralUSD is in 8 decimals (from getCollateralValueUSD)
        uint256 collateralUSD8 = getCollateralValueUSD(user);
        totalCollateralUSD = collateralUSD8 * 1e10; // Normalize to 18 decimals
        
        borrowPowerUSD = (totalCollateralUSD * LTV) / PERCENTAGE_PRECISION;
        
        if (totalBorrowedUSD == 0) {
            healthFactor = type(uint256).max;
        } else {
            // Health Factor = (Collateral * Threshold) / Borrows
            // Scale by 1e18 for precision
            healthFactor = (totalCollateralUSD * LIQUIDATION_THRESHOLD * 1e14) / totalBorrowedUSD;
        }
    }
}
