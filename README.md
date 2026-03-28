# DeFi Lending & Borrowing Protocol

A production-quality decentralized lending protocol built with Next.js, Hardhat, Ethers.js, and Chainlink Price Feeds.

## Features
- **ETH Collateral**: Deposit ETH to gain borrowing power.
- **Stablecoin Borrows**: Borrow USDX against your collateral.
- **Health Factor Management**: Monitor loan health in real-time.
- **Liquidations**: Secure the protocol by liquidating undercollateralized positions.
- **Chainlink Integration**: Institutional-grade price feeds for accurate valuation.

---

## Tech Stack
- **Smart Contracts**: Solidity 0.8.20, Hardhat
- **Frontend**: Next.js 14, TailwindCSS, Ethers.js (v6)
- **Oracles**: Chainlink Price Feeds
- **Libraries**: OpenZeppelin (ReentrancyGuard, Ownable, SafeERC20)

---

## Project Structure
```text
defi-lending-protocol/
├── contracts/             # Solidity Smart Contracts
├── scripts/               # Deployment scripts
├── test/                  # Hardhat unit tests
├── frontend/             # Next.js Application
│   ├── app/              # Dashboard & Pages
│   ├── components/       # UI Components (Wallet, Forms, Cards)
│   ├── context/          # Web3 Provider
│   ├── hooks/            # Custom Solidity Hooks
│   └── utils/            # ABIs and Addresses
└── README.md
```

---

## Setup Instructions

### 1. Smart Contracts
1. Navigate to the root:
   ```bash
   npm install
   ```
2. Create a `.env` file based on `.env.example` and add:
   - `SEPOLIA_RPC_URL`: Your Alchemy/Infura Sepolia URL.
   - `PRIVATE_KEY`: Your MetaMask wallet private key.
3. Compile & Test:
   ```bash
   npx hardhat compile
   npx hardhat test
   ```
4. Deploy to Sepolia:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

### 2. Frontend
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   npm install
   ```
2. Update `utils/contracts.js` with the deployed addresses from the Hardhat console.
3. Run locally:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment to Vercel
1. Push your project to GitHub.
2. Link your repository in Vercel.
3. In the Root Directory setting, specify `frontend`.
4. Add your `.env` variables if needed for frontend analytics.
5. Deploy!

---

## Security
- All critical functions are protected by `ReentrancyGuard`.
- Health factor checks are mandatory before any withdrawal or borrow action.
- Liquidation logic ensures the protocol remains solvent even during market volatility.
