const pdfParse = require('pdf-parse');
// const tesseract = require('tesseract.js');
const tesseract = null; // Tesseract disabled temporarily to prevent crashes
const mammoth = require('mammoth');

/**
 * Clean and normalize text content for consistent hashing
 * @param {string} text - Raw extracted text
 * @returns {string} Normalized text
 */
function normalizeContent(text) {
    if (!text) return '';
    return text
        .replace(/\s+/g, ' ')           // Replace multiple spaces/newlines with single space
        .trim()                         // Remove leading/trailing whitespace
        .toLowerCase()                  // Convert to lowercase
        .replace(/[^\w\s]/g, '');       // Remove punctuation (optional, but good for robust comparison)
}

/**
 * Extract text from a buffer based on mime type
 * @param {Buffer} buffer - File buffer
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} Extracted and normalized text
 */
async function extractContent(buffer, mimeType) {
    try {
        let text = '';
        console.log(`📄 Extracting content from ${mimeType}...`);

        if (mimeType === 'application/pdf') {
            const data = await pdfParse(buffer);
            text = data.text;
        } else if (mimeType.startsWith('image/')) {
            // const result = await tesseract.recognize(buffer, 'eng');
            // text = result.data.text;
            console.log('🖼️  [Image text extraction disabled for stability]');
            text = 'Image Content (OCR Pending)';
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') { // DOCX
            const result = await mammoth.extractRawText({ buffer: buffer });
            text = result.value;
        } else if (mimeType === 'application/json') {
            const json = JSON.parse(buffer.toString());
            // Flatten JSON values to string
            text = JSON.stringify(json);
        } else if (mimeType === 'text/plain') {
            text = buffer.toString();
        } else {
            console.warn(`⚠️ Unsupported mime type for content extraction: ${mimeType}`);
            return '';
        }

        const normalized = normalizeContent(text);
        console.log(`✅ Extracted ${normalized.length} characters`);
        return normalized;

    } catch (error) {
        console.error('❌ Content extraction failed:', error.message);
        return '';
    }
}

module.exports = {
    extractContent,
    normalizeContent
};
