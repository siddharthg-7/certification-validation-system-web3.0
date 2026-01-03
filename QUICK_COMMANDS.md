# 🚀 CertiChain Quick Command Reference

## 📋 Create .env File (REQUIRED FIRST STEP)

```powershell
# In project root, create .env file with this content:
```

Copy this into `c:\certification validation system-web3.0\.env`:

```
AES_ENCRYPTION_KEY=ff3d76e40043f7b0dd033ffd8af68bf76a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d
HARDHAT_NETWORK=localhost
CONTRACT_ADDRESS=
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
IPFS_HOST=localhost
IPFS_PORT=5001
IPFS_PROTOCOL=http
USE_IPFS=false
IPFS_STORAGE_PATH=./ipfs-storage
PORT=5000
NODE_ENV=development
DB_PATH=./database.sqlite
REACT_APP_API_URL=http://localhost:5000
REACT_APP_CHAIN_ID=31337
REACT_APP_NETWORK_NAME=Hardhat Local
```

---

## 🔥 Run All Services (4 Terminals)

### Terminal 1: Hardhat Blockchain
```powershell
cd "c:\certification validation system-web3.0\contracts"
npx hardhat node
```
**Keep running!** Save a private key shown.

### Terminal 2: Deploy Contract
```powershell
cd "c:\certification validation system-web3.0\contracts"
npx hardhat run scripts/deploy.js --network localhost
```

### Terminal 3: Backend
```powershell
cd "c:\certification validation system-web3.0\backend"
npm run dev
```

### Terminal 4: Frontend
```powershell
cd "c:\certification validation system-web3.0\frontend"
npm start
```

---

## 🦊 MetaMask Setup

**Add Network:**
- Name: `Hardhat Local`
- RPC: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Symbol: `ETH`

**Import Account:**
- Use private key from Terminal 1

---

## ✅ Quick Test

1. Go to http://localhost:3000
2. Connect MetaMask
3. Issue Certificate → Upload file → Fill form → Issue
4. Verify Certificate → Upload same file → Verify
5. Should show **VALID** ✅

---

## 📦 GitHub Push

```powershell
git add .
git commit -m "Complete setup"
git remote add origin https://github.com/YOUR_USERNAME/certichain-web3.git
git branch -M main
git push -u origin main
```
