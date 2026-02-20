const crypto = require('crypto');
const { generateImageHash } = require('./imageFingerprint');
const { extractContent } = require('./contentExtractor');

/**
 * Hash Engine - Centralized hashing logic
 */

/**
 * Strict SHA-256 Binary Hash (Existing Method)
 * @param {Buffer} buffer 
 * @returns {string} Hex string with 0x prefix
 */
function generateBinaryHash(buffer) {
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    return '0x' + hash;
}

/**
 * Content Hash - Normalize text & structure
 * @param {Buffer} buffer 
 * @param {string} mimeType 
 * @returns {Promise<string>} Hex string with 0x prefix
 */
async function generateContentHash(buffer, mimeType) {
    const content = await extractContent(buffer, mimeType);
    if (!content) return '0x0000000000000000000000000000000000000000000000000000000000000000'; // Return empty hash
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    return '0x' + hash;
}

/**
 * Image Fingerprint - Perceptual Hash
 * @param {Buffer} buffer 
 * @param {string} mimeType 
 * @returns {Promise<string>} Hex string with 0x prefix (or empty if not image)
 */
async function generatePerceptualHash(buffer, mimeType) {
    if (!mimeType.startsWith('image/')) {
        return '0x0000000000000000000000000000000000000000000000000000000000000000';
    }
    const hash = await generateImageHash(buffer);
    // Pad to 32 bytes (64 hex chars) for Solidity bytes32 compatibility if needed, 
    // or store as string. Solidity bytes32 is fixed size.
    // dHash is usually 64 bits (16 hex chars). 
    // We can pad it to 64 chars (32 bytes) to fit bytes32.
    return '0x' + hash.padEnd(64, '0');
}

module.exports = {
    generateBinaryHash,
    generateContentHash,
    generatePerceptualHash
};
