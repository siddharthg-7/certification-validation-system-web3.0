const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

let provider = null;
let contract = null;
let signer = null;

/**
 * Initialize Web3 provider and contract instance
 */
async function initWeb3() {
    try {
        const rpcUrl = process.env.HARDHAT_NETWORK === 'localhost'
            ? 'http://127.0.0.1:8545'
            : (process.env.SEPOLIA_RPC_URL || process.env.RPC_URL);

        if (!rpcUrl) {
            throw new Error('No RPC URL found. Please set SEPOLIA_RPC_URL or RPC_URL in environment variables.');
        }

        provider = new ethers.JsonRpcProvider(rpcUrl);

        // Test connection
        const network = await provider.getNetwork();
        const chainId = network.chainId;
        console.log('🌐 Connected to network:', network.name, '(Chain ID:', chainId.toString() + ')');

        // Verify we are on the correct network if not localhost
        if (process.env.HARDHAT_NETWORK !== 'localhost' && chainId.toString() !== '11155111') {
            console.warn(`⚠️  Warning: Expected Sepolia (11155111) but connected to Chain ID ${chainId}. Check your RPC URL.`);
        }

        // Load contract deployment info
        // Load contract ABI and Address
        // In production (Render), we look for the file in the backend root
        const localAbiPath = path.join(__dirname, '../CertificateRegistry.json');

        let contractAddress;
        let abi;

        if (fs.existsSync(localAbiPath)) {
            // Production / Simplified Setup
            const contractData = JSON.parse(fs.readFileSync(localAbiPath, 'utf8'));
            abi = contractData.abi;
            contractAddress = process.env.CONTRACT_ADDRESS; // Always use env var in production

            if (!contractAddress) {
                // Determine address from file if not in env
                // (Note: The hardhat artifact usually doesn't have the address directly, 
                // so we rely on ENV or a separate deployment file. For this fix, we rely on ENV).
                console.warn("⚠️ CONTRACT_ADDRESS not set in .env, checking artifact...");
            }
        } else {
            // Development fallback (local contracts folder)
            const deploymentPath = path.join(__dirname, '../../contracts/deployments/CertificateRegistry.json');
            const abiPath = path.join(__dirname, '../../contracts/deployments/CertificateRegistry-ABI.json');

            if (fs.existsSync(deploymentPath) && fs.existsSync(abiPath)) {
                const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
                abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
                contractAddress = deployment.contractAddress;
            } else {
                throw new Error('Contract ABI not found. Please ensure CertificateRegistry.json is in the backend root.');
            }
        }

        if (!contractAddress) {
            // Final fallback to env if we loaded ABI but somehow missed address
            contractAddress = process.env.CONTRACT_ADDRESS;
        }

        if (!contractAddress) {
            throw new Error("Contract Address not found! Set CONTRACT_ADDRESS in .env");
        }

        console.log('📜 Contract address:', contractAddress);


        // Create signer from private key
        if (process.env.PRIVATE_KEY) {
            signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
            console.log('🔑 Signer address:', signer.address);

            // Create contract instance with signer
            contract = new ethers.Contract(contractAddress, abi, signer);
        } else {
            // Read-only contract instance
            contract = new ethers.Contract(contractAddress, abi, provider);
            console.warn('⚠️  No private key provided, contract is read-only');
        }

        // Verify contract is deployed
        const code = await provider.getCode(contractAddress);
        if (code === '0x') {
            throw new Error('No contract deployed at specified address');
        }

        console.log('✅ Web3 initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Web3 initialization failed:', error.message);
        throw error;
    }
}

/**
 * Issue a certificate on the blockchain
 * @param {string} docHash - Document hash (with 0x prefix)
 * @param {string} ipfsCID - IPFS CID or local storage identifier
 * @returns {Promise<Object>} Transaction receipt
 */
async function issueCertificate(docHash, ipfsCID) {
    if (!contract || !signer) {
        throw new Error('Contract not initialized or no signer available');
    }

    try {
        console.log('📝 Issuing certificate...');
        console.log('   Hash:', docHash);
        console.log('   CID:', ipfsCID);

        const tx = await contract.issueCertificate(docHash, ipfsCID);
        console.log('⏳ Transaction sent:', tx.hash);

        const receipt = await tx.wait();
        console.log('✅ Certificate issued! Block:', receipt.blockNumber);

        return {
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString()
        };
    } catch (error) {
        console.error('Certificate issuance failed:', error);
        throw new Error(`Failed to issue certificate: ${error.message}`);
    }
}

