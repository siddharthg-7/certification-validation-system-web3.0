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

        if (process.env.HARDHAT_NETWORK !== 'localhost' && chainId.toString() !== '11155111') {
            console.warn(`⚠️  Warning: Expected Sepolia (11155111) but connected to Chain ID ${chainId}. Check your RPC URL.`);
        }

        const localAbiPath = path.join(__dirname, '../CertificateRegistry.json');
        let contractAddress;
        let abi;

        if (fs.existsSync(localAbiPath)) {
            const contractData = JSON.parse(fs.readFileSync(localAbiPath, 'utf8'));
            abi = contractData.abi;
            contractAddress = process.env.CONTRACT_ADDRESS;
            if (!contractAddress) {
                console.warn("⚠️ CONTRACT_ADDRESS not set in .env, checking artifact...");
            }
        } else {
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
            contractAddress = process.env.CONTRACT_ADDRESS;
        }

        if (!contractAddress) {
            throw new Error("Contract Address not found! Set CONTRACT_ADDRESS in .env");
        }

        console.log('📜 Contract address:', contractAddress);

        if (process.env.PRIVATE_KEY) {
            signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
            contract = new ethers.Contract(contractAddress, abi, signer);
        } else {
            contract = new ethers.Contract(contractAddress, abi, provider);
            console.warn('⚠️  No private key provided, contract is read-only');
        }

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
 * @param {string} binaryHash 
 * @param {string} contentHash 
 * @param {string} imageHash 
 * @param {string} ipfsCID 
 * @returns {Promise<Object>} Transaction receipt
 */
async function issueCertificate(binaryHash, contentHash, imageHash, ipfsCID) {
    if (!contract || !signer) {
        throw new Error('Contract not initialized or no signer available');
    }

    try {
        console.log('📝 Issuing certificate...');
        console.log('   Binary Hash:', binaryHash);
        console.log('   Content Hash:', contentHash);
        console.log('   Image Hash:', imageHash);
        console.log('   CID:', ipfsCID);

        const tx = await contract.issueCertificate(binaryHash, contentHash, imageHash, ipfsCID);
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
 * Verify a certificate by binary hash
 * @param {string} binaryHash 
 * @returns {Promise<Object>} Certificate details
 */
async function verifyCertificate(binaryHash) {
    if (!contract) {
        throw new Error('Contract not initialized');
    }

    try {
        const result = await contract.verifyCertificate(binaryHash);
        return {
            exists: result.exists,
            binaryHash: binaryHash,
            contentHash: result.contentHash,
            imageHash: result.imageHash,
            ipfsCID: result.ipfsCID,
            issuer: result.issuer,
            timestamp: result.timestamp.toString(),
            isRevoked: result.isRevoked
        };
    } catch (error) {
        // console.error('Certificate verification failed:', error);
        // Clean error handling for "not found"
        return { exists: false };
    }
}

/**
 * Verify a certificate by content hash
 * @param {string} contentHash 
 * @returns {Promise<Object>} Certificate details
 */
async function verifyCertificateByContent(contentHash) {
    if (!contract) throw new Error('Contract not initialized');
    try {
        const result = await contract.verifyCertificateByContent(contentHash);
        return {
            exists: result.exists,
            binaryHash: result.binaryHash,
            contentHash: contentHash, // Returned value might be binaryHash from mapping, but verification confirms existence
            imageHash: result.imageHash,
            ipfsCID: result.ipfsCID,
            issuer: result.issuer,
            timestamp: result.timestamp.toString(),
            isRevoked: result.isRevoked
        };
    } catch (error) {
        return { exists: false };
    }
}

/**
 * Verify a certificate by image hash
 * @param {string} imageHash 
 * @returns {Promise<Object>} Certificate details
 */
async function verifyCertificateByImage(imageHash) {
    if (!contract) throw new Error('Contract not initialized');
    try {
        const result = await contract.verifyCertificateByImage(imageHash);
        return {
            exists: result.exists,
            binaryHash: result.binaryHash,
            contentHash: result.contentHash,
            imageHash: imageHash,
            ipfsCID: result.ipfsCID,
            issuer: result.issuer,
            timestamp: result.timestamp.toString(),
            isRevoked: result.isRevoked
        };
    } catch (error) {
        return { exists: false };
    }
}

async function getCertificate(binaryHash) {
    // Same as verifyCertificate essentially
    return await verifyCertificate(binaryHash);
}

async function revokeCertificate(binaryHash) {
    if (!contract || !signer) throw new Error('Contract not initialized');
    const tx = await contract.revokeCertificate(binaryHash);
    const receipt = await tx.wait();
    return { transactionHash: receipt.hash, blockNumber: receipt.blockNumber };
}

async function unrevokeCertificate(binaryHash) {
    if (!contract || !signer) throw new Error('Contract not initialized');
    const tx = await contract.unrevokeCertificate(binaryHash);
    const receipt = await tx.wait();
    return { transactionHash: receipt.hash, blockNumber: receipt.blockNumber };
}

async function isAuthorizedIssuer(address) {
    if (!contract) return false;
    try {
        return await contract.isAuthorizedIssuer(address);
    } catch (error) {
        return false;
    }
}

function getSignerAddress() {
    return signer ? signer.address : null;
}

module.exports = {
    initWeb3,
    issueCertificate,
    verifyCertificate,
    verifyCertificateByContent,
    verifyCertificateByImage,
    getCertificate,
    revokeCertificate,
    unrevokeCertificate,
    isAuthorizedIssuer,
    getSignerAddress
};
