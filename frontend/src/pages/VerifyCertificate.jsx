import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import FloatingLabelInput from '../components/FloatingLabelInput';
import {
    Scan,
    DocumentUpload,
    ShieldCheck,
    CheckCircle,
    AlertCircle,
    AlertTriangle,
    Copy,
    TickCircle,
    Lock,
    AwardCertificate,
    Activity,
    Printer
} from 'reicon-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const VerifyCertificate = () => {
    const [activeTab, setActiveTab] = useState('file'); // 'file' | 'hash'
    const [file, setFile] = useState(null);
    const [manualHash, setManualHash] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState(null);
    const [copiedKey, setCopiedKey] = useState(null);

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
        setTimeout(() => setCopiedKey(null), 1800);
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
        <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans selection:bg-cyber-400 selection:text-obsidian-950">
            <Navbar />

            {/* Page Header */}
            <div className="bg-obsidian-900/80 border-b border-white/10 py-8 relative">
                <div className="max-w-5xl mx-auto px-4 sm:px-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-3">
                        <Link to="/" className="hover:text-cyber-400 transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/dashboard" className="hover:text-cyber-400 transition-colors">Registry</Link>
                        <span>/</span>
                        <span className="text-cyber-400 font-medium">Verify Credential</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                                Public Credential Verification Portal
                            </h1>
                            <p className="text-sm text-slate-400 mt-1.5 font-light">
                                Verify cryptographic authenticity and tamper-resistance against the Ethereum smart contract registry.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="badge-valid text-xs font-mono">
                                <span className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-pulse" />
                                Zero-Knowledge / Triple Audit
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 py-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-8">

                    {/* Verification Input Hub Card */}
                    <div className="glass-card">
                        <div className="card-header">
                            <div>
                                <h2 className="card-title">1. Verification Method</h2>
                                <p className="card-subtitle">
                                    Upload the digital document for triple-layer inspection or search directly by SHA-256 hash.
                                </p>
                            </div>

                            {/* Mode Tabs */}
                            <div className="flex bg-obsidian-900 p-1 rounded-lg border border-white/10 text-xs font-semibold">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('file')}
                                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all ${
                                        activeTab === 'file'
                                            ? 'bg-cyber-400 text-obsidian-950 font-bold shadow-cyber-sm'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <DocumentUpload size={14} />
                                    <span>Document File</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('hash')}
                                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md transition-all ${
                                        activeTab === 'hash'
                                            ? 'bg-cyber-400 text-obsidian-950 font-bold shadow-cyber-sm'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <Scan size={14} />
                                    <span>Hash Lookup</span>
                                </button>
                            </div>
                        </div>

                        {activeTab === 'file' ? (
                            <div className="space-y-5">
                                <FileUpload
                                    onFileSelect={setFile}
                                    label="Upload Certificate Document for Multi-Layer Verification"
                                    accept="*"
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => handleVerify('file')}
                                        disabled={!file || isVerifying}
                                        className="btn-cyber py-3 px-6 text-sm font-semibold tracking-wide"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                                                <span>Analyzing Integrity...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Scan size={16} color="#07090e" weight="Filled" />
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
                                    icon={Scan}
                                    helperText="Directly queries smart contract mappings for state anchors and revocation status."
                                />
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[11px] text-slate-500 font-mono">
                                        Tip: You can query any document hash generated upon issuance.
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleVerify('hash')}
                                        disabled={!manualHash.trim() || isVerifying}
                                        className="btn-cyber py-3 px-6 text-sm font-semibold tracking-wide"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                                                <span>Querying Ledger...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck size={16} color="#07090e" weight="Filled" />
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
                                <div className="glass-card border-mint-500/50 bg-mint-500/10 p-6 flex flex-col sm:flex-row items-start justify-between gap-4 shadow-mint-glow">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-mint-500/20 text-mint-400 flex items-center justify-center flex-shrink-0 text-xl font-bold border border-mint-500/40">
                                            <CheckCircle size={28} color="#00c9a7" weight="Filled" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="badge-valid text-[11px] font-mono">VERIFIED AUTHENTIC</span>
                                                <span className="text-xs font-mono text-mint-400">
                                                    Consensus Validated
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white font-display">
                                                Authentic &amp; Valid Credential
                                            </h3>
                                            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                                                {result.message || 'This credential has been mathematically validated against the Ethereum blockchain registry.'}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handlePrint}
                                        className="btn-secondary text-xs px-4 py-2 flex items-center gap-2 self-end sm:self-center"
                                        title="Print Official Verification Summary"
                                    >
                                        <Printer size={15} />
                                        <span>Print Record</span>
                                    </button>
                                </div>
                            ) : isRevoked ? (
                                <div className="glass-card border-amber-500/50 bg-amber-500/10 p-6 flex items-start gap-4 shadow-sm">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 text-xl font-bold border border-amber-500/40">
                                        <AlertTriangle size={28} color="#f59e0b" weight="Filled" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="badge-revoked text-[11px] font-mono">STATUS: REVOKED</span>
                                            <span className="text-xs font-mono text-amber-300">
                                                On-Chain Invalidation
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white font-display">
                                            Certificate Has Been Revoked
                                        </h3>
                                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                            This certificate was originally anchored on the ledger but has been formally marked as revoked by the authorized issuing authority.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="glass-card border-rose-500/50 bg-rose-500/10 p-6 flex items-start gap-4 shadow-sm">
                                    <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 text-xl font-bold border border-rose-500/40">
                                        <AlertCircle size={28} color="#ef4444" weight="Filled" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="badge-invalid text-[11px] font-mono">VERIFICATION FAILED</span>
                                            <span className="text-xs font-mono text-rose-300">
                                                No Ledger Record
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white font-display">
                                            Certificate Not Found or Tampered
                                        </h3>
                                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                            {result.message || 'The cryptographic digest of this document does not match any authorized record on the blockchain registry.'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Section 1: Multi-Layer Cryptographic Integrity Audit */}
                            {details && (
                                <div className="glass-card">
                                    <div className="card-header">
                                        <div className="flex items-center gap-2">
                                            <Activity size={18} color="#00f2fe" />
                                            <div>
                                                <h3 className="card-title">Cryptographic Integrity Audit</h3>
                                                <p className="card-subtitle">
                                                    Multi-stage verification protocol results across raw binary, OCR, and visual layers.
                                                </p>
                                            </div>
                                        </div>
                                        <span className="badge-neutral text-[11px] font-mono">Audit Telemetry</span>
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
                                                    <td className="font-semibold text-white">
                                                        Layer 1: SHA-256 Binary Integrity
                                                    </td>
                                                    <td className="text-xs text-slate-400">
                                                        Exact bitwise file hash comparison against on-chain anchor
                                                    </td>
                                                    <td className="text-right">
                                                        {details.binaryMatch ? (
                                                            <span className="badge-valid text-[11px]">
                                                                <CheckCircle size={12} />
                                                                <span>EXACT MATCH</span>
                                                            </span>
                                                        ) : (
                                                            <span className="badge-invalid text-[11px]">
                                                                <AlertCircle size={12} />
                                                                <span>MISMATCH</span>
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="font-semibold text-white">
                                                        Layer 2: OCR Content Analysis
                                                    </td>
                                                    <td className="text-xs text-slate-400">
                                                        Optical character extraction &amp; semantic pattern matching
                                                    </td>
                                                    <td className="text-right">
                                                        {details.contentMatch ? (
                                                            <span className="badge-valid text-[11px]">
                                                                <CheckCircle size={12} />
                                                                <span>VERIFIED</span>
                                                            </span>
                                                        ) : (
                                                            <span className="badge-invalid text-[11px]">
                                                                <AlertCircle size={12} />
                                                                <span>NOT VERIFIED</span>
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="font-semibold text-white">
                                                        Layer 3: Visual Perceptual Similarity
                                                    </td>
                                                    <td className="text-xs text-slate-400">
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

                            {/* Section 2: Credential & Recipient Record (Decrypted Metadata) */}
                            {cert?.metadata && (
                                <div className="glass-card">
                                    <div className="card-header">
                                        <div className="flex items-center gap-2">
                                            <AwardCertificate size={18} color="#818cf8" />
                                            <div>
                                                <h3 className="card-title">Credential Metadata Record</h3>
                                                <p className="card-subtitle">
                                                    Decrypted official candidate and accreditation information.
                                                </p>
                                            </div>
                                        </div>
                                        <span className="badge-neutral text-[11px] font-mono">IPFS Decrypted</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        <div className="p-3.5 bg-obsidian-900 border border-white/10 rounded-lg">
                                            <span className="label-formal">Candidate Full Name</span>
                                            <p className="text-base font-bold text-white font-display">
                                                {cert.metadata.studentName || 'Not specified'}
                                            </p>
                                        </div>

                                        <div className="p-3.5 bg-obsidian-900 border border-white/10 rounded-lg">
                                            <span className="label-formal">Course / Program</span>
                                            <p className="text-base font-bold text-cyber-400 font-display">
                                                {cert.metadata.courseName || 'Not specified'}
                                            </p>
                                        </div>

                                        <div className="p-3.5 bg-obsidian-900 border border-white/10 rounded-lg">
                                            <span className="label-formal">Issuing Institution</span>
                                            <p className="text-sm font-semibold text-slate-200">
                                                {cert.metadata.institution || 'Not specified'}
                                            </p>
                                        </div>

                                        <div className="p-3.5 bg-obsidian-900 border border-white/10 rounded-lg">
                                            <span className="label-formal">Official Date of Issue</span>
                                            <p className="text-sm font-mono text-slate-200">
                                                {cert.metadata.issueDate || 'Not specified'}
                                            </p>
                                        </div>

                                        {cert.metadata.grade && (
                                            <div className="p-3.5 bg-obsidian-900 border border-white/10 rounded-lg">
                                                <span className="label-formal">Grade / Classification</span>
                                                <p className="text-sm font-mono font-semibold text-mint-400">
                                                    {cert.metadata.grade}
                                                </p>
                                            </div>
                                        )}

                                        {cert.metadata.additionalInfo && (
                                            <div className="p-3.5 bg-obsidian-900 border border-white/10 rounded-lg sm:col-span-2">
                                                <span className="label-formal">Official Remarks &amp; Audit Notes</span>
                                                <p className="text-xs text-slate-300 leading-relaxed font-light">
                                                    {cert.metadata.additionalInfo}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Section 3: Blockchain Provenance & Audit Trail */}
                            {cert && (
                                <div className="glass-card">
                                    <div className="card-header">
                                        <div className="flex items-center gap-2">
                                            <Lock size={18} color="#00f2fe" />
                                            <div>
                                                <h3 className="card-title">Blockchain Provenance &amp; Ledger Audit</h3>
                                                <p className="card-subtitle">
                                                    Immutable on-chain parameters and cryptographic storage references.
                                                </p>
                                            </div>
                                        </div>
                                        <span className="badge-neutral text-[11px] font-mono">EVM Smart Contract</span>
                                    </div>

                                    <div className="space-y-3 font-mono text-xs">
                                        <div className="p-3.5 bg-obsidian-900 border border-white/10 rounded-lg flex items-center justify-between gap-2">
                                            <div className="truncate">
                                                <span className="block text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                                    Document SHA-256 Hash
                                                </span>
                                                <span className="text-cyan-300 font-semibold select-all">
                                                    {cert.docHash}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => copyText(cert.docHash, 'dochash')}
                                                className="text-slate-400 hover:text-white flex-shrink-0"
                                                title="Copy Document Hash"
                                            >
                                                {copiedKey === 'dochash' ? <TickCircle size={14} color="#00c9a7" /> : <Copy size={14} />}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="p-3.5 bg-obsidian-900 border border-white/10 rounded-lg flex items-center justify-between gap-2">
                                                <div className="truncate">
                                                    <span className="block text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                                        Authorized Issuer Address
                                                    </span>
                                                    <span className="text-slate-300 select-all">
                                                        {cert.issuer}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => copyText(cert.issuer, 'issuer')}
                                                    className="text-slate-400 hover:text-white flex-shrink-0"
                                                    title="Copy Issuer Address"
                                                >
                                                    {copiedKey === 'issuer' ? <TickCircle size={14} color="#00c9a7" /> : <Copy size={14} />}
                                                </button>
                                            </div>

                                            <div className="p-3.5 bg-obsidian-900 border border-white/10 rounded-lg">
                                                <span className="block text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                                    Block Registration Timestamp
                                                </span>
                                                <span className="text-slate-200 font-sans">
                                                    {formatDate(cert.timestamp)}
                                                </span>
                                            </div>
                                        </div>

                                        {cert.ipfsCID && (
                                            <div className="p-3.5 bg-obsidian-900 border border-white/10 rounded-lg flex items-center justify-between gap-2">
                                                <div className="truncate">
                                                    <span className="block text-[11px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                                        IPFS Encrypted Payload CID
                                                    </span>
                                                    <span className="text-slate-300 select-all">
                                                        {cert.ipfsCID}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => copyText(cert.ipfsCID, 'ipfscid')}
                                                    className="text-slate-400 hover:text-white flex-shrink-0"
                                                    title="Copy IPFS CID"
                                                >
                                                    {copiedKey === 'ipfscid' ? <TickCircle size={14} color="#00c9a7" /> : <Copy size={14} />}
                                                </button>
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
