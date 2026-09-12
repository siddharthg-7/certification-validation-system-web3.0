const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateRegistry", function () {
    let certificateRegistry;
    let owner;
    let issuer1;
    let issuer2;
    let unauthorized;

    const sampleBinaryHash = ethers.keccak256(ethers.toUtf8Bytes("Sample Binary Hash"));
    const sampleContentHash = ethers.keccak256(ethers.toUtf8Bytes("Sample Content Hash"));
    const sampleImageHash = ethers.ZeroHash;
    const sampleIPFSCID = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";

    beforeEach(async function () {
        [owner, issuer1, issuer2, unauthorized] = await ethers.getSigners();

        const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
        certificateRegistry = await CertificateRegistry.deploy();
        await certificateRegistry.waitForDeployment();
    });

    describe("Deployment & Role Initialization", function () {
        it("Should grant default admin role to deployer", async function () {
            const adminRole = await certificateRegistry.DEFAULT_ADMIN_ROLE();
            expect(await certificateRegistry.hasRole(adminRole, owner.address)).to.be.true;
        });

        it("Should authorize deployer as issuer", async function () {
            expect(await certificateRegistry.isAuthorizedIssuer(owner.address)).to.be.true;
        });
    });

    describe("Issuer Role Management", function () {
        it("Should allow admin to add authorized issuer", async function () {
            await expect(certificateRegistry.addAuthorizedIssuer(issuer1.address))
                .to.emit(certificateRegistry, "IssuerAdded");

            expect(await certificateRegistry.isAuthorizedIssuer(issuer1.address)).to.be.true;
        });

        it("Should prevent non-admin from adding issuer", async function () {
            await expect(
                certificateRegistry.connect(unauthorized).addAuthorizedIssuer(issuer1.address)
            ).to.be.reverted;
        });

        it("Should prevent adding zero address as issuer", async function () {
            await expect(
                certificateRegistry.addAuthorizedIssuer(ethers.ZeroAddress)
            ).to.be.revertedWith("Invalid issuer address");
        });

        it("Should allow admin to remove authorized issuer", async function () {
            await certificateRegistry.addAuthorizedIssuer(issuer1.address);
            expect(await certificateRegistry.isAuthorizedIssuer(issuer1.address)).to.be.true;

            await expect(certificateRegistry.removeAuthorizedIssuer(issuer1.address))
                .to.emit(certificateRegistry, "IssuerRemoved");

            expect(await certificateRegistry.isAuthorizedIssuer(issuer1.address)).to.be.false;
        });
    });

    describe("Certificate Issuance", function () {
        beforeEach(async function () {
            await certificateRegistry.addAuthorizedIssuer(issuer1.address);
        });

        it("Should allow authorized issuer to issue certificate with multi-layer hashes", async function () {
            await expect(
                certificateRegistry.connect(issuer1).issueCertificate(
                    sampleBinaryHash,
                    sampleContentHash,
                    sampleImageHash,
                    sampleIPFSCID
                )
            ).to.emit(certificateRegistry, "CertificateIssued");

            const cert = await certificateRegistry.getCertificate(sampleBinaryHash);
            expect(cert.exists).to.be.true;
            expect(cert.binaryHash).to.equal(sampleBinaryHash);
            expect(cert.contentHash).to.equal(sampleContentHash);
            expect(cert.ipfsCID).to.equal(sampleIPFSCID);
            expect(cert.issuer).to.equal(issuer1.address);
            expect(cert.isRevoked).to.be.false;
        });

        it("Should prevent unauthorized address from issuing certificate", async function () {
            await expect(
                certificateRegistry.connect(unauthorized).issueCertificate(
                    sampleBinaryHash,
                    sampleContentHash,
                    sampleImageHash,
                    sampleIPFSCID
                )
            ).to.be.reverted;
        });

        it("Should prevent issuing certificate with zero binary hash", async function () {
            await expect(
                certificateRegistry.connect(issuer1).issueCertificate(
                    ethers.ZeroHash,
                    sampleContentHash,
                    sampleImageHash,
                    sampleIPFSCID
                )
            ).to.be.revertedWith("Invalid binary hash");
        });

        it("Should prevent issuing certificate with empty IPFS CID", async function () {
            await expect(
                certificateRegistry.connect(issuer1).issueCertificate(
                    sampleBinaryHash,
                    sampleContentHash,
                    sampleImageHash,
                    ""
                )
            ).to.be.revertedWith("Invalid IPFS CID");
        });

        it("Should prevent issuing duplicate certificate", async function () {
            await certificateRegistry.connect(issuer1).issueCertificate(
                sampleBinaryHash,
                sampleContentHash,
                sampleImageHash,
                sampleIPFSCID
            );

            await expect(
                certificateRegistry.connect(issuer1).issueCertificate(
                    sampleBinaryHash,
                    sampleContentHash,
                    sampleImageHash,
                    sampleIPFSCID
                )
            ).to.be.revertedWith("Certificate already exists");
        });
    });

    describe("Certificate Verification & Revocation Lifecycle", function () {
        beforeEach(async function () {
            await certificateRegistry.addAuthorizedIssuer(issuer1.address);
            await certificateRegistry.connect(issuer1).issueCertificate(
                sampleBinaryHash,
                sampleContentHash,
                sampleImageHash,
                sampleIPFSCID
            );
        });

        it("Should verify existing certificate by binary hash", async function () {
            const result = await certificateRegistry.verifyCertificate(sampleBinaryHash);
            expect(result.exists).to.be.true;
            expect(result.isRevoked).to.be.false;
            expect(result.ipfsCID).to.equal(sampleIPFSCID);
            expect(result.issuer).to.equal(issuer1.address);
            expect(result.timestamp).to.be.gt(0);
        });

        it("Should return false for non-existent certificate", async function () {
            const fakeHash = ethers.keccak256(ethers.toUtf8Bytes("Nonexistent"));
            const result = await certificateRegistry.verifyCertificate(fakeHash);
            expect(result.exists).to.be.false;
        });

        it("Should allow authorized issuer to revoke and unrevoke certificate", async function () {
            // Revoke
            await expect(
                certificateRegistry.connect(issuer1).revokeCertificate(sampleBinaryHash)
            ).to.emit(certificateRegistry, "CertificateRevoked");

            let cert = await certificateRegistry.getCertificate(sampleBinaryHash);
            expect(cert.isRevoked).to.be.true;

            // Unrevoke
            await expect(
                certificateRegistry.connect(issuer1).unrevokeCertificate(sampleBinaryHash)
            ).to.emit(certificateRegistry, "CertificateUnrevoked");

            cert = await certificateRegistry.getCertificate(sampleBinaryHash);
            expect(cert.isRevoked).to.be.false;
        });

        it("Should prevent unauthorized address from revoking certificate", async function () {
            await expect(
                certificateRegistry.connect(unauthorized).revokeCertificate(sampleBinaryHash)
            ).to.be.reverted;
        });
    });
});
