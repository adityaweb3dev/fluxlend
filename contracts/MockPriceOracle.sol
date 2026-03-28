// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockPriceOracle {
    int256 private price;

    constructor(int256 _initialPrice) {
        price = _initialPrice;
    }

    function updatePrice(int256 _newPrice) external {
        price = _newPrice;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (0, price, 0, block.timestamp, 0);
    }
}
