import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import FloatingLabelInput from '../components/FloatingLabelInput';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const VerifyCertificate = () => {
    const [activeTab, setActiveTab] = useState('file'); // 'file' | 'hash'
    const [file, setFile] = useState(null);
    const [manualHash, setManualHash] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState(null);

    const handleVerify = async (mode = activeTab) => {
        if (mode === 'file' && !file) {
            alert('Please attach a certificate file to verify.');
            return;
        }
        if (mode === 'hash' && !manualHash.trim()) {
            alert('Please enter a valid certificate SHA-256 hash.');
            return;
        }

        setIsVerifying(true);
        setResult(null);

        try {
            let response;
            if (mode === 'hash') {
                response = await axios.post(`${API_URL}/api/verify-hash`, {
                    docHash: manualHash.trim()
                });
            } else {
                const formData = new FormData();
                formData.append('certificate', file);
                response = await axios.post(`${API_URL}/api/verify`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setResult(response.data);
        } catch (error) {
            console.error('Verification error:', error);
            setResult({
                valid: false,
                message: error.response?.data?.message || error.response?.data?.error || 'Verification query failed',
                details: error.response?.data?.details || {},
                error: error.message
            });
        } finally {
            setIsVerifying(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(parseInt(timestamp) * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const cert = result?.certificate;
    const details = result?.details;
    const isRevoked = cert?.isRevoked || result?.message?.toLowerCase().includes('revoked');
    const isValid = result?.valid && !isRevoked;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            {/* Page Header */}
            <div className="bg-white border-b border-slate-200 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <Link to="/" className="hover:text-slate-800">Home</Link>
                        <span>/</span>
                        <Link to="/dashboard" className="hover:text-slate-800">Registry</Link>
                        <span>/</span>
                        <span className="text-slate-800 font-medium">Verify Credential</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        Public Credential Verification Portal
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                        Verify the cryptographic authenticity and tamper-resistance of certificates anchored on the Ethereum ledger.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">

                    {/* Verification Input Hub Card */}
                    <div className="card">
                        <div className="card-header">
                            <div>
                                <h2 className="card-title">1. Verification Method</h2>
                                <p className="card-subtitle">
                                    Verify by uploading the authentic document or directly searching by cryptographic SHA-256 hash.
                                </p>
                            </div>

                            {/* Mode Tabs */}
                            <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs font-semibold">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('file')}
                                    className={`px-3 py-1.5 rounded ${activeTab === 'file'
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    Document Upload
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('hash')}
                                    className={`px-3 py-1.5 rounded ${activeTab === 'hash'
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    Hash Lookup
                                </button>
                            </div>
                        </div>

                        {activeTab === 'file' ? (
                            <div className="space-y-5">
                                <FileUpload
                                    onFileSelect={setFile}
                                    label="Upload Certificate for Multi-Layer Verification"
                                    accept="*"
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleVerify('file')}
                                        disabled={!file || isVerifying}
                                        className="btn-primary py-2.5 px-6 text-sm"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                                <span>Analyzing Integrity...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Verify Document Authenticity</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <FloatingLabelInput
                                    label="Certificate SHA-256 Digest (0x... or 64-character hex)"
                                    id="manualHash"
                                    value={manualHash}
                                    onChange={(e) => setManualHash(e.target.value)}
                                    placeholder="e.g. 0x8f2a93c71e0b5d4e..."
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleVerify('hash')}
                                        disabled={!manualHash.trim() || isVerifying}
                                        className="btn-primary py-2.5 px-6 text-sm"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                                <span>Querying Blockchain...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                <span>Query Ledger by Hash</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Verification Result Report */}
                    {result && (
                        <div className="space-y-6">

                            {/* Status Banner */}
                            {isValid ? (
                                <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-5 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-lg font-bold">
                                        ✓
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="badge-valid text-[11px]">VERIFIED AUTHENTIC</span>
                                            <span className="text-xs font-mono text-emerald-800 font-medium">
                                                Consensus Validated
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-emerald-950 mt-1">
                                            Authentic &amp; Valid Credential
                                        </h3>
                                        <p className="text-xs text-emerald-900 mt-0.5 leading-relaxed">
                                            {result.message || 'This credential has been mathematically validated against the Ethereum blockchain registry.'}
                                        </p>
                                    </div>
                                </div>
                            ) : isRevoked ? (
                                <div className="bg-amber-50 border border-amber-300 rounded-lg p-5 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 text-lg font-bold">
                                        !
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="badge-revoked text-[11px]">STATUS: REVOKED</span>
                                            <span className="text-xs font-mono text-amber-800 font-medium">
                                                On-Chain Invalidation
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-amber-950 mt-1">
                                            Certificate Has Been Revoked
                                        </h3>
                                        <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                                            This certificate was originally anchored on the ledger but has been formally marked as revoked by the authorized issuing institution.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-50 border border-red-300 rounded-lg p-5 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0 text-lg font-bold">
                                        ✕
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="badge-invalid text-[11px]">VERIFICATION FAILED</span>
                                            <span className="text-xs font-mono text-red-800 font-medium">
                                                No Ledger Record
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-red-950 mt-1">
                                            Certificate Not Found or Tampered
                                        </h3>
                                        <p className="text-xs text-red-900 mt-0.5 leading-relaxed">
                                            {result.message || 'The cryptographic digest of this document does not match any authorized record on the blockchain registry.'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Section 1: Multi-Layer Cryptographic Integrity Audit */}
                            {details && (
                                <div className="card">
                                    <div className="card-header">
                                        <div>
                                            <h3 className="card-title">Cryptographic Integrity Audit</h3>
                                            <p className="card-subtitle">
                                                Multi-stage verification protocol results across raw binary, OCR, and visual layers.
                                            </p>
                                        </div>
                                        <span className="badge-neutral text-[11px]">Audit Telemetry</span>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="table-formal">
                                            <thead>
                                                <tr>
                                                    <th>Verification Stage</th>
                                                    <th>Description</th>
                                                    <th className="text-right">Verdict</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="font-semibold text-slate-900">
                                                        Layer 1: SHA-256 Binary Integrity
                                                    </td>
                                                    <td className="text-xs text-slate-600">
                                                        Exact bitwise file hash comparison against on-chain anchor
                                                    </td>
                                                    <td className="text-right">
                                                        {details.binaryMatch ? (
                                                            <span className="badge-valid text-[11px]">EXACT MATCH</span>
                                                        ) : (
                                                            <span className="badge-invalid text-[11px]">MISMATCH</span>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="font-semibold text-slate-900">
                                                        Layer 2: OCR Content Analysis
                                                    </td>
                                                    <td className="text-xs text-slate-600">
                                                        Optical character extraction &amp; semantic pattern matching
                                                    </td>
                                                    <td className="text-right">
                                                        {details.contentMatch ? (
                                                            <span className="badge-valid text-[11px]">VERIFIED</span>
                                                        ) : (
                                                            <span className="badge-invalid text-[11px]">NOT VERIFIED</span>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="font-semibold text-slate-900">
                                                        Layer 3: Visual Perceptual Similarity
                                                    </td>
                                                    <td className="text-xs text-slate-600">
                                                        Perceptual hash (pHash) visual distance analysis
                                                    </td>
                                                    <td className="text-right">
                                                        {details.imageSimilarity !== null && details.imageSimilarity !== undefined ? (
                                                            <span className={details.imageSimilarity >= 90 ? "badge-valid text-[11px]" : "badge-invalid text-[11px]"}>
                                                                {details.imageSimilarity}% SIMILARITY
                                                            </span>
                                                        ) : (
                                                            <span className="badge-neutral text-[11px]">N/A</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Section 2: Credential & Recipient Record (if metadata returned) */}
                            {cert?.metadata && (
                                <div className="card">
                                    <div className="card-header">
                                        <div>
                                            <h3 className="card-title">Credential Metadata Record</h3>
                                            <p className="card-subtitle">
                                                Decrypted official candidate and accreditation information.
                                            </p>
                                        </div>
                                        <span className="badge-neutral text-[11px]">IPFS Decrypted</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                                            <span className="label-formal">Candidate Name</span>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {cert.metadata.studentName || 'Not specified'}
                                            </p>
                                        </div>

                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                                            <span className="label-formal">Course / Program</span>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {cert.metadata.courseName || 'Not specified'}
                                            </p>
                                        </div>

                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                                            <span className="label-formal">Issuing Institution</span>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {cert.metadata.institution || 'Not specified'}
                                            </p>
                                        </div>

                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                                            <span className="label-formal">Official Date of Issue</span>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {cert.metadata.issueDate || 'Not specified'}
                                            </p>
                                        </div>

                                        {cert.metadata.grade && (
                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                                                <span className="label-formal">Grade / Classification</span>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {cert.metadata.grade}
                                                </p>
                                            </div>
                                        )}

                                        {cert.metadata.additionalInfo && (
                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded sm:col-span-2">
                                                <span className="label-formal">Official Remarks</span>
                                                <p className="text-xs text-slate-700 leading-relaxed">
                                                    {cert.metadata.additionalInfo}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Section 3: Blockchain Provenance & Audit Trail */}
                            {cert && (
                                <div className="card">
                                    <div className="card-header">
                                        <div>
                                            <h3 className="card-title">Blockchain Provenance &amp; Ledger Audit</h3>
                                            <p className="card-subtitle">
                                                Immutable on-chain parameters and cryptographic storage references.
                                            </p>
                                        </div>
                                        <span className="badge-neutral text-[11px]">EVM Smart Contract</span>
                                    </div>

                                    <div className="space-y-3 font-mono text-xs">
                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                                            <span className="block text-[11px] font-sans font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                                Document SHA-256 Hash
                                            </span>
                                            <span className="text-slate-900 break-all select-all font-semibold">
                                                {cert.docHash}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                                                <span className="block text-[11px] font-sans font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                                    Authorized Issuer Address
                                                </span>
                                                <span className="text-slate-800 break-all select-all">
                                                    {cert.issuer}
                                                </span>
                                            </div>

                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                                                <span className="block text-[11px] font-sans font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                                    Block Registration Timestamp
                                                </span>
                                                <span className="text-slate-800 font-sans">
                                                    {formatDate(cert.timestamp)}
                                                </span>
                                            </div>
                                        </div>

                                        {cert.ipfsCID && (
                                            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                                                <span className="block text-[11px] font-sans font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                                    IPFS Encrypted Payload CID
                                                </span>
                                                <span className="text-slate-800 break-all select-all">
                                                    {cert.ipfsCID}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default VerifyCertificate;
