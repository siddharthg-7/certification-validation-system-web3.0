# 🚀 CertiChain Production Deployment Guide

To make your application accessible from anywhere (not just your local computer), you need to deploy it to the cloud. We will use the following free/cheap services:

1.  **Blockchain**: **Sepolia Testnet** (Public Ethereum Test Network)
2.  **Backend**: **Render.com** (Hosting for Node.js API)
3.  **Frontend**: **Vercel** (Hosting for React App)

---

## 📦 Phase 1: Deploy Smart Contract to Sepolia

Your local Hardhat network (`localhost`) only lives on your computer. To be public, your contract must be on a public network.

### 1. Prerequisites
1.  **Get an RPC URL**: Sign up at [Alchemy.com](https://www.alchemy.com/), create a new app (Chain: Ethereum, Network: Sepolia), and copy the **HTTPS URL**.
2.  **Get Sepolia ETH**: Go to [Introduction to Sepolia Faucets](https://www.alchemy.com/faucets/ethereum-sepolia) and send some free test ETH to your wallet address (the one from `npx hardhat node` Account #0, or your personal MetaMask address).  

### 2. Update Configuration
Open your `.env` file in the project root and add:
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY_HERE
PRIVATE_KEY=your_private_key_here
```
*(Make sure `PRIVATE_KEY` has some Sepolia ETH on it)*

### 3. Deploy
Run this in your terminal:
```bash
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
```

**✅ Save the Result**: The script will print `CertificateRegistry deployed to: 0x...`. **COPY THIS ADDRESS.**

---

## 🛠️ Phase 2: Deploy Backend (Node.js)

We'll use **Render.com** to host the backend.

1.  **Push your code to GitHub** (You already did this!).
2.  Sign up at [Render.com](https://render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    *   **Root Directory**: `backend`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
6.  **Environment Variables** (Click "Advanced" or "Environment"):
    Add these key-value pairs from your local `.env`:
    *   `PRIVATE_KEY`: (Your wallet private key)
    *   `RPC_URL`: (Your Alchemy Sepolia URL)
    *   `HARDHAT_NETWORK`: `sepolia`
    *   `AES_ENCRYPTION_KEY`: (Your secret key)
    *   `USE_IPFS`: `false` (or true if you set up Infura)
7.  **Click "Create Web Service"**.

**✅ Save the Result**: Render will give you a URL like `https://certichain-backend.onrender.com`. **COPY THIS URL.**

---

## 🎨 Phase 3: Deploy Frontend (React) on Render

We will also use **Render** to host the frontend as a Static Site.

1.  **Dashboard**: Go back to your Render Dashboard.
2.  Click **New +** -> **Static Site**.
3.  Connect your GitHub repository.
4.  **Settings**:
    *   **Name**: `certichain-frontend`
    *   **Root Directory**: `frontend`
    *   **Build Command**: `npm install && npm run build`
    *   **Publish Directory**: `build`
5.  **Environment Variables**:
    Add the following:
    *   `REACT_APP_API_URL`: (Paste your **Backend Service URL** from Phase 2, e.g., `https://certichain-backend.onrender.com`)
    *   `REACT_APP_CHAIN_ID`: `11155111`
    *   `REACT_APP_NETWORK_NAME`: `Sepolia`
6.  **Click "Create Static Site"**.

---

## 🌍 Phase 4: Final Connect

1.  Go to your new Frontend URL (e.g., `https://certichain-frontend.onrender.com`).
2.  Open MetaMask and switch network to **Sepolia**.
3.  Connect functionality should now work globally! You can send this link to anyone.

### 💡 Troubleshooting
*   **Backend errors?** Check Render logs. If it says "Contract not initialized", verify you added the deployments file or updated the `CONTRACT_ADDRESS` in your backend code/env correctly.
*   **Transaction sticking?** Sepolia can be slow. Check Etherscan (Sepolia) with your transaction hash.
