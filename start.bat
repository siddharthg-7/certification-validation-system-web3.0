@echo off
echo ===================================================
echo   🚀 Starting CertiChain (Simplest Mode)
echo ===================================================

echo [1/4] Starting Local Blockchain Node...
start "1. Hardhat Blockchain" cmd /k "cd contracts && npx hardhat node"

echo Waiting 10 seconds for blockchain to initialize...
timeout /t 10 /nobreak >nul

echo [2/4] Deploying Smart Contracts...
cd contracts
call npx hardhat run scripts/deploy.js --network localhost
cd ..

echo [3/4] Starting Backend Server...
start "2. Backend API" cmd /k "cd backend && npm run dev"

echo [4/4] Starting Frontend Dashboard...
start "3. Frontend App" cmd /k "cd frontend && npm start"

echo ===================================================
echo   ✅ System Started! 
echo   👉 Open http://localhost:3000 in your browser
echo   👉 Connect MetaMask to Localhost (Chain ID 31337)
echo ===================================================
