import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import FloatingLabelInput from '../components/FloatingLabelInput';
import {
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Copy,
    Check,
    Printer,
    FileText,
    Hash,
    CheckCircle,
    XCircle,
    ExternalLink
} from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const VerifyCertificate = () => {
    const [activeTab, setActiveTab] = useState('file'); // 'file' | 'hash'
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [manualHash, setManualHash] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState(null);
    const [copiedKey, setCopiedKey] = useState(null);

    useEffect(() => {
        if (!file) { setPreviewUrl(null); return; }
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const isPdf = file && (file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf'));
    const isImage = file && (file.type?.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name || ''));

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

    const copyText = (text, key) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handlePrint = () => {
        window.print();
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
        <div className="min-h-screen bg-[#F5F3EB] text-[#102322] flex flex-col font-sans selection:bg-[#B65F3D] selection:text-white">
            <Navbar />

            {/* Page Header */}
            <div className="bg-[#EDEAE0] border-b border-[#D5D0C3] py-8">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs font-mono text-[#53605B] mb-3">
                        <Link to="/" className="hover:text-[#124B40] transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/dashboard" className="hover:text-[#124B40] transition-colors">Registry</Link>
                        <span>/</span>
                        <span className="text-[#124B40] font-semibold">Verify Credential</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-bold text-[#102322] font-serif tracking-tight">
                                Public Credential Verification Portal
                            </h1>
                            <p className="text-sm text-[#53605B] mt-1.5 font-normal">
                                Verify cryptographic authenticity and tamper-resistance against the Ethereum smart contract registry.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#E6EFEB] border border-[#C7DFD9] text-[#124B40] text-xs font-mono font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                                Zero-Trust / Triple Audit
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 py-10">
                <div className="max-w-[1100px] mx-auto px-4 sm:px-8 space-y-8">

                    {/* Verification Input Hub Card */}
                    <div className="bg-white border border-[#D5D0C3] rounded p-6 shadow-fine">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-[#D5D0C3]">
                            <div>
                                <h2 className="text-lg font-bold text-[#102322] font-serif">1. Verification Method</h2>
                                <p className="text-xs text-[#53605B] mt-0.5">
                                    Upload the digital document for triple-layer inspection or search directly by SHA-256 hash.
                                </p>
                            </div>

                            {/* Mode Tabs */}
                            <div className="flex bg-[#EDEAE0] p-1 rounded border border-[#D5D0C3] text-xs font-semibold">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('file')}
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded transition-all ${
                                        activeTab === 'file'
                                            ? 'bg-[#124B40] text-white shadow-sm font-bold'
                                            : 'text-[#53605B] hover:text-[#102322]'
                                    }`}
                                >
                                    <FileText size={14} />
                                    <span>Upload Document</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('hash')}
                                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded transition-all ${
                                        activeTab === 'hash'
                                            ? 'bg-[#124B40] text-white shadow-sm font-bold'
                                            : 'text-[#53605B] hover:text-[#102322]'
                                    }`}
                                >
                                    <Hash size={14} />
                                    <span>Query by Hash</span>
                                </button>
                            </div>
                        </div>

                        {activeTab === 'file' ? (
                            <div className="space-y-4">
                                <FileUpload onFileSelect={setFile} label="Attach Official Certificate Document" />

                                {/* Attached Document Preview */}
                                {file && previewUrl && (
                                    <div className="border border-[#D5D0C3] rounded bg-white overflow-hidden shadow-fine">
                                        <div className="px-3.5 py-2.5 bg-[#FAF9F5] border-b border-[#D5D0C3] flex items-center justify-between">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <FileText size={15} className="text-[#124B40] flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-[#102322] truncate max-w-sm" title={file.name}>
                                                        {file.name}
                                                    </p>
                                                    <p className="text-[10px] font-mono text-[#53605B]">
                                                        {(file.size / 1024).toFixed(1)} KB • {isPdf ? 'PDF Document' : isImage ? 'Image Document' : 'Document'}
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={previewUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#124B40] hover:text-[#103D35] bg-[#E6EFEB] hover:bg-[#D7E6E0] rounded transition-colors flex-shrink-0"
                                                title="Open in new window"
                                            >
                                                <span>Open Full View</span>
                                                <ExternalLink size={12} />
                                            </a>
                                        </div>

                                        {isPdf ? (
                                            <div className="relative w-full h-80 bg-neutral-100">
                                                <object
                                                    data={`${previewUrl}#toolbar=0&navpanes=0`}
                                                    type="application/pdf"
                                                    className="w-full h-full border-0"
                                                >
                                                    <iframe
                                                        src={`${previewUrl}#toolbar=0&navpanes=0`}
                                                        title="Auditing Certificate PDF"
                                                        className="w-full h-full border-0"
                                                    />
                                                </object>
                                            </div>
                                        ) : isImage ? (
                                            <div className="p-3 bg-neutral-50 flex items-center justify-center">
                                                <img
                                                    src={previewUrl}
                                                    alt={file.name}
                                                    className="max-h-72 object-contain rounded bg-white border border-[#D5D0C3]"
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-[11px] text-[#53605B] font-mono">
                                        Performs SHA-256 binary hash, OCR semantic text analysis, and pHash visual validation.
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleVerify('file')}
                                        disabled={!file || isVerifying}
                                        className={`inline-flex items-center gap-2 py-2.5 px-5 text-xs font-semibold rounded transition-colors shadow-sm ${
                                            !file || isVerifying
                                                ? 'bg-[#D5D0C3] text-[#53605B] cursor-not-allowed'
                                                : 'bg-[#124B40] hover:bg-[#103D35] text-white cursor-pointer'
                                        }`}
                                    >
                                        {isVerifying ? (
                                            <>
                                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Auditing Document...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck size={15} />
                                                <span>Verify Document Authenticity</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <FloatingLabelInput
                                    label="Certificate SHA-256 Digest (64-character hex or 0x...)"
                                    id="manualHash"
                                    value={manualHash}
                                    onChange={(e) => setManualHash(e.target.value)}
                                    placeholder="e.g. 0x8f2a93c71e0b5d4e8c1f9b3a7d2e4c6b8a0f1e3d5c7b9a1f3e5d7c9b1a3f5d7"
                                    icon={Hash}
                                    helperText="Directly queries smart contract mappings for state anchors and revocation status."
                                />
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[11px] text-[#53605B] font-mono">
                                        Tip: You can query any document hash recorded in the registry ledger.
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleVerify('hash')}
                                        disabled={!manualHash.trim() || isVerifying}
                                        className={`inline-flex items-center gap-2 py-2.5 px-5 text-xs font-semibold rounded transition-colors shadow-sm ${
                                            !manualHash.trim() || isVerifying
                                                ? 'bg-[#D5D0C3] text-[#53605B] cursor-not-allowed'
                                                : 'bg-[#124B40] hover:bg-[#103D35] text-white cursor-pointer'
                                        }`}
                                    >
                                        {isVerifying ? (
                                            <>
                                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Querying Ledger...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck size={15} />
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
                                <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded p-6 flex flex-col sm:flex-row items-start justify-between gap-4 shadow-fine">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center flex-shrink-0">
                                            <CheckCircle2 size={28} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#DCFCE7] text-[#15803D] px-2 py-0.5 rounded border border-[#86EFAC]">
                                                    VERIFIED AUTHENTIC
                                                </span>
                                                <span className="text-xs font-mono text-[#15803D]">
                                                    Consensus Validated
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-[#102322] font-serif">
                                                Authentic &amp; Valid Credential
                                            </h3>
                                            <p className="text-xs text-[#53605B] mt-1 max-w-2xl leading-relaxed">
                                                {result.message || 'This credential has been mathematically validated against the Ethereum blockchain registry.'}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handlePrint}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-[#D5D0C3] hover:border-[#102322] text-[#102322] rounded transition-colors self-end sm:self-center shadow-fine"
                                        title="Print Official Verification Summary"
                                    >
                                        <Printer size={14} />
                                        <span>Print Record</span>
                                    </button>
                                </div>
                            ) : isRevoked ? (
                                <div className="bg-[#FAF5F0] border border-[#E8D4C5] rounded p-6 flex items-start gap-4 shadow-fine">
                                    <div className="w-12 h-12 rounded-full bg-[#F5ECE4] text-[#B65F3D] flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle size={28} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#F5ECE4] text-[#B65F3D] px-2 py-0.5 rounded border border-[#E8D4C5]">
                                                STATUS: REVOKED
                                            </span>
                                            <span className="text-xs font-mono text-[#B65F3D]">
                                                On-Chain Invalidation
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#102322] font-serif">
                                            Certificate Has Been Revoked
                                        </h3>
                                        <p className="text-xs text-[#53605B] mt-1 leading-relaxed">
                                            This certificate was originally anchored on the ledger but has been formally marked as revoked by the authorized issuing authority.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#FEF2F2] border border-[#FECACA] rounded p-6 flex items-start gap-4 shadow-fine">
                                    <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-rose-600 flex items-center justify-center flex-shrink-0">
                                        <AlertCircle size={28} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FEE2E2] text-rose-700 px-2 py-0.5 rounded border border-[#FECACA]">
                                                VERIFICATION FAILED
                                            </span>
                                            <span className="text-xs font-mono text-rose-600">
                                                No Ledger Record
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#102322] font-serif">
                                            Certificate Not Found or Tampered
                                        </h3>
                                        <p className="text-xs text-[#53605B] mt-1 leading-relaxed">
                                            {result.message || 'The cryptographic digest of this document does not match any authorized record on the blockchain registry.'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Section 1: Multi-Layer Cryptographic Integrity Audit */}
                            {details && (
                                <div className="bg-white border border-[#D5D0C3] rounded p-6 shadow-fine">
                                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#D5D0C3]">
                                        <div>
                                            <h3 className="text-base font-bold text-[#102322] font-serif">Cryptographic Integrity Audit</h3>
                                            <p className="text-xs text-[#53605B]">
                                                Multi-stage verification protocol results across raw binary, OCR, and visual layers.
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-mono uppercase bg-[#FAF9F5] border border-[#D5D0C3] px-2 py-0.5 rounded text-[#53605B]">
                                            Audit Telemetry
                                        </span>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr className="border-b border-[#D5D0C3] text-[#53605B] font-mono uppercase text-[10px]">
                                                    <th className="py-2.5 px-3">Verification Stage</th>
                                                    <th className="py-2.5 px-3">Description</th>
                                                    <th className="py-2.5 px-3 text-right">Verdict</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#EDEAE0]">
                                                <tr>
                                                    <td className="py-3 px-3 font-semibold text-[#102322]">Layer 1: Binary SHA-256 Digest</td>
                                                    <td className="py-3 px-3 text-[#53605B]">Bitwise binary equality comparison</td>
                                                    <td className="py-3 px-3 text-right">
                                                        {details.binaryMatch ? (
                                                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold font-mono">
                                                                <CheckCircle size={13} /> Exact Match
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-[#7B8984] font-mono">
                                                                <XCircle size={13} /> No Direct Match
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className="py-3 px-3 font-semibold text-[#102322]">Layer 2: Semantic Content Hash</td>
                                                    <td className="py-3 px-3 text-[#53605B]">OCR normalized text extraction</td>
                                                    <td className="py-3 px-3 text-right">
                                                        {details.contentMatch ? (
                                                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold font-mono">
                                                                <CheckCircle size={13} /> Content Verified
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-[#7B8984] font-mono">
                                                                <XCircle size={13} /> Unverified
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className="py-3 px-3 font-semibold text-[#102322]">Layer 3: Visual Perceptual Hash</td>
                                                    <td className="py-3 px-3 text-[#53605B]">DCT-based visual layout fingerprinting</td>
                                                    <td className="py-3 px-3 text-right">
                                                        {details.imageSimilarity !== null && details.imageSimilarity !== undefined ? (
                                                            <span className="text-[#102322] font-mono font-semibold">
                                                                {details.imageSimilarity}% Similarity
                                                            </span>
                                                        ) : (
                                                            <span className="text-[#7B8984] font-mono">N/A</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Section 2: Certificate Attestation Card (if found) */}
                            {cert && (
                                <div className="bg-white border-2 border-[#102322] rounded p-6 shadow-fine">
                                    <div className="border border-[#B65F3D] p-6 bg-[#FAF9F5] rounded relative">
                                        {/* Seal rosette top-right */}
                                        <div className="absolute top-5 right-5 w-14 h-14 rounded-full border-2 border-dashed border-[#B65F3D] flex items-center justify-center text-[8.5px] font-mono text-[#B65F3D] font-bold text-center uppercase p-1">
                                            VERIFIED SEAL
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B65F3D] font-semibold mb-1">
                                                BLOCKCHAIN ANCHORED RECORD
                                            </p>
                                            <h3 className="text-2xl font-bold font-serif text-[#102322]">
                                                Academic Credential
                                            </h3>
                                        </div>

                                        {cert.metadata ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono mb-6">
                                                <div>
                                                    <span className="text-[10px] uppercase text-[#7B8984] block font-sans">Recipient Name:</span>
                                                    <span className="text-[#102322] font-semibold text-sm font-sans">
                                                        {cert.metadata.studentName}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] uppercase text-[#7B8984] block font-sans">Degree / Program:</span>
                                                    <span className="text-[#124B40] font-semibold font-sans">
                                                        {cert.metadata.courseName}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] uppercase text-[#7B8984] block font-sans">Issuing Institution:</span>
                                                    <span className="text-[#102322] font-sans">
                                                        {cert.metadata.institution}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] uppercase text-[#7B8984] block font-sans">Award Date:</span>
                                                    <span className="text-[#102322]">
                                                        {cert.metadata.issueDate || formatDate(cert.timestamp)}
                                                    </span>
                                                </div>
                                                {cert.metadata.grade && (
                                                    <div>
                                                        <span className="text-[10px] uppercase text-[#7B8984] block font-sans">Grade / Honors:</span>
                                                        <span className="text-[#102322] font-sans">{cert.metadata.grade}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-[#53605B] mb-5">
                                                Encrypted metadata anchored on IPFS with CID: {cert.ipfsCID}
                                            </p>
                                        )}

                                        {/* Technical Ledger Proof Block */}
                                        <div className="bg-white border border-[#D5D0C3] rounded p-4 text-xs font-mono space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="truncate">
                                                    <span className="text-[#7B8984] font-sans font-semibold">Binary SHA-256: </span>
                                                    <span className="text-[#102322]">{cert.docHash}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => copyText(cert.docHash, 'resHash')}
                                                    className="text-[#53605B] hover:text-[#102322]"
                                                    title="Copy hash"
                                                >
                                                    {copiedKey === 'resHash' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between gap-2">
                                                <div className="truncate">
                                                    <span className="text-[#7B8984] font-sans font-semibold">Issuer Public Key: </span>
                                                    <span className="text-[#102322]">{cert.issuer}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => copyText(cert.issuer, 'resIssuer')}
                                                    className="text-[#53605B] hover:text-[#102322]"
                                                    title="Copy issuer"
                                                >
                                                    {copiedKey === 'resIssuer' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                                                </button>
                                            </div>

                                            {cert.ipfsCID && (
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="truncate">
                                                        <span className="text-[#7B8984] font-sans font-semibold">IPFS Payload: </span>
                                                        <span className="text-[#124B40]">{cert.ipfsCID}</span>
                                                    </div>
                                                    <a
                                                        href={`https://gateway.pinata.cloud/ipfs/${cert.ipfsCID}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[#124B40] hover:underline inline-flex items-center gap-1 font-sans text-[11px]"
                                                    >
                                                        <span>View IPFS</span>
                                                        <ExternalLink size={12} />
                                                    </a>
                                                </div>
                                            )}

                                            <div className="pt-2 border-t border-[#D5D0C3] flex items-center justify-between text-[11px]">
                                                <span>Timestamp: {formatDate(cert.timestamp)}</span>
                                                <span className={`font-bold ${isRevoked ? 'text-amber-700' : 'text-emerald-700'}`}>
                                                    {isRevoked ? 'REVOKED' : 'ACTIVE & VALID'}
                                                </span>
                                            </div>
                                        </div>
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
