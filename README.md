# CertiChain — Decentralized Certificate Validation System

**CertiChain** is an enterprise-grade, decentralized certificate issuance and validation platform built on Web3.0 standards, Ethereum smart contracts, and encrypted IPFS storage. Designed for universities, government agencies, accreditation councils, and enterprise certifying bodies, CertiChain solves the global credential forgery crisis by anchoring immutable cryptographic proofs to the blockchain while preserving recipient confidentiality.

---

## Demo

Experience CertiChain locally or explore the interactive demonstration flow:

- **Local Web Interface**: `http://localhost:3000` (upon running locally)
- **Live Demo Flow**:
  1. **Connect Official Wallet**: Authenticate with MetaMask on the authorized EVM network.
  2. **Issue Credential**: Upload a certificate document (PDF/PNG), input recipient and course metadata, and anchor the cryptographic hash to Ethereum with a single click.
  3. **Verify Credential**: Drop any certificate document or paste a SHA-256 hash to receive an instant, trustless, multi-layer verification verdict.
  4. **Audit Registry**: View the public ledger of all issued, confirmed, and revoked certificates in real time.

---

## Features

- **Multi-Layer Cryptographic Verification**:
  - *Layer 1 (Binary Integrity)*: Exact bitwise SHA-256 hash comparison against the on-chain anchor.
  - *Layer 2 (OCR Semantic Analysis)*: Optical character extraction and text pattern verification via Tesseract OCR to detect content tampering.
  - *Layer 3 (Perceptual Visual Hashing)*: Algorithmic visual fingerprinting (pHash) to detect layout manipulation.
- **Immutable Smart Contract Registry**:
  - Role-based access control (RBAC) powered by OpenZeppelin `AccessControl`.
  - Authorized institutions can issue, revoke, and reinstate credentials on-chain with a permanent audit trail.
- **AES-256 Encrypted IPFS Archival**:
  - Sensitive recipient and institutional metadata is encrypted client-side using AES-256-CBC before decentralized pinning on IPFS.
- **Formal Institutional GovTech Design**:
  - Clean, high-contrast, accessible light enterprise design (inspired by Stitch GovTech & Civic platform standards).
  - Fast, responsive interface with zero bloated canvas animations or glowing distractions.
- **Immediate Public Verification**:
  - Employers, embassies, and verification agencies can validate certificates without needing an account or contacting the issuing university.
- **Real-Time Lifecycle Administration**:
  - Full support for institutional revocation (e.g., in cases of academic fraud or erroneous issuance) and status reinstatements.

---

## Tech

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS v3 (Enterprise Institutional Design Tokens)
- **Web3 Integration**: Ethers.js v6
- **Routing**: React Router v7
- **Icons & Notifications**: React Icons, React Hot Toast, React Dropzone

### Backend
- **Runtime**: Node.js (v18+) & Express.js
- **Database**: SQLite3 (Local transaction audit cache)
- **Image & Document Processing**: Tesseract.js (OCR), Sharp (pHash), PDF-Parse, Mammoth
- **Cryptography**: Node.js `crypto` (AES-256-CBC, SHA-256)
- **IPFS Client**: IPFS HTTP Client / Local IPFS Fallback Store

### Blockchain & Smart Contracts
- **Language**: Solidity `^0.8.20`
- **Development Framework**: Hardhat
- **Security Standards**: OpenZeppelin Contracts (`AccessControl`, `Pausable`)
- **Networks**: Hardhat Localhost (Chain ID: `31337`), Ethereum Sepolia Testnet

---

## Screenshots

