const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Configuration
const USE_IPFS = process.env.USE_IPFS === 'true';
const IPFS_PROVIDER = process.env.IPFS_PROVIDER || 'local'; // 'local', 'pinata', 'ipfs-node'
const IPFS_STORAGE_PATH = process.env.IPFS_STORAGE_PATH || path.join(__dirname, '../ipfs-storage');

// Pinata Config
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

let ipfsClient = null;

// Initialize IPFS client if enabled
async function initIPFS() {
    if (!USE_IPFS) {
        console.log('📁 Using local filesystem storage (IPFS disabled)');
        return false;
    }

    if (IPFS_PROVIDER === 'pinata') {
        if (!process.env.PINATA_JWT) {
            console.warn('⚠️  Pinata JWT missing, falling back to local storage');
            return false;
        }
        console.log('✅ Pinata integration initialized');
        return true;
    } else if (IPFS_PROVIDER === 'ipfs-node') {
        try {
            const { create } = await import('ipfs-http-client');
            ipfsClient = create({
                host: process.env.IPFS_HOST || 'localhost',
                port: process.env.IPFS_PORT || 5001,
                protocol: process.env.IPFS_PROTOCOL || 'http'
            });
            console.log('✅ Local IPFS node client initialized');
            return true;
        } catch (error) {
            console.warn('⚠️  IPFS node initialization failed, using local storage fallback:', error.message);
            return false;
        }
    }

    return false;
}

/**
 * Upload data to IPFS or local storage
 * @param {Object} data - Data to store
 * @returns {Promise<string>} CID or local file identifier
 */
async function uploadToIPFS(data) {
    const jsonData = JSON.stringify(data, null, 2);

    if (USE_IPFS) {
        // Try Pinata
        if (IPFS_PROVIDER === 'pinata') {
            const formData = new FormData();
            formData.append('file', Buffer.from(jsonData), { filename: 'certificate.json' });

            try {
                const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                    maxBodyLength: 'Infinity',
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
                        'Authorization': `Bearer ${process.env.PINATA_JWT}`
                    }
                });
                console.log('out Pinata Upload:', res.data.IpfsHash);
                return res.data.IpfsHash;
            } catch (error) {
                console.error('Pinata upload failed:', error.message);
                if (error.response) {
                    console.error('Pinata API Response:', error.response.data);
                    console.error('Pinata API Status:', error.response.status);
                }
            }
        }


        // Try Local Node
        if (IPFS_PROVIDER === 'ipfs-node' && ipfsClient) {
            try {
                const result = await ipfsClient.add(jsonData);
                console.log('out Uploaded to IPFS Node:', result.path);
                return result.path;
            } catch (error) {
                console.error('IPFS node upload failed:', error.message);
            }
        }
    }

    // Fallback to local storage
    return await saveToLocalStorage(data);
}

/**
 * Upload a file (PDF, image, etc.) to IPFS or local storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} filename - Original filename
 * @returns {Promise<string>} CID or local file identifier
 */
async function uploadFileToIPFS(fileBuffer, filename) {
    if (USE_IPFS) {
        // Try Pinata
        if (IPFS_PROVIDER === 'pinata') {
            const formData = new FormData();
            formData.append('file', fileBuffer, { filename });

            try {
                const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                    maxBodyLength: 'Infinity',
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
                        'Authorization': `Bearer ${process.env.PINATA_JWT}`
                    }
                });
                console.log('📤 File uploaded to Pinata:', res.data.IpfsHash);
                return res.data.IpfsHash;
            } catch (error) {
                console.error('Pinata file upload failed:', error.message);
                if (error.response) {
                    console.error('Pinata API Response:', error.response.data);
                    console.error('Pinata API Status:', error.response.status);
                }
            }
        }

        // Try Local Node
        if (IPFS_PROVIDER === 'ipfs-node' && ipfsClient) {
            try {
                const result = await ipfsClient.add(fileBuffer);
                console.log('📤 File uploaded to IPFS Node:', result.path);
                return result.path;
            } catch (error) {
                console.error('IPFS node file upload failed:', error.message);
            }
        }
    }

    // Fallback to local storage
    return await saveFileToLocalStorage(fileBuffer, filename);
}

