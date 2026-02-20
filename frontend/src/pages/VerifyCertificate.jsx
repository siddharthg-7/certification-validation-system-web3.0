import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WalletConnect from '../components/WalletConnect';
import FileUpload from '../components/FileUpload';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const VerifyCertificate = () => {
    const [file, setFile] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState(null);

    const handleVerify = async () => {
        if (!file) {
            alert('Please upload a certificate file');
            return;
        }

        setIsVerifying(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('certificate', file);

            const response = await axios.post(`${API_URL}/api/verify`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setResult(response.data);
        } catch (error) {
            console.error('Verification error:', error);
            setResult({
                valid: false,
                message: error.response?.data?.message || 'Verification failed',
                details: error.response?.data?.details || {},
                error: error.message
            });
        } finally {
            setIsVerifying(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(parseInt(timestamp) * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderVerificationLayers = (details) => {
        if (!details) return null;

        return (
            <div className="bg-dark-900 rounded-lg p-4 mb-4 border border-dark-800">
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Multi-Layer Analysis</h4>
                <div className="space-y-3">
                    {/* Layer 1: Binary */}
                    <div className="flex justify-between items-center p-2 rounded bg-dark-950/50">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-300 font-medium">1. Binary Integrity</span>
                            <span className="text-xs text-gray-500">(Exact File Match)</span>
                        </div>
                        <div>
                            {details.binaryMatch ? (
                                <span className="text-green-500 font-bold flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    MATCH
                                </span>
                            ) : (
                                <span className="text-red-500 font-bold flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    MISMATCH
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Layer 2: Content */}
                    <div className="flex justify-between items-center p-2 rounded bg-dark-950/50">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-300 font-medium">2. Content Analysis</span>
                            <span className="text-xs text-gray-500">(OCR / Text Extraction)</span>
                        </div>
                        <div>
                            {details.contentMatch ? (
                                <span className="text-green-500 font-bold flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    VERIFIED
                                </span>
                            ) : (
                                <span className="text-red-500 font-bold flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    FAILED
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Layer 3: Image Similarity */}
                    <div className="flex justify-between items-center p-2 rounded bg-dark-950/50">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-300 font-medium">3. Image Similarity</span>
                            <span className="text-xs text-gray-500">(Perceptual Hash)</span>
                        </div>
                        <div>
                            <span className={`font-bold ${details.imageSimilarity >= 90 ? 'text-green-500' : details.imageSimilarity > 70 ? 'text-yellow-500' : 'text-gray-500'}`}>
                                {details.imageSimilarity ? `${details.imageSimilarity}% Match` : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCertificateDetails = (cert) => (
        <div className="space-y-4">
            <div className="bg-dark-900 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Certificate Details</h4>
                <div className="space-y-3">
                    {cert.metadata && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-gray-500">Student Name</span>
                                    <p className="text-gray-200 font-medium">{cert.metadata.studentName}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Course</span>
                                    <p className="text-gray-200 font-medium">{cert.metadata.courseName}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Institution</span>
                                    <p className="text-gray-200 font-medium">{cert.metadata.institution}</p>
                                </div>
                                {cert.metadata.grade && (
                                    <div>
                                        <span className="text-xs text-gray-500">Grade</span>
                                        <p className="text-gray-200 font-medium">{cert.metadata.grade}</p>
                                    </div>
                                )}
                            </div>
                            {cert.metadata.additionalInfo && (
                                <div>
                                    <span className="text-xs text-gray-500">Additional Information</span>
                                    <p className="text-gray-200">{cert.metadata.additionalInfo}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="bg-dark-900 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-3">Blockchain Information</h4>
                <div className="space-y-2 text-sm">
                    <div>
                        <span className="text-gray-500">Issuer Address:</span>
                        <p className="font-mono text-primary-400 break-all">{cert.issuer}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Issue Date:</span>
                        <p className="text-gray-200">{formatDate(cert.timestamp)}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">Status:</span>
                        <p className={`font-semibold ${cert.isRevoked ? 'text-orange-500' : 'text-green-500'}`}>
                            {cert.isRevoked ? 'REVOKED' : 'ACTIVE'}
                        </p>
                    </div>
                    <div>
                        <span className="text-gray-500">Document Hash (Binary):</span>
                        <p className="font-mono text-primary-400 break-all">{cert.docHash}</p>
                    </div>
                    <div>
                        <span className="text-gray-500">IPFS CID:</span>
                        <p className="font-mono text-primary-400 break-all">{cert.ipfsCID}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-950">
            {/* Header */}
            <header className="border-b border-dark-800">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold gradient-text">CertiChain</h1>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/issue" className="text-gray-400 hover:text-primary-500 transition-colors">
                            Issue Certificate
                        </Link>
                        <WalletConnect />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold mb-2">Verify Certificate</h2>
                        <p className="text-gray-400">
                            Perform a multi-layer verification check on your certificate document.
                        </p>
                    </div>

                    {/* Upload Section */}
                    <div className="card mb-8">
                        <FileUpload
                            onFileSelect={setFile}
                            label="Certificate to Verify"
                            accept="*"
                        />

                        <button
                            onClick={handleVerify}
                            disabled={!file || isVerifying}
                            className="btn-primary w-full mt-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isVerifying ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block mr-2"></div>
                                    Analysing Layers...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Verify Certificate
                                </>
                            )}
                        </button>
                    </div>

                    {/* Result Section */}
                    {result && (
                        <div className={`card ${result.valid && !result.certificate?.isRevoked ? 'bg-green-500/10 border-green-500/30 glow-green' : result.certificate?.isRevoked ? 'bg-orange-500/10 border-orange-500/30 glow' : 'bg-red-500/10 border-red-500/30 glow-red'}`}>

                            {/* Verdict Header */}
                            <div className="flex items-center gap-3 mb-6 p-4 rounded-lg bg-dark-950/30">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${result.valid && !result.certificate?.isRevoked ? 'bg-green-500/20 text-green-500' : result.certificate?.isRevoked ? 'bg-orange-500/20 text-orange-500' : 'bg-red-500/20 text-red-500'}`}>
                                    {result.valid && !result.certificate?.isRevoked ? (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    )}
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold ${result.valid && !result.certificate?.isRevoked ? 'text-green-500' : result.certificate?.isRevoked ? 'text-orange-500' : 'text-red-500'}`}>
                                        {result.valid ? (result.certificate?.isRevoked ? 'REVOKED' : 'VALID CERTIFICATE') : 'INVALID CERTIFICATE'}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {result.message}
                                    </p>
                                </div>
                            </div>

                            {/* Multi-Layer Analysis Display */}
                            {renderVerificationLayers(result.details)}

                            {/* Certificate Details if Valid */}
                            {result.valid && result.certificate && renderCertificateDetails(result.certificate)}

                            {/* Error Details if Invalid */}
                            {!result.valid && (
                                <div className="bg-dark-900 rounded-lg p-4 mt-4">
                                    <h4 className="text-sm font-semibold text-red-400 mb-2">Failure Analysis:</h4>
                                    <p className="text-sm text-gray-400 mb-2">The certificate could not be verified by any layer:</p>
                                    <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
                                        <li>Binary hash did not match any record.</li>
                                        <li>Extracted content did not match any record.</li>
                                        <li>No similar images found above confidence threshold.</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Info Box */}
                    {!result && (
                        <div className="card bg-primary-500/10 border-primary-500/30">
                            <div className="flex gap-3">
                                <svg className="w-6 h-6 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-gray-300">
                                    <p className="font-semibold mb-1">Multi-Layer Intelligence</p>
                                    <p className="text-gray-400">
                                        Our new verification engine uses a hybrid approach:
                                        <br />1. <strong>Binary:</strong> Checks strict file integrity.
                                        <br />2. <strong>Content:</strong> Extracts and matches text content.
                                        <br />3. <strong>Result:</strong> Intelligent match confirmation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyCertificate;
