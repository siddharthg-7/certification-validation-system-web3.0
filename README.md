<div align="center">

  <h1>🔐 CertiChain</h1>
  <h3><b>Next-Gen Decentralized Certificate Validation System</b></h3>

  <p>
    <a href="https://opensource.org/licenses/MIT">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" alt="License: MIT" />
    </a>
    <a href="https://soliditylang.org/">
      <img src="https://img.shields.io/badge/Solidity-0.8.19-363636?style=for-the-badge&logo=solidity" alt="Solidity" />
    </a>
    <a href="https://reactjs.org/">
      <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" alt="React" />
    </a>
    <a href="https://nodejs.org/">
      <img src="https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
    </a>
    <a href="https://www.docker.com/">
      <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
    </a>
  </p>

  <p>
    <a href="#-api-documentation">Explore Docs</a> ·
    <a href="https://github.com/yourusername/certichain/issues">Report Bug</a> ·
    <a href="https://github.com/yourusername/certichain/issues">Request Feature</a>
  </p>

</div>

<hr />

<h2>📖 Overview</h2>

<p>
  <b>CertiChain</b> is a production-ready Web3 dApp that solves the global problem of academic and professional certificate forgery by combining
  <b>Ethereum</b>-backed immutability with <b>IPFS</b>-based decentralized storage.
  Institutions can issue and verifiers can validate credentials without relying on any centralized intermediary.
</p>

<ul>
  <li><b>Issuers</b>: Universities, colleges, training providers, certifying authorities.</li>
  <li><b>Holders</b>: Students, professionals, certificate owners.</li>
  <li><b>Verifiers</b>: Employers, agencies, background verification services.</li>
</ul>

<hr />

<h2>🚀 Features</h2>

<table>
  <tr>
    <td width="50%" valign="top">
      <h4>🛡️ Tamper-Proof Security</h4>
      <ul>
        <li>SHA-256 based document hashing for integrity.</li>
        <li>AES-256 encryption for sensitive certificate metadata.</li>
        <li>On-chain records are immutable once written.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h4>⚡ Instant, Trustless Verification</h4>
      <ul>
        <li>Anyone with the original file can verify authenticity in seconds.</li>
        <li>No need to contact the issuing institution.</li>
        <li>On-chain state is the single source of truth.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h4>🌐 Hybrid, Resilient Storage</h4>
      <ul>
        <li>Primary metadata storage on IPFS (CID pinned in contract).</li>
        <li>Local SQLite fallback/cache for high availability.</li>
        <li>Deterministic retrieval via CID + doc hash.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h4>🔗 Web3-Native Access Control</h4>
      <ul>
        <li>Built-in MetaMask integration for secure transaction signing.</li>
        <li>Role-based access control (RBAC) for issuers and admins.</li>
        <li>OpenZeppelin-based ownership and permission patterns.</li>
      </ul>
    </td>
  </tr>
</table>

<hr />

<h2>🏗️ Architecture</h2>

<p>
  CertiChain follows an N-tier, full-stack Web3 architecture with clear separation between presentation, application logic, blockchain layer, and storage.
</p>

<p align="center">
  <img 
    src="https://dummyimage.com/800x320/101827/ffffff&text=CertiChain+Architecture+(replace+with+Mermaid+or+Diagram+image)" 
    alt="CertiChain Architecture Diagram" 
    style="max-width: 100%; border-radius: 8px;"
  />
</p>

<ul>
  <li><b>Frontend</b>: React 18, Tailwind CSS, Ethers.js, Axios.</li>
  <li><b>Backend</b>: Node.js v18, Express, SQLite, Crypto (AES-256).</li>
  <li><b>Blockchain</b>: Solidity 0.8.19, Hardhat, OpenZeppelin.</li>
  <li><b>Storage</b>: IPFS for decentralized metadata + SQLite fallback.</li>
  <li><b>DevOps</b>: Docker, Husky, GitHub Actions-ready layout.</li>
</ul>

<hr />

<h2>🔄 System Sequence Diagram (Data Flow)</h2>

