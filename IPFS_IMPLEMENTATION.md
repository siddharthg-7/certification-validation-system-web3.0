# IPFS Implementation - Full Decentralization

## Overview
Your certificate system now stores **both** the metadata AND the actual certificate files on IPFS via Pinata, making it truly decentralized.

## What Gets Stored Where

### 1. Certificate File (PDF/Image)
- **Location**: IPFS (Pinata)
- **What**: The actual certificate document
- **CID**: Stored in the metadata JSON as `fileCID`
- **Access**: `https://gateway.pinata.cloud/ipfs/{fileCID}`

### 2. Metadata JSON
- **Location**: IPFS (Pinata)
- **What**: Encrypted certificate details + reference to file
- **Structure**:
  ```json
  {
    "encrypted": "...",
    "iv": "...",
    "algorithm": "aes-256-cbc",
    "fileCID": "Qm...",  // IPFS hash of the certificate file
    "filename": "certificate.pdf",
    "mimetype": "application/pdf"
  }
  ```
- **CID**: Stored on the blockchain

### 3. Blockchain (Sepolia)
- **Location**: Ethereum Sepolia Testnet
- **What**: Document hash + Metadata CID
- **Contract**: `0xCb3f328EEFeC798360E48DB815465ad599514e5b`

## How It Works

### Issuing a Certificate
1. User uploads certificate file (PDF/image)
2. Backend hashes the file for blockchain verification
3. Backend uploads **file** to Pinata → gets `fileCID`
4. Backend encrypts metadata and adds `fileCID` reference
5. Backend uploads **metadata JSON** to Pinata → gets `metadataCID`
6. Backend stores document hash + `metadataCID` on blockchain
7. Transaction is recorded in local database

### Verifying a Certificate
1. User uploads certificate file for verification
2. Backend hashes the file
3. Backend queries blockchain with hash → gets `metadataCID`
4. Backend fetches metadata from IPFS using `metadataCID`
5. Backend decrypts metadata to get certificate details + `fileCID`
6. Frontend can display:
   - Certificate details (from decrypted metadata)
   - Original certificate file (from `https://gateway.pinata.cloud/ipfs/{fileCID}`)

## Viewing Your Files on IPFS

### In Pinata Dashboard
1. Go to https://app.pinata.cloud/
2. Click "Files" in the sidebar
3. You'll see all uploaded files with their CIDs

### Via IPFS Gateway
Any file can be accessed via:
```
https://gateway.pinata.cloud/ipfs/{CID}
https://ipfs.io/ipfs/{CID}
https://cloudflare-ipfs.com/ipfs/{CID}
```

## Benefits

✅ **Permanent Storage**: Files remain accessible even if your server goes offline
✅ **Decentralized**: No single point of failure
✅ **Verifiable**: Anyone can verify certificates using the blockchain
✅ **Censorship-Resistant**: Files cannot be taken down by any single entity
✅ **Global Access**: Available from any IPFS gateway worldwide

## Fallback Behavior

If IPFS upload fails, the system automatically falls back to local storage:
- Files saved to: `backend/ipfs-storage/`
- Identifier format: `local-file-{timestamp}-{random}.{ext}`
- Still works, but not decentralized

## Configuration

In your `.env` file:
```env
USE_IPFS=true
IPFS_PROVIDER=pinata
PINATA_JWT=your_jwt_token
IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

## Next Steps

To view a certificate file from IPFS:
1. Issue a certificate
2. Check the backend logs for: `📤 Certificate file uploaded: Qm...`
3. Visit: `https://gateway.pinata.cloud/ipfs/Qm...`
4. Your certificate file will be displayed!
