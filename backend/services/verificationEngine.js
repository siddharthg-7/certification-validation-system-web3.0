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
        // Step 1: Binary Integrity
        // SHA256 match -> AUTHENTIC. This is the only true proof of originality.
        // ---------------------------------------------------------
        try {
            const cert = await verifyCertificate(binaryHash);
            if (cert && cert.exists) {
                onChainCert = cert;
                matchType = 'EXACT';
                console.log('✅ Exact Binary Match Found');
                
                return {
                    isValid: true,
                    matchType: 'EXACT',
                    message: "Authentic Certificate",
                    details: {
                        binaryMatch: true,
                        contentMatch: true,
                        imageSimilarity: 100,
                        onChainData: onChainCert,
                        verificationTimestamp: new Date().toISOString()
                    }
                };
            }
        } catch (e) {
            console.log('⚠️ Binary match check failed or not found');
        }

        // ---------------------------------------------------------
        // Step 2: If Hash Fails
        // Check similarity and OCR to detect tampering.
        // pHash distance <= 5 -> MODIFIED CERTIFICATE
        // ---------------------------------------------------------
        let bestDistance = 64;
        let matchedDocHash = null;

        if (localImageHash && mimeType.startsWith('image/')) {
            console.log('🔍 Checking Image Similarity for Modifications...');
            try {
                const allHashes = await getAllImageHashes();

                for (const record of allHashes) {
                    if (!record.imageHash) continue;

                    const dbHash = record.imageHash.replace(/^0x/, '');
                    const locHash = localImageHash.replace(/^0x/, '');

                    let hammingDistance = 0;
                    const bin1 = BigInt('0x' + locHash).toString(2).padStart(64, '0');
                    const bin2 = BigInt('0x' + dbHash).toString(2).padStart(64, '0');

                    for (let i = 0; i < 64; i++) {
                        if (bin1[i] !== bin2[i]) hammingDistance++;
                    }

                    if (hammingDistance < bestDistance) {
                        bestDistance = hammingDistance;
                        matchedDocHash = record.docHash;
                    }
                }

                console.log(`   Best Hamming Distance: ${bestDistance}`);
            } catch (e) {
                console.error('⚠️ Image similarity check failed:', e);
            }
        }

        // Determine Modify vs Invalid
        // Note: distance <= 2 is identical visually, distance <= 5 is similar, > 5 is different.
        // If it was authentic, Binary Match would have caught it.
        // We will classify distance <= 5 as "Possible Modified Certificate"
        let isModified = false;
        
        // We also check content hash for exact text matches (like PDFs that were re-saved)
        let exactContentMatch = false;
        if (contentHash && !mimeType.startsWith('image/')) {
             try {
                 const cert = await verifyCertificateByContent(contentHash);
                 if (cert && cert.exists) {
                     exactContentMatch = true;
                     isModified = true; // Was modified from original binary form
                 }
             } catch (e) { }
        }

        // Mocked ocrSimilarity check logic (actual implementation can expand this)
        let ocrSimilarityPlaceholder = 1.0; 
        
        if ((mimeType.startsWith('image/') && bestDistance <= 5) || exactContentMatch) {
            return {
                isValid: false,
                matchType: 'MODIFIED',
                message: "Possible Modified Certificate",
                details: {
                    binaryMatch: false,
                    contentMatch: exactContentMatch,
                    imageSimilarity: mimeType.startsWith('image/') ? ((64 - bestDistance) / 64) * 100 : 0,
                    onChainData: null,
                    verificationTimestamp: new Date().toISOString()
                }
            };
        }

        // ---------------------------------------------------------
        // Step 3: If Both Fail -> INVALID CERTIFICATE
        // ---------------------------------------------------------
        return {
            isValid: false,
            matchType: 'NONE',
            message: "Invalid Certificate",
            details: {
                binaryMatch: false,
                contentMatch: false,
                imageSimilarity: mimeType.startsWith('image/') ? ((64 - bestDistance) / 64) * 100 : 0,
                onChainData: null,
                verificationTimestamp: new Date().toISOString()
            }
        };

    } catch (error) {
        console.error('Verification Engine Error:', error);
        throw error;
    }
}

module.exports = {
    verifyCertificateMultiLayer
};
