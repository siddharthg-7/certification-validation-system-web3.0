const express = require('express');
const multer = require('multer');
const { encryptMetadata, decryptMetadata } = require('../utils/crypto');
const { uploadToIPFS, uploadFileToIPFS, retrieveFromIPFS, initIPFS } = require('../utils/ipfs');
const { initWeb3, issueCertificate, verifyCertificate, getCertificate, getSignerAddress, isAuthorizedIssuer, revokeCertificate, unrevokeCertificate } = require('../utils/web3');
const { insertTransaction, getAllTransactions, getTransactionByDocHash, getStats } = require('../db/database');
const { verifyCertificateMultiLayer } = require('../services/verificationEngine');
const { generateBinaryHash, generateContentHash, generatePerceptualHash } = require('../utils/hashEngine');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Initialize Web3 and IPFS on module load
let web3Ready = false;
let ipfsReady = false;

(async () => {
    try {
        await initWeb3();
        web3Ready = true;
    } catch (error) {
        console.error('Web3 initialization failed:', error.message);
    }

    try {
        ipfsReady = await initIPFS();
    } catch (error) {
        console.error('IPFS initialization failed:', error.message);
    }
})();

/**
 * POST /api/issue
 * Issue a new certificate
 */
router.post('/issue', upload.single('certificate'), async (req, res) => {
    try {
        if (!web3Ready) {
            return res.status(503).json({ error: 'Web3 not initialized' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No certificate file provided' });
        }

        // Extract metadata from request
        const metadata = {
            studentName: req.body.studentName,
            courseName: req.body.courseName,
            institution: req.body.institution,
            issueDate: req.body.issueDate,
            grade: req.body.grade,
            additionalInfo: req.body.additionalInfo
        };

        // Validate metadata
        if (!metadata.studentName || !metadata.courseName || !metadata.institution) {
            return res.status(400).json({ error: 'Missing required metadata fields' });
        }

        // Generate Multi-Layer Hashes
        const binaryHash = generateBinaryHash(req.file.buffer);
        const contentHash = await generateContentHash(req.file.buffer, req.file.mimetype);
        const imageHash = await generatePerceptualHash(req.file.buffer, req.file.mimetype);

        console.log('📄 Binary Hash:', binaryHash);
        console.log('📝 Content Hash:', contentHash);
        if (imageHash) console.log('🖼️ Image Hash:', imageHash);

        // Encrypt metadata
        const encryptionKey = process.env.AES_ENCRYPTION_KEY || 'default-key-change-this-in-production';
        const encryptedData = encryptMetadata(metadata, encryptionKey);

        // Upload certificate file to IPFS
        const fileCID = await uploadFileToIPFS(req.file.buffer, req.file.originalname);
        console.log('📤 Certificate file uploaded:', fileCID);

        // Upload encrypted metadata to IPFS (including file CID)
        const ipfsCID = await uploadToIPFS({
            encrypted: encryptedData.encrypted,
            iv: encryptedData.iv,
            algorithm: encryptedData.algorithm,
            fileCID: fileCID,  // Reference to the actual certificate file
            filename: req.file.originalname,
            mimetype: req.file.mimetype
        });

        console.log('🔐 Encrypted metadata uploaded:', ipfsCID);

        // Issue certificate on blockchain
        const txReceipt = await issueCertificate(binaryHash, contentHash, imageHash, ipfsCID);

        // Store transaction in database WITH NEW COLUMNS
        const issuerAddress = getSignerAddress();
        await insertTransaction({
            txHash: txReceipt.transactionHash,
            docHash: binaryHash,
            contentHash: contentHash,
            imageHash: imageHash,
            ipfsCID: ipfsCID,
            issuer: issuerAddress,
            timestamp: Math.floor(Date.now() / 1000),
            status: 'confirmed',
            blockNumber: txReceipt.blockNumber,
            gasUsed: txReceipt.gasUsed
        });

        res.json({
            success: true,
            message: 'Certificate issued successfully',
            data: {
                docHash: binaryHash,
                contentHash: contentHash,
                imageHash: imageHash,
                ipfsCID: ipfsCID,
                transactionHash: txReceipt.transactionHash,
                blockNumber: txReceipt.blockNumber,
                issuer: issuerAddress
            }
        });

    } catch (error) {
        console.error('Certificate issuance error:', error);
        res.status(500).json({
            error: 'Failed to issue certificate',
            details: error.message
        });
    }
});

/**
 * POST /api/verify
 * Verify a certificate using Multi-Layer Verification
 */
router.post('/verify', upload.single('certificate'), async (req, res) => {
    try {
        if (!web3Ready) {
            return res.status(503).json({ error: 'Web3 not initialized' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No certificate file provided' });
        }

        // Run Multi-Layer Verification
        const verificationResult = await verifyCertificateMultiLayer(req.file.buffer, req.file.mimetype);

        if (!verificationResult.isValid) {
            return res.json({
                valid: false,
                message: 'Certificate verification failed across all layers',
                details: verificationResult.details
            });
        }

        // Retrieve and decrypt metadata if found
        let metadata = null;
        const certData = verificationResult.details.onChainData;

        try {
            if (certData && certData.ipfsCID) {
                const encryptedData = await retrieveFromIPFS(certData.ipfsCID);
                const encryptionKey = process.env.AES_ENCRYPTION_KEY || 'default-key-change-this-in-production';
                metadata = decryptMetadata(encryptedData.encrypted, encryptedData.iv, encryptionKey);
            }
        } catch (error) {
            console.warn('Failed to retrieve metadata:', error.message);
        }

        res.json({
            valid: true,
            matchType: verificationResult.matchType,
            message: `Certificate verified via ${verificationResult.matchType} match`,
            details: verificationResult.details,
            certificate: {
                docHash: certData.binaryHash || certData.docHash, // Handle both property names
                issuer: certData.issuer,
                timestamp: certData.timestamp,
                ipfsCID: certData.ipfsCID,
                metadata: metadata,
                isRevoked: certData.isRevoked,
                issuedDate: new Date(parseInt(certData.timestamp) * 1000).toISOString()
            }
        });

    } catch (error) {
        console.error('Certificate verification error:', error);
        res.status(500).json({
            error: 'Failed to verify certificate',
            details: error.message
        });
    }
});

/**
 * POST /api/revoke
 * Revoke a certificate
 */
router.post('/revoke', async (req, res) => {
    try {
        if (!web3Ready) {
            return res.status(503).json({ error: 'Web3 not initialized' });
        }

        const { docHash } = req.body; // Actually binaryHash
        if (!docHash) {
            return res.status(400).json({ error: 'Document hash is required' });
        }

        const txReceipt = await revokeCertificate(docHash); // Assumes we updated revokeCertificate to import from web3

        // Note: revokeCertificate needs to be imported from web3 if not already in closure,
        // Wait, I didn't import revokeCertificate in the requires at top.
        // It was there in original file.
        // Let me check my imports. 
        // Yes: const { ..., revokeCertificate, unrevokeCertificate, ... } = require('../utils/web3');
        // Wait, I missed importing revoke/unrevoke in the `require` block I wrote above!
        // I will fix this in the actual file content below.

        // Actually, looking at my `write_to_file` call preparation:
        // const { initWeb3, issueCertificate, verifyCertificate, getCertificate, getSignerAddress, isAuthorizedIssuer } = require('../utils/web3');
        // I missed revokeCertificate and unrevokeCertificate!

        res.json({
            success: true,
            message: 'Certificate revoked successfully',
            transactionHash: txReceipt.transactionHash
        });

    } catch (error) {
        console.error('Revocation error:', error);
        res.status(500).json({
            error: 'Failed to revoke certificate',
            details: error.message
        });
    }
});

/**
 * POST /api/unrevoke
 * Unrevoke a certificate
 */
router.post('/unrevoke', async (req, res) => {
    try {
        if (!web3Ready) {
            return res.status(503).json({ error: 'Web3 not initialized' });
        }

        const { docHash } = req.body;
        if (!docHash) {
            return res.status(400).json({ error: 'Document hash is required' });
        }

        // Need to import unrevokeCertificate
        const { unrevokeCertificate } = require('../utils/web3');
        const txReceipt = await unrevokeCertificate(docHash);

        res.json({
            success: true,
            message: 'Certificate unrevoked successfully',
            transactionHash: txReceipt.transactionHash
        });

    } catch (error) {
        console.error('Unrevocation error:', error);
        res.status(500).json({
            error: 'Failed to unrevoke certificate',
            details: error.message
        });
    }
});

/**
 * GET /api/cert/:hash
 * Get certificate details by hash
 */
router.get('/cert/:hash', async (req, res) => {
    try {
        if (!web3Ready) {
            return res.status(503).json({ error: 'Web3 not initialized' });
        }

        const docHash = req.params.hash;

        // Ensure hash has 0x prefix
        const formattedHash = docHash.startsWith('0x') ? docHash : '0x' + docHash;

        // Get certificate from blockchain
        const certData = await getCertificate(formattedHash);

        if (!certData.exists) {
            return res.status(404).json({
                error: 'Certificate not found',
                docHash: formattedHash
            });
        }

        // Try to get metadata
        let metadata = null;
        try {
            const encryptedData = await retrieveFromIPFS(certData.ipfsCID);
            const encryptionKey = process.env.AES_ENCRYPTION_KEY || 'default-key-change-this-in-production';
            metadata = decryptMetadata(encryptedData.encrypted, encryptedData.iv, encryptionKey);
        } catch (error) {
            console.warn('Failed to retrieve metadata:', error.message);
        }

        res.json({
            exists: true,
            certificate: {
                docHash: certData.binaryHash || certData.docHash,
                issuer: certData.issuer,
                timestamp: certData.timestamp,
                ipfsCID: certData.ipfsCID,
                metadata: metadata,
                isRevoked: certData.isRevoked,
                issuedDate: new Date(parseInt(certData.timestamp) * 1000).toISOString()
            }
        });

    } catch (error) {
        console.error('Get certificate error:', error);
        res.status(500).json({
            error: 'Failed to get certificate',
            details: error.message
        });
    }
});

/**
 * GET /api/transactions
 * Get all transactions
 */
router.get('/transactions', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        const transactions = await getAllTransactions(limit, offset);

        res.json({
            success: true,
            count: transactions.length,
            transactions: transactions
        });

    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({
            error: 'Failed to get transactions',
            details: error.message
        });
    }
});

/**
 * GET /api/stats
 * Get system statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const stats = await getStats();
        const signerAddress = getSignerAddress();
        const isAuthorized = signerAddress ? await isAuthorizedIssuer(signerAddress) : false;

        res.json({
            success: true,
            stats: {
                ...stats,
                signerAddress: signerAddress,
                isAuthorizedIssuer: isAuthorized,
                web3Ready: web3Ready,
                ipfsReady: ipfsReady,
                network: process.env.HARDHAT_NETWORK || 'localhost'
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            error: 'Failed to get stats',
            details: error.message
        });
    }
});

module.exports = router;
