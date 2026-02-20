const sharp = require('sharp');
// const blockhash = require('blockhash');
const { Readable } = require('stream');

/**
 * Generate a perceptual hash (pHash) for an image
 * @param {Buffer} buffer - Image buffer
 * @returns {Promise<string>} Hex string of the perceptual hash
 */
async function generateImageHash(buffer) {
    try {
        console.log('🖼️ Generating image fingerprint...');

        // Convert buffer to stream for some libraries if needed, 
        // but sharp handles buffers directly.

        const dHash = await computeDHash(buffer);
        console.log('✅ Image hash generated:', dHash);
        return dHash;

    } catch (error) {
        console.error('❌ Image fingerprinting failed:', error);
        return '';
    }
}

/**
 * Compute Difference Hash (dHash)
 * 1. Resize to 9x8 (72 pixels)
 * 2. Grayscale
 * 3. Calculate difference between adjacent pixels
 * @param {Buffer} buffer 
 */
async function computeDHash(buffer) {
    const width = 9;
    const height = 8;

    const { data } = await sharp(buffer)
        .resize(width, height, { fit: 'fill' })
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });

    let hash = '';

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width - 1; x++) {
            const left = data[y * width + x];
            const right = data[y * width + x + 1];
            hash += (left > right ? '1' : '0');
        }
    }

    // Convert binary string to hex using BigInt for 64-bit precision
    return BigInt('0b' + hash).toString(16).padStart(16, '0');
}

/**
 * Compare two image hashes and return similarity percentage
 * @param {string} hash1 
 * @param {string} hash2 
 * @returns {number} Similarity percentage (0-100)
 */
function compareImageHashes(hash1, hash2) {
    if (!hash1 || !hash2 || hash1.length !== hash2.length) return 0;

    let hammingDistance = 0;

    // Convert hex to binary strings
    const bin1 = BigInt('0x' + hash1).toString(2).padStart(64, '0');
    const bin2 = BigInt('0x' + hash2).toString(2).padStart(64, '0');

    for (let i = 0; i < bin1.length; i++) {
        if (bin1[i] !== bin2[i]) {
            hammingDistance++;
        }
    }

    // dHash is 64 bits (8x8)
    // Similarity = (64 - distance) / 64
    const similarity = ((64 - hammingDistance) / 64) * 100;
    return Math.round(similarity * 100) / 100; // Round to 2 decimals
}

module.exports = {
    generateImageHash,
    compareImageHashes
};