<p>
  The following sequence captures the end-to-end flow for certificate issuance and verification.
  Replace the placeholder image with your own UML/System Sequence Diagram export.
</p>

<p align="center">
  <img 
    src="https://dummyimage.com/800x420/020617/ffffff&text=System+Sequence+Diagram+(Issue+%26+Verify+Flow)" 
    alt="System Sequence Diagram" 
    style="max-width: 100%; border-radius: 8px;"
  />
</p>

<details>
  <summary><b>Click to view text-based sequence</b></summary>

  <pre>
  Actors:
    - Issuer
    - Verifier

  Components:
    - React dApp (UI)
    - Node.js Backend (API)
    - CertificateRegistry Smart Contract
    - IPFS Node

  Issue Flow:
    1. Issuer uploads certificate file + metadata via React UI.
    2. UI sends file + metadata to Node.js API (HTTPS).
    3. API hashes file (SHA-256) and encrypts metadata (AES-256).
    4. API pins encrypted metadata to IPFS and receives CID.
    5. API (via UI and MetaMask) calls issueCertificate(docHash, CID).
    6. Smart contract emits CertificateIssued event.
    7. UI shows success, tx hash, and certificate ID.

  Verify Flow:
    1. Verifier uploads a certificate file via React UI.
    2. UI sends file to Node.js API.
    3. API hashes file (SHA-256).
    4. API/contract checks if docHash exists and is not revoked.
    5. Contract returns validity + CID/metadata reference.
    6. UI displays verification result (valid / revoked / not found).
  </pre>

</details>

<hr />

<h2>🛠️ Tech Stack</h2>

<table>
  <tr>
    <th align="left">Layer</th>
    <th align="left">Technologies</th>
  </tr>
  <tr>
    <td><b>Frontend</b></td>
    <td>React 18, Tailwind CSS, Ethers.js, Axios</td>
  </tr>
  <tr>
    <td><b>Backend</b></td>
    <td>Node.js 18, Express, SQLite, Crypto (AES-256), IPFS HTTP client</td>
  </tr>
  <tr>
    <td><b>Blockchain</b></td>
    <td>Solidity 0.8.19, Hardhat, OpenZeppelin</td>
  </tr>
  <tr>
    <td><b>Storage</b></td>
    <td>IPFS (CIDs for metadata), Local SQLite fallback/cache</td>
  </tr>
  <tr>
    <td><b>DevOps</b></td>
    <td>Docker, Husky (pre-commit hooks), GitHub Actions-ready</td>
  </tr>
</table>

<hr />

<h2>� Quick Start (Local)</h2>

<p>Run the entire system locally with a single command.</p>

<h3>1. Setup</h3>
<pre>
git clone https://github.com/yourusername/certichain.git
cd certichain
npm run install:all

# Configure Environment
cp .env.example .env
</pre>

<h3>2. Run (Simplest Mode)</h3>
<p>
  <b>Windows:</b> Double-click <code>start.bat</code> in the project folder.<br/>
  <b>Terminal:</b> Run <code>.\start.bat</code>
</p>

<p>This script will automatically:</p>
<ol>
  <li>Start the local blockchain node.</li>
  <li>Deploy the smart contracts.</li>
  <li>Launch the Backend API.</li>
  <li>Launch the Frontend Dashboard (opens in browser).</li>
</ol>

<hr />

<h2>🌍 Going Live (Public Deployment)</h2>
<p>To make the application act like a live site that anyone can use:</p>

<h3>Step 1: Blockchain (Sepolia Testnet)</h3>
<ol>
  <li>Get a <b>Sepolia RPC URL</b> (from Alchemy/Infura) and a <b>Private Key</b> with Sepolia ETH.</li>
  <li>Update <code>.env</code> with these details.</li>
  <li>Deploy: <code>cd contracts && npx hardhat run scripts/deploy.js --network sepolia</code></li>
  <li>Copy the new <b>Contract Address</b>.</li>
</ol>

