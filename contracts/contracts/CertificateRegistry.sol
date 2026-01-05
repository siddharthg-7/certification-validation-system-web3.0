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
        bytes32 docHash;        // SHA-256 hash of the certificate document
        string ipfsCID;         // IPFS CID for encrypted metadata
        address issuer;         // Address of the issuing institution
        uint256 timestamp;      // Timestamp when certificate was issued
        bool exists;            // Flag to check if certificate exists
        bool isRevoked;         // Flag to check if certificate is revoked
    }
    
    // Mapping from document hash to certificate
    mapping(bytes32 => Certificate) public certificates;
    
    // Events
    event CertificateIssued(
        bytes32 indexed docHash,
        string ipfsCID,
        address indexed issuer,
        uint256 timestamp
    );
    
    event CertificateRevoked(bytes32 indexed docHash, address indexed revoker, uint256 timestamp);
    event CertificateUnrevoked(bytes32 indexed docHash, address indexed revoker, uint256 timestamp);
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
     * @param _docHash SHA-256 hash of the certificate document
     * @param _ipfsCID IPFS CID containing encrypted metadata
     */
    function issueCertificate(bytes32 _docHash, string memory _ipfsCID) 
        public 
        onlyRole(ISSUER_ROLE)
        whenNotPaused
    {
        require(_docHash != bytes32(0), "Invalid document hash");
        require(bytes(_ipfsCID).length > 0, "Invalid IPFS CID");
        require(!certificates[_docHash].exists, "Certificate already exists");
        
        certificates[_docHash] = Certificate({
            docHash: _docHash,
            ipfsCID: _ipfsCID,
            issuer: msg.sender,
            timestamp: block.timestamp,
            exists: true,
            isRevoked: false
        });
        
        emit CertificateIssued(_docHash, _ipfsCID, msg.sender, block.timestamp);
    }

    /**
     * @dev Batch issue multiple certificates
     * @param _docHashes Array of document hashes
     * @param _ipfsCIDs Array of IPFS CIDs
     */
    function batchIssueCertificates(bytes32[] calldata _docHashes, string[] calldata _ipfsCIDs) 
        external 
        onlyRole(ISSUER_ROLE)
        whenNotPaused
    {
        require(_docHashes.length == _ipfsCIDs.length, "Arrays length mismatch");
        require(_docHashes.length > 0, "Empty arrays");

        for (uint256 i = 0; i < _docHashes.length; i++) {
            issueCertificate(_docHashes[i], _ipfsCIDs[i]);
        }
    }

    /**
     * @dev Revoke a certificate
     * @param _docHash SHA-256 hash of the certificate document
     */
    function revokeCertificate(bytes32 _docHash) external onlyRole(ISSUER_ROLE) whenNotPaused {
        require(certificates[_docHash].exists, "Certificate does not exist");
        require(!certificates[_docHash].isRevoked, "Certificate already revoked");
        
        // Only original issuer or admin can revoke
        require(
            certificates[_docHash].issuer == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Not authorized to revoke this certificate"
        );
        
        certificates[_docHash].isRevoked = true;
        emit CertificateRevoked(_docHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Unrevoke a certificate
     * @param _docHash SHA-256 hash of the certificate document
     */
    function unrevokeCertificate(bytes32 _docHash) external onlyRole(ISSUER_ROLE) whenNotPaused {
        require(certificates[_docHash].exists, "Certificate does not exist");
        require(certificates[_docHash].isRevoked, "Certificate not revoked");
        
        // Only original issuer or admin can unrevoke
        require(
            certificates[_docHash].issuer == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Not authorized to unrevoke this certificate"
        );
        
        certificates[_docHash].isRevoked = false;
        emit CertificateUnrevoked(_docHash, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Verify if a certificate exists and retrieve its details
     * @param _docHash SHA-256 hash of the certificate document
     * @return exists Whether the certificate exists
     * @return ipfsCID IPFS CID of the certificate metadata
     * @return issuer Address of the issuing institution
     * @return timestamp When the certificate was issued
     * @return isRevoked Whether the certificate is revoked
     */
    function verifyCertificate(bytes32 _docHash) 
        external 
        view 
        returns (
            bool exists,
            string memory ipfsCID,
            address issuer,
            uint256 timestamp,
            bool isRevoked
        ) 
    {
        Certificate memory cert = certificates[_docHash];
        return (
            cert.exists,
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
     * @param _docHash SHA-256 hash of the certificate document
     * @return Certificate struct
     */
    function getCertificate(bytes32 _docHash) 
        external 
        view 
        returns (Certificate memory) 
    {
        return certificates[_docHash];
    }
}
