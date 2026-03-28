// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IBorrowing {
    function userBorrows(address user) external view returns (uint256);
}