<h3>Step 2: Backend (Hosting)</h3>
<ol>
  <li>The backend handles IPFS and encryption. It must be online 24/7.</li>
  <li>Deploy the <code>/backend</code> folder to a service like <b>Render</b>, <b>Railway</b>, or <b>Heroku</b>.</li>
  <li>Set the environment variables (AES Key, Contract Address, RPC URL) in the hosting dashboard.</li>
</ol>

<h3>Step 3: Frontend (Hosting)</h3>
<ol>
  <li>Update <code>frontend/.env</code> with the <b>Deployed Backend URL</b> and <b>Contract Address</b>.</li>
  <li>Deploy the <code>/frontend</code> folder to <b>Vercel</b> or <b>Netlify</b>.</li>
  <li>The site is now live! Users just need MetaMask to interact.</li>
</ol>

<hr />

<h2>📄 Smart Contract Interface</h2>

<p>
  Core contract: <code>CertificateRegistry.sol</code>
</p>

<table>
  <tr>
    <th align="left">Function</th>
    <th align="left">Access</th>
    <th align="left">Description</th>
  </tr>
  <tr>
    <td><code>issueCertificate</code></td>
    <td>Issuer only</td>
    <td>Creates a new certificate with <code>docHash</code> and IPFS <code>cid</code>.</td>
  </tr>
  <tr>
    <td><code>verifyCertificate</code></td>
    <td>Public</td>
    <td>Returns validity flag and associated on-chain metadata.</td>
  </tr>
  <tr>
    <td><code>revokeCertificate</code></td>
    <td>Issuer only</td>
    <td>Marks an existing certificate as revoked, keeping full audit history.</td>
  </tr>
</table>

<p>
  The contract uses mapping-based storage and OpenZeppelin patterns to minimize gas and enforce strong access control.
</p>

<hr />

<h2>🔌 REST API Documentation</h2>

<p>Base URL (local): <code>http://localhost:&lt;PORT&gt;</code></p>

<table>
  <tr>
    <th align="left">Method</th>
    <th align="left">Endpoint</th>
    <th align="left">Description</th>
  </tr>
  <tr>
    <td><code>POST</code></td>
    <td><code>/api/issue</code></td>
    <td>Uploads a file to IPFS, hashes it, and records hash + CID on-chain.</td>
  </tr>
  <tr>
    <td><code>POST</code></td>
    <td><code>/api/verify</code></td>
    <td>Hashes an uploaded file and compares the hash against on-chain state.</td>
  </tr>
  <tr>
    <td><code>GET</code></td>
    <td><code>/api/stats</code></td>
    <td>Returns global metrics (total certificates, revoked, active issuers).</td>
  </tr>
</table>

<hr />

<h2>🛡️ Security Considerations</h2>

<ul>
  <li><b>Confidentiality</b>: Metadata is AES-256 encrypted before leaving the backend.</li>
  <li><b>Integrity</b>: SHA-256 document hashes are anchored on-chain.</li>
  <li><b>Gas Optimization</b>: Compact mappings and events reduce <code>SSTORE</code> usage.</li>
  <li><b>Role Management</b>: Issuer/admin roles enforced via contract modifiers.</li>
  <li><b>Secrets Management</b>: Sensitive keys are provided via <code>.env</code>, never hardcoded.</li>
</ul>

<hr />

<h2>🤝 Contributing</h2>

<p>Contributions, issues, and feature requests are welcome.</p>

<ol>
  <li>Fork the repository</li>
  <li>Create your feature branch: <code>git checkout -b feature/awesome-feature</code></li>
  <li>Commit your changes: <code>git commit -m "Add awesome feature"</code></li>
  <li>Push to the branch: <code>git push origin feature/awesome-feature</code></li>
  <li>Open a Pull Request</li>
</ol>

<hr />

<h2>📜 License</h2>

<p>
  Distributed under the <b>MIT License</b>. See the
  <a href="./LICENSE">LICENSE</a> file for details.
</p>

<hr />

<div align="center">

  <h3>Built with ❤️ by the CertiChain Team</h3>
  <p><i>“Securing the future of credentials, one block at a time.”</i></p>

  <p>
    <a href="https://github.com/yourusername/certichain">
      ⭐ Star this repository on GitHub
    </a>
  </p>

</div>