/**
 * Retrieve data from IPFS or local storage
 * @param {string} cid - CID or local file identifier
 * @returns {Promise<Object>} Retrieved data
 */
async function retrieveFromIPFS(cid) {
    // If it looks like a local file ID
    if (cid.startsWith('local-')) {
        return await retrieveFromLocalStorage(cid);
    }

    if (USE_IPFS) {
        // Try Public Gateway for Pinata/General IPFS
        try {
            const gateway = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
            const res = await axios.get(`${gateway}${cid}`);
            console.log('📥 Retrieved from IPFS Gateway:', cid);
            return res.data;
        } catch (error) {
            console.warn('Gateway retrieval failed, trying local node if available:', error.message);
        }

        // Try Local Node
        if (ipfsClient) {
            try {
                const chunks = [];
                for await (const chunk of ipfsClient.cat(cid)) {
                    chunks.push(chunk);
                }
                const data = Buffer.concat(chunks).toString('utf8');
                return JSON.parse(data);
            } catch (error) {
                console.error('IPFS node retrieval failed:', error.message);
            }
        }
    }

    throw new Error(`Failed to retrieve data for CID: ${cid}`);
}

/**
 * Save data to local filesystem
 * @param {Object} data - Data to save
 * @returns {Promise<string>} Local file identifier
 */
async function saveToLocalStorage(data) {
    try {
        // Ensure storage directory exists
        await fs.mkdir(IPFS_STORAGE_PATH, { recursive: true });

        // Generate unique filename
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const filename = `local-${timestamp}-${random}.json`;
        const filepath = path.join(IPFS_STORAGE_PATH, filename);

        // Save file
        await fs.writeFile(filepath, JSON.stringify(data, null, 2));
        console.log('💾 Saved to local storage:', filename);

        return filename;
    } catch (error) {
        console.error('Local storage save failed:', error);
        throw new Error('Failed to save data to local storage');
    }
}

/**
 * Save file to local filesystem
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalFilename - Original filename
 * @returns {Promise<string>} Local file identifier
 */
async function saveFileToLocalStorage(fileBuffer, originalFilename) {
    try {
        // Ensure storage directory exists
        await fs.mkdir(IPFS_STORAGE_PATH, { recursive: true });

        // Generate unique filename while preserving extension
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const ext = path.extname(originalFilename);
        const filename = `local-file-${timestamp}-${random}${ext}`;
        const filepath = path.join(IPFS_STORAGE_PATH, filename);

        // Save file
        await fs.writeFile(filepath, fileBuffer);
        console.log('💾 File saved to local storage:', filename);

        return filename;
    } catch (error) {
        console.error('Local file storage save failed:', error);
        throw new Error('Failed to save file to local storage');
    }
}

/**
 * Retrieve data from local filesystem
 * @param {string} filename - Local file identifier
 * @returns {Promise<Object>} Retrieved data
 */
async function retrieveFromLocalStorage(filename) {
    try {
        const filepath = path.join(IPFS_STORAGE_PATH, filename);
        const data = await fs.readFile(filepath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Local storage retrieval failed:', error);
        throw new Error('Failed to retrieve data from local storage');
    }
}

/**
 * Check if IPFS is available
 * @returns {boolean} IPFS availability status
 */
function isIPFSAvailable() {
    if (!USE_IPFS) return false;
    if (IPFS_PROVIDER === 'pinata' && process.env.PINATA_JWT) return true;
    if (IPFS_PROVIDER === 'node' && ipfsClient) return true;
    return false;
}

module.exports = {
    initIPFS,
    uploadToIPFS,
    uploadFileToIPFS,
    retrieveFromIPFS,
    isIPFSAvailable
};
