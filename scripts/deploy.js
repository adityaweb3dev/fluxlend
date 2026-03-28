const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 1. Deploy Mock Stablecoin
  const MockStablecoin = await ethers.getContractFactory("MockStablecoin");
  const stablecoin = await MockStablecoin.deploy();
  await stablecoin.waitForDeployment();
  console.log("MockStablecoin deployed to:", await stablecoin.getAddress());

  // 2. Deploy Mock Price Oracle (ETH/USD = $2000)
  const MockPriceOracle = await ethers.getContractFactory("MockPriceOracle");
  const priceOracle = await MockPriceOracle.deploy(2000 * 10**8);
  await priceOracle.waitForDeployment();
  console.log("MockPriceOracle deployed to:", await priceOracle.getAddress());

  // 3. Deploy CollateralManager
  const CollateralManager = await ethers.getContractFactory("CollateralManager");
  const collateralManager = await CollateralManager.deploy(await priceOracle.getAddress());
  await collateralManager.waitForDeployment();
  console.log("CollateralManager deployed to:", await collateralManager.getAddress());

  // 4. Deploy Borrowing (which includes LendingPool)
  const Borrowing = await ethers.getContractFactory("Borrowing");
  const borrowing = await Borrowing.deploy(await stablecoin.getAddress(), await collateralManager.getAddress());
  await borrowing.waitForDeployment();
  console.log("Borrowing deployed to:", await borrowing.getAddress());

  // Link CollateralManager to Borrowing for withdrawal checks
  await collateralManager.setBorrowingContract(await borrowing.getAddress());
  console.log("Linked CollateralManager to Borrowing");

  // 5. Deploy Liquidation
  const Liquidation = await ethers.getContractFactory("Liquidation");
  const liquidation = await Liquidation.deploy(await borrowing.getAddress(), await collateralManager.getAddress());
  await liquidation.waitForDeployment();
  console.log("Liquidation deployed to:", await liquidation.getAddress());

  console.log("Deployment complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
