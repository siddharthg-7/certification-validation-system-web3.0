# 🚀 Complete Deployment Guide - CertiChain DApp

## Overview
This guide will help you deploy your fully decentralized certificate validation system to production. Your app consists of:
- **Smart Contract** (Already deployed to Sepolia ✅)
- **Backend API** (Node.js/Express)
- **Frontend** (React)
- **IPFS Storage** (Pinata - Already configured ✅)

---

## ✅ What's Already Done

1. ✅ Smart Contract deployed to Sepolia: `0xCb3f328EEFeC798360E48DB815465ad599514e5b`
2. ✅ Contract verified on Etherscan
3. ✅ Pinata IPFS configured and working
4. ✅ Local development environment working

---

## 🎯 Deployment Steps

### Step 1: Deploy Backend to Render.com (Free Tier)

#### 1.1 Prepare Backend for Deployment

**Create `backend/.dockerignore`:**
```
node_modules
npm-debug.log
.env
database.sqlite
database.sqlite-shm
database.sqlite-wal
ipfs-storage
*.log
```

**Update `backend/package.json`** (add engines):
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

#### 1.2 Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Prepare for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/certichain-dapp.git
git branch -M main
git push -u origin main
```

#### 1.3 Deploy to Render

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `certichain-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. **Add Environment Variables** (click "Advanced"):
   ```
   AES_ENCRYPTION_KEY=your_encryption_key_here
   HARDHAT_NETWORK=sepolia
   CONTRACT_ADDRESS=0xCb3f328EEFeC798360E48DB815465ad599514e5b
   PRIVATE_KEY=your_private_key_here
   SEPOLIA_RPC_URL=your_alchemy_url_here
   ETHERSCAN_API_KEY=KRJRH8W8F42ZYNPXK1YSF4FZ8SQMCWXHJC
   USE_IPFS=true
   IPFS_PROVIDER=pinata
   PINATA_API_KEY=5372efa80b080ba31ffc
   PINATA_JWT=your_jwt_token_here
   IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
   PORT=5000
   NODE_ENV=production
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL: `https://certichain-backend.onrender.com`

---

### Step 2: Deploy Frontend to Vercel (Free Tier)

#### 2.1 Update Frontend Configuration

**Create `frontend/.env.production`:**
```env
REACT_APP_API_URL=https://certichain-backend.onrender.com/api
REACT_APP_CHAIN_ID=11155111
REACT_APP_NETWORK_NAME=Sepolia
REACT_APP_CONTRACT_ADDRESS=0xCb3f328EEFeC798360E48DB815465ad599514e5b
```

#### 2.2 Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? certichain-frontend
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**Option B: Using Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add Environment Variables (same as `.env.production`)
6. Click **"Deploy"**
7. Your app will be live at: `https://certichain-frontend.vercel.app`

---

### Step 3: Configure CORS

Update `backend/server.js` to allow your frontend domain:

```javascript
const cors = require('cors');

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://certichain-frontend.vercel.app'
    ],
    credentials: true
}));
```

Commit and push to trigger redeployment on Render.

---

### Step 4: Update Frontend API URL

If you deployed frontend first, update the environment variable on Vercel:
1. Go to your project on Vercel
2. Settings → Environment Variables
3. Update `REACT_APP_API_URL` to your Render backend URL
4. Redeploy

---

## 🔧 Post-Deployment Configuration

### Database (SQLite → PostgreSQL for Production)

For production, consider upgrading to PostgreSQL:

1. **On Render Dashboard**:
   - Create a new PostgreSQL database (Free tier available)
   - Copy the connection string

2. **Update Backend**:
   ```bash
   npm install pg
   ```

3. **Add to Environment Variables**:
   ```
   DATABASE_URL=your_postgres_connection_string
   ```

### IPFS Storage Path

On Render, files are ephemeral. For persistent storage:
- Use Pinata exclusively (already configured ✅)
- Or add a volume mount (paid tier)

---

## 🧪 Testing Your Deployment

### 1. Test Backend Health
```bash
curl https://certichain-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "service": "Certificate Validation Backend"
}
```

### 2. Test Frontend
Visit: `https://certichain-frontend.vercel.app`

### 3. Issue a Test Certificate
1. Go to "Issue Certificate" page
2. Upload a certificate
3. Fill in details
4. Submit
5. Check transaction on [Sepolia Etherscan](https://sepolia.etherscan.io/)

### 4. Verify Certificate
1. Go to "Verify Certificate" page
2. Upload the same certificate
3. View details fetched from IPFS

---

## 📊 Monitoring & Maintenance

### Render Dashboard
- View logs: Dashboard → Your Service → Logs
- Monitor usage: Dashboard → Your Service → Metrics
- Restart service: Dashboard → Your Service → Manual Deploy

### Vercel Dashboard
- View deployments: Dashboard → Your Project → Deployments
- Check analytics: Dashboard → Your Project → Analytics
- View logs: Click on any deployment

### Pinata Dashboard
- Monitor IPFS uploads: [app.pinata.cloud](https://app.pinata.cloud)
- View storage usage: Dashboard → Usage

---

## 🔐 Security Checklist

- [ ] Never commit `.env` files to Git
- [ ] Use strong encryption keys
- [ ] Keep private keys secure
- [ ] Enable HTTPS (automatic on Render/Vercel)
- [ ] Set up rate limiting for API
- [ ] Monitor Sepolia testnet for transactions
- [ ] Regularly backup database
- [ ] Keep dependencies updated

---

## 💰 Cost Breakdown

### Free Tier (Current Setup)
- **Render**: Free (750 hours/month)
- **Vercel**: Free (100GB bandwidth/month)
- **Pinata**: Free (1GB storage)
- **Sepolia Testnet**: Free (test ETH)
- **Total**: $0/month ✅

### Production Upgrade (Optional)
- **Render Pro**: $7/month (persistent storage, better performance)
- **Vercel Pro**: $20/month (more bandwidth, analytics)
- **Pinata Paid**: $20/month (100GB storage)
- **Ethereum Mainnet**: Variable (gas fees)

---

## 🚨 Troubleshooting

### Backend won't start on Render
- Check environment variables are set correctly
- View logs for specific errors
- Ensure `package.json` has correct start script

### Frontend can't connect to backend
- Verify CORS settings
- Check `REACT_APP_API_URL` is correct
- Ensure backend is running (check Render dashboard)

### IPFS uploads failing
- Verify `PINATA_JWT` is correct
- Check Pinata dashboard for API limits
- Ensure `USE_IPFS=true`

### Blockchain transactions failing
- Verify `PRIVATE_KEY` has Sepolia ETH
- Check `CONTRACT_ADDRESS` is correct
- Ensure `SEPOLIA_RPC_URL` is working

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Pinata Documentation](https://docs.pinata.cloud/)
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Etherscan Sepolia](https://sepolia.etherscan.io/)

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Database connected (SQLite or PostgreSQL)
- [ ] IPFS (Pinata) working
- [ ] Smart contract accessible
- [ ] Test certificate issuance working
- [ ] Test certificate verification working
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS enabled (automatic)
- [ ] Monitoring set up

---

## 🎉 You're Live!

Once deployed, your app will be accessible at:
- **Frontend**: `https://certichain-frontend.vercel.app`
- **Backend API**: `https://certichain-backend.onrender.com/api`
- **Smart Contract**: `0xCb3f328EEFeC798360E48DB815465ad599514e5b` (Sepolia)

Share your app with the world! 🌍🚀
