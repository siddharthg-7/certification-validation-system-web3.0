const { generateContentHash, generatePerceptualHash, generateBinaryHash } = require('../utils/hashEngine');
const { extractContent } = require('../utils/contentExtractor');
const { generateImageHash, compareImageHashes } = require('../utils/imageFingerprint');
const { verifyCertificate, verifyCertificateByContent, getCertificate } = require('../utils/web3');
const { getAllImageHashes } = require('../db/database');

/**
 * Intelligent Verification Service
 */

/**
 * Verify a certificate using multi-layer logic
 * @param {Buffer} fileBuffer - Uploaded file buffer
 * @param {string} mimeType - File mime type
 * @returns {Promise<Object>} Detailed verification result
 */
async function verifyCertificateMultiLayer(fileBuffer, mimeType) {
    try {
        console.log('🚀 Starting Multi-Layer Verification...');

        // 1. Generate Local Hashes
        const binaryHash = generateBinaryHash(fileBuffer);
        const contentHash = await generateContentHash(fileBuffer, mimeType);

        let localImageHash = null;
        if (mimeType.startsWith('image/')) {
            localImageHash = await generatePerceptualHash(fileBuffer, mimeType);
        }

        console.log('📊 Local Hashes Generated:');
        console.log(`   Binary: ${binaryHash}`);
        console.log(`   Content: ${contentHash}`);
        if (localImageHash) console.log(`   Image: ${localImageHash}`);

        let onChainCert = null;
        let matchType = 'NONE';

        // ---------------------------------------------------------
        // Layer 1: Exact Binary Match
        // ---------------------------------------------------------
        try {
            const cert = await verifyCertificate(binaryHash);
            if (cert && cert.exists) {
                onChainCert = cert;
                matchType = 'EXACT';
                console.log('✅ Exact Binary Match Found');
            }
        } catch (e) {
            console.log('⚠️ Binary match check failed or not found');
        }

        // ---------------------------------------------------------
        // Layer 2: Content Match (if Binary Failed)
        // ---------------------------------------------------------
        if (!onChainCert && contentHash) {
            try {
                const cert = await verifyCertificateByContent(contentHash);
                if (cert && cert.exists) {
                    onChainCert = cert;
                    matchType = 'CONTENT';
                    console.log('✅ Content Match Found');
                }
            } catch (e) {
                console.log('⚠️ Content match check failed or not found');
            }
        }

        // ---------------------------------------------------------
        // Layer 3: Image Similarity (if Content Failed & Is Image)
        // ---------------------------------------------------------

        // Variable to track best similarity result
        let bestImageMatch = { similarity: 0, docHash: null };

        if (!onChainCert && localImageHash && mimeType.startsWith('image/')) {
            console.log('🔍 Checking Image Similarity...');
            try {
                // Fetch all image hashes from local DB (as an index for on-chain certificates)
                const allHashes = await getAllImageHashes();

                for (const record of allHashes) {
                    if (!record.imageHash) continue;

                    // Remove 0x prefix if present for comparison logic
                    const dbHash = record.imageHash.replace(/^0x/, '');
                    const locHash = localImageHash.replace(/^0x/, '');

                    const similarity = compareImageHashes(locHash, dbHash);

                    if (similarity > bestImageMatch.similarity) {
                        bestImageMatch = { similarity, docHash: record.docHash };
                    }
                }

                console.log(`   Best Similarity: ${bestImageMatch.similarity}%`);

                if (bestImageMatch.similarity >= 90) { // Threshold
                    try {
                        const cert = await getCertificate(bestImageMatch.docHash);
                        if (cert && cert.exists) {
                            onChainCert = cert;
                            matchType = 'IMAGE';
                            console.log('✅ Image Similarity Match Confirmed');
                        }
                    } catch (e) {
                        console.warn('Failed to verify candidate certificate on-chain');
                    }
                }
            } catch (e) {
                console.error('⚠️ Image similarity check failed:', e);
            }
        }

        // ---------------------------------------------------------
        // Construct Result
        // ---------------------------------------------------------
        const result = {
            isValid: false,
            matchType: matchType, // EXACT, CONTENT, IMAGE, NONE
            details: {
                binaryMatch: matchType === 'EXACT',
                contentMatch: matchType === 'EXACT' || matchType === 'CONTENT',
                imageSimilarity: matchType === 'IMAGE' ? bestImageMatch.similarity : (matchType === 'EXACT' ? 100 : 0),
                onChainData: null,
                verificationTimestamp: new Date().toISOString()
            }
        };

        if (onChainCert) {
            result.isValid = true;
            result.details.onChainData = onChainCert;

            // If it was an exact match, set implied values
            if (matchType === 'EXACT') {
                result.details.contentMatch = true;
                if (mimeType.startsWith('image/')) result.details.imageSimilarity = 100;
            }
        }

        return result;

    } catch (error) {
        console.error('Verification Engine Error:', error);
        throw error;
    }
}

module.exports = {
    verifyCertificateMultiLayer
};