| Overview / Institutional Portal | Credential Issuance Form |
| :---: | :---: |
| ![Portal Overview](https://dummyimage.com/600x340/0f172a/ffffff&text=Institutional+Portal+Overview) | ![Issuance Form](https://dummyimage.com/600x340/f8fafc/0f172a&text=Administrative+Issuance+Form) |

| Multi-Layer Verification Report | Registry Audit Ledger |
| :---: | :---: |
| ![Verification Report](https://dummyimage.com/600x340/059669/ffffff&text=Official+Verification+Report) | ![Audit Ledger](https://dummyimage.com/600x340/0f172a/ffffff&text=Registry+Management+Dashboard) |

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- [Git](https://git-scm.com/)
- [MetaMask Browser Extension](https://metamask.io/)

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/siddharthg-7/certification-validation-system-web3.0.git
   cd certification-validation-system-web3.0
   ```

2. **Install All Dependencies**:
   Install root, backend, frontend, and smart contract dependencies with one command:
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables**:
   Copy the example environment files:
   ```bash
   # Root / Backend configuration
   cp .env.example .env

   # Frontend configuration
   cp frontend/.env.example frontend/.env 2>nul || copy frontend\.env frontend\.env.local
   ```

---

## Environment Variables

### Root & Backend (`.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `HARDHAT_NETWORK` | `localhost` | Target blockchain network (`localhost` or `sepolia`) |
| `CONTRACT_ADDRESS` | *(Generated on deploy)* | Deployed `CertificateRegistry` smart contract address |
| `PRIVATE_KEY` | *(Hardhat Account #0)* | Deployer / authorized issuer Ethereum private key |
| `IPFS_HOST` | `localhost` | IPFS daemon hostname |
| `IPFS_PORT` | `5001` | IPFS API port |
| `IPFS_PROTOCOL` | `http` | IPFS protocol (`http` or `https`) |
| `USE_IPFS` | `false` | Set to `true` to use live IPFS daemon; `false` uses local fallback |
| `IPFS_STORAGE_PATH` | `./ipfs-storage` | Directory for local IPFS mock storage |
| `PORT` | `5000` | Express REST API port |
| `NODE_ENV` | `development` | Application runtime environment |
| `AES_ENCRYPTION_KEY` | `your-32-character-secret-key-here` | 32-byte secret key for metadata AES-256 encryption |
| `DB_PATH` | `./database.sqlite` | Path to local SQLite ledger cache |

### Frontend (`frontend/.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `REACT_APP_API_URL` | `http://localhost:5000` | Node.js backend REST API endpoint |
| `REACT_APP_CHAIN_ID` | `31337` | Expected EVM Chain ID (`31337` for Hardhat local) |
| `REACT_APP_NETWORK_NAME`| `Hardhat Local` | Display name of the designated network in MetaMask |

---

## Run Locally

### Option A: Automatic Launcher (Recommended for Windows)

Simply double-click `start.bat` or run:
```powershell
.\start.bat
```
This automated script will:
1. Start the local Hardhat EVM blockchain node (`http://127.0.0.1:8545`).
2. Deploy the `CertificateRegistry.sol` smart contract and sync the contract address.
3. Start the Node.js Express backend (`http://localhost:5000`).
4. Launch the React frontend dApp (`http://localhost:3000`).

### Option B: Concurrent Terminal Run

Start all services simultaneously using npm:
```bash
npm run dev
```

### Option C: Step-by-Step Manual Execution

If you prefer starting services in separate terminal windows:

1. **Terminal 1 — Blockchain Node**:
   ```bash
   npm run hardhat:node
   ```
2. **Terminal 2 — Deploy Contracts**:
   ```bash
   npm run hardhat:deploy
   ```
3. **Terminal 3 — Backend API**:
   ```bash
   npm run backend:dev
   ```
4. **Terminal 4 — Frontend Client**:
   ```bash
   npm run frontend:dev
   ```

---

## Deployment

### 1. Smart Contract Deployment (Ethereum Sepolia Testnet)

1. Obtain a Sepolia RPC URL (e.g., from [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/)) and export your testnet private key.
2. Update `.env` with `SEPOLIA_RPC_URL` and `PRIVATE_KEY`.
3. Deploy to Sepolia:
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.js --network sepolia
   ```
4. Copy the deployed contract address and update `CONTRACT_ADDRESS` in `.env`.

### 2. Backend Deployment (Docker / Cloud Host)

Build and run using Docker:
```bash
docker-compose up --build -d
```
Or deploy the `/backend` directory to services like **Railway**, **Render**, or an AWS EC2 instance. Set your production environment variables in the provider console.

### 3. Frontend Deployment (Vercel / Netlify)

Build an optimized static production bundle:
```bash
npm --prefix frontend run build
```
Deploy the `frontend/build` directory to **Vercel**, **Netlify**, or **Cloudflare Pages**. Ensure `REACT_APP_API_URL` points to your deployed backend URL.

---

## API Reference

Base URL (Local): `http://localhost:5000`

### Certificate Management Endpoints

#### 1. Issue Certificate
```http
POST /api/issue
Content-Type: multipart/form-data
```
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `certificate` | File | Yes | Certificate document (PDF, PNG, JPG) |
| `studentName` | String | Yes | Recipient / Candidate full legal name |
| `courseName` | String | Yes | Course, degree, or certification title |
| `institution` | String | Yes | Issuing authority or university name |
| `issueDate` | String | Yes | Official date of issuance (`YYYY-MM-DD`) |
| `grade` | String | No | Classification or score |
| `additionalInfo`| String | No | Official remarks or accreditation codes |

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Certificate issued successfully",
  "data": {
    "docHash": "0x440df1846f165d98e6765ac42c493bd9b081dadbbeb2c37a4a36fb4060d7b9de",
    "contentHash": "0x89b1c7...",
    "imageHash": "0x00...",
    "ipfsCID": "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    "transactionHash": "0x3f5c9e...",
    "blockNumber": 2,
    "issuer": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  }
}
```

#### 2. Verify by Document Upload
```http
POST /api/verify
Content-Type: multipart/form-data
```
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `certificate` | File | Yes | Certificate document to verify |

#### 3. Verify by Document Hash
```http
POST /api/verify-hash
Content-Type: application/json
```
```json
{
  "docHash": "0x440df1846f165d98e6765ac42c493bd9b081dadbbeb2c37a4a36fb4060d7b9de"
}
```

#### 4. Query Certificate Details
```http
GET /api/cert/:hash
```

#### 5. Audit Ledger & System Telemetry
```http
GET /api/transactions?limit=50&offset=0
GET /api/stats
GET /health
```

#### 6. Lifecycle Revocation & Reinstatement
```http
POST /api/revoke
POST /api/unrevoke
Content-Type: application/json
```
```json
{
  "docHash": "0x440df1846f165d98e6765ac42c493bd9b081dadbbeb2c37a4a36fb4060d7b9de"
}
```

---

## Usage/Examples

### Verifying a Certificate via cURL

```bash
# Query verification by SHA-256 hash
curl -X POST http://localhost:5000/api/verify-hash \
  -H "Content-Type: application/json" \
  -d '{"docHash": "0x440df1846f165d98e6765ac42c493bd9b081dadbbeb2c37a4a36fb4060d7b9de"}'
```

### Issuing a Certificate via cURL

```bash
curl -X POST http://localhost:5000/api/issue \
  -F "certificate=@/path/to/degree.pdf" \
  -F "studentName=Alexander Hamilton" \
  -F "courseName=Master of Public Policy" \
  -F "institution=National Administrative Academy" \
  -F "issueDate=2026-09-12" \
  -F "grade=First Class Honours"
```

---

## Roadmap

- [x] Solidity `^0.8.20` Smart Contract Registry with OpenZeppelin `AccessControl`
- [x] Multi-Layer Verification (Binary SHA-256, OCR Extraction, Visual pHash)
- [x] Client-side AES-256 encryption with IPFS distributed pinning
- [x] Formal institutional GovTech user interface (Stitch Civic/Sovereign standard)
- [x] On-chain credential revocation and reinstatement lifecycle
- [ ] Layer-2 Scaling Support (Arbitrum One, Polygon, Optimism)
- [ ] W3C Verifiable Credentials (VC) and Decentralized Identifiers (DID) compliance
- [ ] Bulk batch credential issuance via CSV/Excel drag-and-drop
- [ ] Automated QR code generator with cryptographic verification deep-links
- [ ] Mobile authenticator app for offline QR cryptographic validation

---

## Optimizations

- **Minimizing On-Chain Storage Costs**:
  - The smart contract stores only 32-byte hashes (`bytes32 binaryHash`, `bytes32 contentHash`, `bytes32 imageHash`) and a compact IPFS CID string, eliminating expensive state storage fees (`SSTORE`).
- **Zero UI Bloat & Lightweight CSS**:
  - Replaced over 600 lines of dark glassmorphic CSS and heavy 2D canvas particle physics with a clean, formal institutional design. Total gzipped CSS is just **5.96 kB**.
- **Accelerated Verification Pipeline**:
  - Immediate client-side rendering with zero simulated timeouts.
  - Multi-layer hash algorithms (SHA-256, Tesseract OCR, and Sharp perceptual hashing) run asynchronously on server ingest.
- **SQLite Ledger Caching**:
  - A local SQLite database indexes transactions and image hashes to provide sub-second query performance without redundant RPC requests.

---

## Lessons

- **Institutional Trust Requires Restraint**:
  - In credential verification and GovTech systems, flashy neon cyberpunk themes, particle canvas nets, and glow animations reduce perceived credibility. A clean, high-contrast, structured aesthetic communicates authority, security, and institutional competence.
- **Why Binary Hashing Alone Is Insufficient**:
  - If a user scans a paper certificate at different DPIs or saves a PDF in a newer version, the binary SHA-256 hash changes completely. Combining raw binary hashing with OCR semantic text analysis and perceptual visual hashing allows the system to differentiate between an innocent re-save and malicious grade tampering.
- **Privacy via Hybrid Storage**:
  - Storing candidate personally identifiable information (PII) on a public blockchain violates data privacy regulations (e.g., GDPR). Encrypting metadata with AES-256 before decentralized IPFS pinning ensures verifiable integrity without exposing student privacy.

---

## Authors

- **Siddharth G** ([@siddharthg-7](https://github.com/siddharthg-7)) — *Architecture, Smart Contracts, Backend & Frontend Implementation*

---

## Feedback

We welcome feedback, suggestions, and feature inquiries:
- **Feature Requests & Bug Reports**: Open an issue on [GitHub Issues](https://github.com/siddharthg-7/certification-validation-system-web3.0/issues).
- **Discussions**: Start a conversation in the [GitHub Discussions](https://github.com/siddharthg-7/certification-validation-system-web3.0/discussions) tab.

---

## Support

If you find this project valuable, please consider:
- ⭐ **Starring the repository** on [GitHub](https://github.com/siddharthg-7/certification-validation-system-web3.0).
- 🍴 **Forking the repository** and contributing via pull requests.
- 📢 **Sharing the project** with academic institutions, universities, and enterprise credential issuers.
