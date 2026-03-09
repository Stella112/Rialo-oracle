# 🔮 Rialo Oracle

> **The decentralized prediction market designed for the AI Agent Economy.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Deploy_on_Vercel-black?style=for-the-badge&logo=vercel)](#) [![Smart Contract](https://img.shields.io/badge/Base_Sepolia-Live_Contract-blue?style=for-the-badge&logo=base)](#) ## 📖 Overview
Building decentralized prediction markets on EVM today requires relying on expensive, slow, and centralized third-party middleware (like Chainlink) to resolve real-world outcomes. 

**Rialo Oracle** is designed to eliminate the middleman. While this V1 MVP is deployed on Base Sepolia to demonstrate the core mechanics of on-chain betting and liquidity pools, the V2 architecture is designed specifically for **Rialo**. By leveraging Rialo’s native **Supermodularity** and built-in **Web Calls**, Rialo Oracle will query real-world APIs directly, turning the blockchain itself into an autonomous, instant-resolution oracle.

## ✨ Key Features (V1 MVP)
* **Live On-Chain Betting:** Users can connect their Web3 wallets and place 'Yes' or 'No' bets on the mainnet launch prediction.
* **Real-Time Pool Syncing:** Smart contract integration ensures the UI reflects exact, real-time liquidity pools.
* **Dynamic Portfolio Dashboard:** A user-specific dashboard that reads from the blockchain to display active positions, bet sizes, and implied payouts based on current pool weightings.
* **Modern "Pro" UI:** A sleek, dark-mode Next.js frontend built for high-frequency traders, completely responsive and optimized for speed.

## 🏗️ The V2 Vision: Why Rialo?
The current EVM contract is a single-market constraint. To scale this into a "Polymarket Killer" with hundreds of simultaneous, trending markets (Pop Culture, AI, Politics), we require:
1. **Parallel Processing:** Handling high-volume trading across multiple isolated markets without network congestion.
2. **Native Web Calls:** Resolving markets instantly by allowing the contract to ping HTTPS endpoints directly, bypassing clunky middleware.

## 💻 Tech Stack
* **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons
* **Web3 Integration:** Ethers.js (v6)
* **Smart Contracts:** Solidity (Deployed via Remix)
* **Network:** Base Sepolia Testnet

## 🚀 Getting Started Locally

### Prerequisites
* Node.js (v18+)
* A Web3 Wallet (MetaMask, Zerion, etc.) configured for Base Sepolia.

### Installation
1. Clone the repository:
npm install
npm run dev
   ```bash
   git clone [https://github.com/Stella112/Rialo-oracle.git](https://github.com/Stella112/Rialo-oracle.git)
   cd Rialo-oracle
