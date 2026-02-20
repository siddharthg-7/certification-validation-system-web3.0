// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title CertificateRegistry
 * @dev Smart contract for decentralized certificate validation
 * @notice This contract allows authorized issuers to register certificates and anyone to verify them
 */
contract CertificateRegistry is AccessControl, Pausable {
    
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    // Certificate structure
    struct Certificate {
        bytes32 binaryHash;     // SHA-256 hash of the exact file (primary key)
        bytes32 contentHash;    // SHA-256 hash of extracted content
        bytes32 imageHash;      // Perceptual hash of image (optional)
        string ipfsCID;         // IPFS CID for encrypted metadata
        address issuer;         // Address of the issuing institution
        uint256 timestamp;      // Timestamp when certificate was issued
        bool exists;            // Flag to check if certificate exists
        bool isRevoked;         // Flag to check if certificate is revoked
    }
    
    // Mapping from binary hash (primary key) to certificate
    mapping(bytes32 => Certificate) public certificates;

    // Mapping from content hash to binary hash (for content-based lookup)
    mapping(bytes32 => bytes32) public contentHashToBinaryHash;

    // Mapping from image hash to binary hash (for image-based lookup - simplified exact match on pHash)
    mapping(bytes32 => bytes32) public imageHashToBinaryHash;

    
    // Events
    event CertificateIssued(
        bytes32 indexed binaryHash,
        bytes32 indexed contentHash,
        bytes32 imageHash,
        string ipfsCID,
        address indexed issuer,
        uint256 timestamp
    );
    
    event CertificateRevoked(bytes32 indexed binaryHash, address indexed revoker, uint256 timestamp);
    event CertificateUnrevoked(bytes32 indexed binaryHash, address indexed revoker, uint256 timestamp);
    event IssuerAdded(address indexed issuer, uint256 timestamp);
    event IssuerRemoved(address indexed issuer, uint256 timestamp);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
        emit IssuerAdded(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Add a new authorized issuer
     * @param _issuer Address of the institution to authorize
     */
    function addAuthorizedIssuer(address _issuer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_issuer != address(0), "Invalid issuer address");
        grantRole(ISSUER_ROLE, _issuer);
        emit IssuerAdded(_issuer, block.timestamp);
    }
    
    /**
     * @dev Remove an authorized issuer
     * @param _issuer Address of the institution to deauthorize
     */
    function removeAuthorizedIssuer(address _issuer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(ISSUER_ROLE, _issuer);
        emit IssuerRemoved(_issuer, block.timestamp);
    }

    /**
     * @dev Pause the contract
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Issue a new certificate
     * @param _binaryHash SHA-256 hash of the exact file
     * @param _contentHash SHA-256 hash of extracted content
     * @param _imageHash Perceptual hash of the image (0x0 if not applicable)
     * @param _ipfsCID IPFS CID containing encrypted metadata
     */
    function issueCertificate(
        bytes32 _binaryHash,
        bytes32 _contentHash,
        bytes32 _imageHash,
        string memory _ipfsCID
    ) 
        public 
        onlyRole(ISSUER_ROLE)
        whenNotPaused
    {
        require(_binaryHash != bytes32(0), "Invalid binary hash");
        require(bytes(_ipfsCID).length > 0, "Invalid IPFS CID");
        require(!certificates[_binaryHash].exists, "Certificate already exists");
        
        certificates[_binaryHash] = Certificate({
            binaryHash: _binaryHash,
            contentHash: _contentHash,
            imageHash: _imageHash,
            ipfsCID: _ipfsCID,
            issuer: msg.sender,
            timestamp: block.timestamp,
            exists: true,
            isRevoked: false
        });

        // Update lookup mappings
        if (_contentHash != bytes32(0)) {
            contentHashToBinaryHash[_contentHash] = _binaryHash;
        }
        if (_imageHash != bytes32(0)) {
            imageHashToBinaryHash[_imageHash] = _binaryHash;
        }
        
        emit CertificateIssued(_binaryHash, _contentHash, _imageHash, _ipfsCID, msg.sender, block.timestamp);
    }

    /**
     * @dev Batch issue multiple certificates
     * @param _binaryHashes Array of binary hashes
     * @param _contentHashes Array of content hashes
     * @param _imageHashes Array of image hashes
     * @param _ipfsCIDs Array of IPFS CIDs
     */
    function batchIssueCertificates(
        bytes32[] calldata _binaryHashes, 
        bytes32[] calldata _contentHashes,
        bytes32[] calldata _imageHashes,
        string[] calldata _ipfsCIDs
    ) 
        external 
        onlyRole(ISSUER_ROLE)
        whenNotPaused
    {
        require(_binaryHashes.length == _ipfsCIDs.length, "Arrays length mismatch");
        require(_binaryHashes.length > 0, "Empty arrays");

        for (uint256 i = 0; i < _binaryHashes.length; i++) {
            issueCertificate(_binaryHashes[i], _contentHashes[i], _imageHashes[i], _ipfsCIDs[i]);
        }
    }

    /**
     * @dev Revoke a certificate
     * @param _binaryHash SHA-256 hash of the certificate document
     */
    function revokeCertificate(bytes32 _binaryHash) external onlyRole(ISSUER_ROLE) whenNotPaused {
        require(certificates[_binaryHash].exists, "Certificate does not exist");
        require(!certificates[_binaryHash].isRevoked, "Certificate already revoked");
        
        // Only original issuer or admin can revoke
        require(
            certificates[_binaryHash].issuer == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Not authorized to revoke this certificate"
        );
        
        certificates[_binaryHash].isRevoked = true;
        emit CertificateRevoked(_binaryHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Unrevoke a certificate
     * @param _binaryHash SHA-256 hash of the certificate document
     */
    function unrevokeCertificate(bytes32 _binaryHash) external onlyRole(ISSUER_ROLE) whenNotPaused {
        require(certificates[_binaryHash].exists, "Certificate does not exist");
        require(certificates[_binaryHash].isRevoked, "Certificate not revoked");
        
        // Only original issuer or admin can unrevoke
        require(
            certificates[_binaryHash].issuer == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Not authorized to unrevoke this certificate"
        );
        
        certificates[_binaryHash].isRevoked = false;
        emit CertificateUnrevoked(_binaryHash, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Verify if a certificate exists and retrieve its details
     * @param _binaryHash SHA-256 hash of the certificate document
     */
    function verifyCertificate(bytes32 _binaryHash) 
        external 
        view 
        returns (
            bool exists,
            bytes32 contentHash,
            bytes32 imageHash,
            string memory ipfsCID,
            address issuer,
            uint256 timestamp,
            bool isRevoked
        ) 
    {
        Certificate memory cert = certificates[_binaryHash];
        return (
            cert.exists,
            cert.contentHash,
            cert.imageHash,
            cert.ipfsCID,
            cert.issuer,
            cert.timestamp,
            cert.isRevoked
        );
    }

    /**
     * @dev Verify by content hash
     * @param _contentHash Content hash to lookup
     */
    function verifyCertificateByContent(bytes32 _contentHash) 
        external 
        view 
        returns (
            bool exists,
            bytes32 binaryHash,
            bytes32 imageHash,
            string memory ipfsCID,
            address issuer,
            uint256 timestamp,
            bool isRevoked
        ) 
    {
        bytes32 binHash = contentHashToBinaryHash[_contentHash];
        if (binHash == bytes32(0)) {
            return (false, bytes32(0), bytes32(0), "", address(0), 0, false);
        }
        
        Certificate memory cert = certificates[binHash];
        return (
            cert.exists,
            cert.binaryHash,
            cert.imageHash,
            cert.ipfsCID,
            cert.issuer,
            cert.timestamp,
            cert.isRevoked
        );
    }

    /**
     * @dev Verify by image hash (exact pHash match)
     * @param _imageHash Image hash to lookup
     */
    function verifyCertificateByImage(bytes32 _imageHash) 
        external 
        view 
        returns (
            bool exists,
            bytes32 binaryHash,
            bytes32 contentHash,
            string memory ipfsCID,
            address issuer,
            uint256 timestamp,
            bool isRevoked
        ) 
    {
        bytes32 binHash = imageHashToBinaryHash[_imageHash];
        if (binHash == bytes32(0)) {
            return (false, bytes32(0), bytes32(0), "", address(0), 0, false);
        }
        
        Certificate memory cert = certificates[binHash];
        return (
            cert.exists,
            cert.binaryHash,
            cert.contentHash,
            cert.ipfsCID,
            cert.issuer,
            cert.timestamp,
            cert.isRevoked
        );
    }
    
    /**
     * @dev Check if an address is an authorized issuer
     * @param _issuer Address to check
     * @return bool True if authorized, false otherwise
     */
    function isAuthorizedIssuer(address _issuer) external view returns (bool) {
        return hasRole(ISSUER_ROLE, _issuer);
    }
    
    /**
     * @dev Get certificate details by document hash
     * @param _binaryHash SHA-256 hash of the certificate document
     * @return Certificate struct
     */
    function getCertificate(bytes32 _binaryHash) 
        external 
        view 
        returns (Certificate memory) 
    {
        return certificates[_binaryHash];
    }
}