/**
 * Verify a certificate on the blockchain
 * @param {string} docHash - Document hash (with 0x prefix)
 * @returns {Promise<Object>} Certificate details
 */
async function verifyCertificate(docHash) {
    if (!contract) {
        throw new Error('Contract not initialized');
    }

    try {
        console.log('🔍 Verifying certificate:', docHash);

        const result = await contract.verifyCertificate(docHash);

        return {
            exists: result.exists,
            ipfsCID: result.ipfsCID,
            issuer: result.issuer,
            timestamp: result.timestamp.toString(),
            isRevoked: result.isRevoked
        };
    } catch (error) {
        console.error('Certificate verification failed:', error);
        throw new Error(`Failed to verify certificate: ${error.message}`);
    }
}

/**
 * Get full certificate details
 * @param {string} docHash - Document hash (with 0x prefix)
 * @returns {Promise<Object>} Full certificate object
 */
async function getCertificate(docHash) {
    if (!contract) {
        throw new Error('Contract not initialized');
    }

    try {
        const cert = await contract.getCertificate(docHash);

        return {
            docHash: cert.docHash,
            ipfsCID: cert.ipfsCID,
            issuer: cert.issuer,
            timestamp: cert.timestamp.toString(),
            exists: cert.exists,
            isRevoked: cert.isRevoked
        };
    } catch (error) {
        console.error('Failed to get certificate:', error);
        throw new Error(`Failed to get certificate: ${error.message}`);
    }
}

/**
 * Revoke a certificate on the blockchain
 * @param {string} docHash - Document hash (with 0x prefix)
 * @returns {Promise<Object>} Transaction receipt
 */
async function revokeCertificate(docHash) {
    if (!contract || !signer) {
        throw new Error('Contract not initialized or no signer available');
    }

    try {
        console.log('🚫 Revoking certificate:', docHash);
        const tx = await contract.revokeCertificate(docHash);
        const receipt = await tx.wait();
        return {
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber
        };
    } catch (error) {
        console.error('Revocation failed:', error);
        throw new Error(`Failed to revoke certificate: ${error.message}`);
    }
}

/**
 * Unrevoke a certificate on the blockchain
 * @param {string} docHash - Document hash (with 0x prefix)
 * @returns {Promise<Object>} Transaction receipt
 */
async function unrevokeCertificate(docHash) {
    if (!contract || !signer) {
        throw new Error('Contract not initialized or no signer available');
    }

    try {
        console.log('✅ Unrevoking certificate:', docHash);
        const tx = await contract.unrevokeCertificate(docHash);
        const receipt = await tx.wait();
        return {
            transactionHash: receipt.hash,
            blockNumber: receipt.blockNumber
        };
    } catch (error) {
        console.error('Unrevocation failed:', error);
        throw new Error(`Failed to unrevoke certificate: ${error.message}`);
    }
}

/**
 * Check if an address is an authorized issuer
 * @param {string} address - Ethereum address
 * @returns {Promise<boolean>} Authorization status
 */
async function isAuthorizedIssuer(address) {
    if (!contract) {
        throw new Error('Contract not initialized');
    }

    try {
        return await contract.isAuthorizedIssuer(address);
    } catch (error) {
        console.error('Failed to check issuer authorization:', error);
        return false;
    }
}

/**
 * Get current signer address
 * @returns {string|null} Signer address or null
 */
function getSignerAddress() {
    return signer ? signer.address : null;
}

/**
 * Get provider instance
 * @returns {ethers.Provider|null} Provider instance
 */
function getProvider() {
    return provider;
}

/**
 * Get contract instance
 * @returns {ethers.Contract|null} Contract instance
 */
function getContract() {
    return contract;
}

module.exports = {
    initWeb3,
    issueCertificate,
    verifyCertificate,
    getCertificate,
    revokeCertificate,
    unrevokeCertificate,
    isAuthorizedIssuer,
    getSignerAddress,
    getProvider,
    getContract
};
