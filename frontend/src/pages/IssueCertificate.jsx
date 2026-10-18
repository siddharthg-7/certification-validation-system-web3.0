import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useWeb3 } from '../hooks/useWeb3';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import TransactionModal from '../components/TransactionModal';
import FloatingLabelInput from '../components/FloatingLabelInput';
import {
    DocumentUpload,
    AwardCertificate,
    ShieldCheck,
    User,
    Calendar,
    Copy,
    TickCircle,
    CheckCircle,
    AlertTriangle,
    Scan,
    Lock,
    ArrowRight
} from 'reicon-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const IssueCertificate = () => {
    const { isConnected, isCorrectNetwork, connectWallet } = useWeb3();

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [copiedKey, setCopiedKey] = useState(null);

    useEffect(() => {
        if (!file) { setPreviewUrl(null); return; }
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const [formData, setFormData] = useState({
        studentName: '',
        courseName: '',
        institution: '',
        issueDate: new Date().toISOString().split('T')[0],
        grade: '',
        additionalInfo: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalState, setModalState] = useState({
        isOpen: false, status: 'pending', txHash: null, message: '', error: null
    });
    const [result, setResult] = useState(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const copyText = (text, key) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 1800);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isConnected) {
            alert('Please connect your institutional wallet to proceed.');
            return;
        }
        if (!isCorrectNetwork) {
            alert('Please switch to the designated blockchain network in your wallet.');
            return;
        }
        if (!file) {
            alert('Please attach a certificate document file.');
            return;
        }

        setIsSubmitting(true);
        setResult(null);
        setModalState({
            isOpen: true,
            status: 'pending',
            txHash: null,
            message: 'Broadcasting cryptographic hashes and anchoring to Ethereum smart contract...',
            error: null
        });

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('certificate', file);
            Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));

            const response = await axios.post(`${API_URL}/api/issue`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setResult(response.data.data);
            setModalState({
                isOpen: true,
                status: 'success',
                txHash: response.data.data.transactionHash,
                message: 'Certificate successfully registered and anchored on the blockchain ledger.',
                error: null
            });

            setFile(null);
            setFormData({
                studentName: '',
                courseName: '',
                institution: '',
                issueDate: new Date().toISOString().split('T')[0],
                grade: '',
                additionalInfo: ''
            });

        } catch (error) {
            console.error('Issuance error:', error);
            setModalState({
                isOpen: true,
                status: 'error',
                txHash: null,
                message: 'Failed to record certificate on the ledger.',
                error: error.response?.data?.details || error.message
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => setModalState({ ...modalState, isOpen: false });

    return (
        <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans selection:bg-cyber-400 selection:text-obsidian-950">
            <Navbar />

            {/* Page Header */}
            <div className="bg-obsidian-900/80 border-b border-white/10 py-8 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-3">
                        <Link to="/" className="hover:text-cyber-400 transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/dashboard" className="hover:text-cyber-400 transition-colors">Registry</Link>
                        <span>/</span>
                        <span className="text-cyber-400 font-medium">Issue Credential</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                                Issue Academic / Professional Certificate
                            </h1>
                            <p className="text-sm text-slate-400 mt-1.5 font-light">
                                Anchor a tamper-proof credential to the Ethereum ledger with cryptographic hashing and encrypted archival.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="badge-valid text-xs font-mono">
                                <span className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-pulse" />
                                Smart Contract Registry Ready
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-8">

                    {/* Step Tracker Indicator */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        <div className="glass-card p-3 border-cyber-400/30 flex items-center gap-3">
                            <div className="w-7 h-7 rounded-md bg-cyber-400/20 text-cyber-400 flex items-center justify-center font-mono font-bold text-xs">
                                01
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate font-display">Ingest File</p>
                                <p className="text-[10px] text-slate-400 truncate font-mono">SHA-256 Digest</p>
                            </div>
                        </div>

                        <div className="glass-card p-3 border-cyber-400/30 flex items-center gap-3">
                            <div className="w-7 h-7 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs">
                                02
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate font-display">Metadata</p>
                                <p className="text-[10px] text-slate-400 truncate font-mono">AES-256 + IPFS</p>
                            </div>
                        </div>

                        <div className="glass-card p-3 border-cyber-400/30 flex items-center gap-3">
                            <div className="w-7 h-7 rounded-md bg-mint-500/20 text-mint-400 flex items-center justify-center font-mono font-bold text-xs">
                                03
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate font-display">Calldata Anchor</p>
                                <p className="text-[10px] text-slate-400 truncate font-mono">Immutable State</p>
                            </div>
                        </div>
                    </div>

                    {/* Wallet connection warning */}
                    {!isConnected && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8 flex items-start justify-between gap-4 text-amber-200 text-sm shadow-sm">
                            <div className="flex items-start gap-3">
                                <AlertTriangle size={20} color="#f59e0b" className="flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-amber-300 font-display">Institutional Wallet Not Connected</p>
                                    <p className="text-xs text-amber-200/80 mt-0.5 font-light leading-relaxed">
                                        Please connect your authorized issuer wallet to sign and broadcast cryptographic transactions to the registry.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={connectWallet}
                                className="btn-cyber text-xs py-2 px-3.5 flex-shrink-0"
                            >
                                Connect Wallet
                            </button>
                        </div>
                    )}

                    {/* Success Attestation Banner (if result exists) */}
                    {result && (
                        <div className="glass-card mb-8 border-mint-500/50 bg-mint-500/5 shadow-mint-glow">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-mint-500/20 text-mint-400 flex items-center justify-center flex-shrink-0 border border-mint-500/40">
                                    <CheckCircle size={24} color="#00c9a7" weight="Filled" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="badge-valid text-[11px] font-mono">ON-CHAIN FINALIZED</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white font-display">
                                        Certificate Successfully Registered
                                    </h3>
                                    <p className="text-xs text-slate-300 mt-0.5">
                                        The document digest, multi-layer hashes, and encrypted metadata have been anchored onto the immutable blockchain registry.
                                    </p>

                                    <div className="mt-4 bg-obsidian-900 border border-white/10 rounded-lg p-3.5 text-xs space-y-2.5 font-mono">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="truncate">
                                                <span className="text-slate-400 font-sans font-semibold">Document Hash: </span>
                                                <span className="text-cyan-300 select-all">{result.docHash}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => copyText(result.docHash, 'res-dochash')}
                                                className="text-slate-400 hover:text-white flex-shrink-0"
                                                title="Copy Document Hash"
                                            >
                                                {copiedKey === 'res-dochash' ? <TickCircle size={14} color="#00c9a7" /> : <Copy size={14} />}
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between gap-2">
                                            <div className="truncate">
                                                <span className="text-slate-400 font-sans font-semibold">Transaction: </span>
                                                <span className="text-slate-200 select-all">{result.transactionHash}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => copyText(result.transactionHash, 'res-tx')}
                                                className="text-slate-400 hover:text-white flex-shrink-0"
                                                title="Copy Transaction Hash"
                                            >
                                                {copiedKey === 'res-tx' ? <TickCircle size={14} color="#00c9a7" /> : <Copy size={14} />}
                                            </button>
                                        </div>

                                        {result.ipfsCID && (
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="truncate">
                                                    <span className="text-slate-400 font-sans font-semibold">IPFS Encrypted CID: </span>
                                                    <span className="text-slate-200 select-all">{result.ipfsCID}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => copyText(result.ipfsCID, 'res-ipfs')}
                                                    className="text-slate-400 hover:text-white flex-shrink-0"
                                                    title="Copy IPFS CID"
                                                >
                                                    {copiedKey === 'res-ipfs' ? <TickCircle size={14} color="#00c9a7" /> : <Copy size={14} />}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <Link to="/verify" className="btn-cyber text-xs px-4 py-2 font-semibold">
                                            <span>Verify in Public Portal</span>
                                            <ArrowRight size={14} />
                                        </Link>
                                        <Link to="/dashboard" className="btn-secondary text-xs px-4 py-2">
                                            View in Registry Ledger
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Two-Column Form & Real-Time Preview Deck */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left Column: Form Inputs (7 cols) */}
                        <div className="lg:col-span-7 space-y-6">

                            {/* SECTION 1: Document Upload */}
                            <div className="glass-card">
                                <div className="card-header">
                                    <div className="flex items-center gap-2">
                                        <DocumentUpload size={18} color="#00f2fe" />
                                        <div>
                                            <h2 className="card-title">1. Document Attachment</h2>
                                            <p className="card-subtitle">
                                                Upload digital credential document (PDF or image).
                                            </p>
                                        </div>
                                    </div>
                                    <span className="badge-neutral text-[10px] font-mono">MANDATORY</span>
                                </div>

                                <FileUpload
                                    onFileSelect={setFile}
                                    label=""
                                    accept="*"
                                />

                                {previewUrl && file && file.type.startsWith('image/') && (
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <p className="label-formal">Document Snapshot</p>
                                        <div className="max-h-48 overflow-hidden rounded-lg border border-white/10 bg-obsidian-900 flex items-center justify-center p-2">
                                            <img src={previewUrl} alt="Attached Preview" className="max-h-44 object-contain rounded" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* SECTION 2: Credential & Recipient Details */}
                            <div className="glass-card">
                                <div className="card-header">
                                    <div className="flex items-center gap-2">
                                        <AwardCertificate size={18} color="#818cf8" />
                                        <div>
                                            <h2 className="card-title">2. Credential Parameters</h2>
                                            <p className="card-subtitle">
                                                Candidate and institutional accreditation parameters.
                                            </p>
                                        </div>
                                    </div>
                                    <span className="badge-neutral text-[10px] font-mono">METADATA</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FloatingLabelInput
                                        label="Recipient Full Name"
                                        name="studentName"
                                        value={formData.studentName}
                                        onChange={handleInputChange}
                                        id="studentName"
                                        required
                                        placeholder="e.g. Dr. Elena Rostova"
                                        icon={User}
                                    />

                                    <FloatingLabelInput
                                        label="Course / Degree Program"
                                        name="courseName"
                                        value={formData.courseName}
                                        onChange={handleInputChange}
                                        id="courseName"
                                        required
                                        placeholder="e.g. Blockchain Systems & Security"
                                        icon={AwardCertificate}
                                    />

                                    <FloatingLabelInput
                                        label="Issuing Institution"
                                        name="institution"
                                        value={formData.institution}
                                        onChange={handleInputChange}
                                        id="institution"
                                        required
                                        placeholder="e.g. National Institute of Technology"
                                        icon={ShieldCheck}
                                    />

                                    <FloatingLabelInput
                                        label="Official Issue Date"
                                        type="date"
                                        name="issueDate"
                                        value={formData.issueDate}
                                        onChange={handleInputChange}
                                        id="issueDate"
                                        required
                                        icon={Calendar}
                                    />

                                    <FloatingLabelInput
                                        label="Grade / Classification"
                                        name="grade"
                                        value={formData.grade}
                                        onChange={handleInputChange}
                                        id="grade"
                                        placeholder="e.g. Distinction / First Class / 95%"
                                    />

                                    <div className="md:col-span-2">
                                        <FloatingLabelInput
                                            label="Institutional Remarks &amp; Audit Notes"
                                            name="additionalInfo"
                                            value={formData.additionalInfo}
                                            onChange={handleInputChange}
                                            id="additionalInfo"
                                            textarea
                                            rows={2}
                                            placeholder="Enter accreditation license number, internal registry code, or faculty authorization..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: Cryptographic Sign-Off & Submission */}
                            <div className="glass-card bg-gradient-to-r from-obsidian-900 to-obsidian-850 border-cyber-400/30">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-cyber-400 mb-1">
                                            <Lock size={16} />
                                            <h3 className="text-sm font-bold text-white font-display">
                                                Cryptographic Attestation &amp; Registration
                                            </h3>
                                        </div>
                                        <p className="text-xs text-slate-400 font-light leading-relaxed">
                                            Signing broadcasts binary SHA-256 hash and encrypted payload reference to the smart contract.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !isConnected}
                                        className="btn-cyber py-3 px-6 text-sm flex-shrink-0 font-semibold tracking-wide"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                                                <span>Broadcasting Transaction...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck size={18} color="#07090e" weight="Filled" />
                                                <span>Sign &amp; Anchor on Blockchain</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Live Holographic Certificate Preview Card (5 cols) */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-24 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                                        Real-Time Credential Preview
                                    </span>
                                    <span className="badge-valid text-[10px] font-mono">
                                        Live Render
                                    </span>
                                </div>

                                {/* Holographic Certificate Container */}
                                <div className="certificate-hologram p-6 text-slate-200">
                                    <div className="guilloche-border p-6 rounded-lg text-center relative">
                                        {/* Corner Watermarks */}
                                        <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400/40">VERICHAIN-ERC5192</div>
                                        <div className="absolute top-2 right-2 text-[10px] font-mono text-cyan-400/40">SHA-256</div>

                                        {/* Security Crest */}
                                        <div className="w-12 h-12 mx-auto rounded-full bg-cyber-400/10 border border-cyber-400/30 flex items-center justify-center text-cyber-400 mb-4 shadow-cyber-sm">
                                            <ShieldCheck size={24} color="#00f2fe" />
                                        </div>

                                        <p className="text-[11px] font-mono uppercase tracking-widest text-cyber-400 font-semibold mb-1">
                                            {formData.institution || 'ACCREDITED ISSUING INSTITUTION'}
                                        </p>
                                        <h3 className="text-lg font-bold text-white font-display mb-1">
                                            Certificate of Completion &amp; Mastery
                                        </h3>
                                        <p className="text-[11px] text-slate-400 mb-4 italic">
                                            This is to certify that the credential has been granted to
                                        </p>

                                        {/* Recipient Name Display */}
                                        <div className="py-2.5 my-2 border-y border-white/10 bg-white/5 rounded">
                                            <p className="text-xl font-extrabold text-white font-display tracking-tight">
                                                {formData.studentName || 'Recipient Full Name'}
                                            </p>
                                        </div>

                                        <p className="text-xs text-slate-300 mt-3 font-medium">
                                            for successful qualification in
                                        </p>
                                        <p className="text-sm font-bold text-cyan-300 mt-0.5 font-display">
                                            {formData.courseName || 'Program / Course Name'}
                                        </p>

                                        {formData.grade && (
                                            <p className="text-xs font-mono text-mint-400 mt-2 bg-mint-500/10 inline-block px-2.5 py-0.5 rounded border border-mint-500/30">
                                                Honors: {formData.grade}
                                            </p>
                                        )}

                                        {/* Certificate Footer / Telemetry */}
                                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                                            <div className="text-left">
                                                <p className="text-slate-500 uppercase">Issue Date</p>
                                                <p className="text-slate-300">{formData.issueDate || 'YYYY-MM-DD'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-slate-500 uppercase">Ledger State</p>
                                                <p className="text-mint-400">Cryptographically Signed</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-card p-4 text-xs space-y-2 text-slate-400 font-light">
                                    <div className="flex items-center gap-2 text-slate-300 font-medium">
                                        <Scan size={15} color="#00f2fe" />
                                        <span>Automated Integrity Pipeline</span>
                                    </div>
                                    <p className="leading-relaxed">
                                        Upon signing, this credential will undergo immediate triple-layer analysis (SHA-256 bitwise digest, Tesseract OCR text tokens, and perceptual pHash) before calldata anchoring.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </main>

            {/* Modal for Transaction Feedback */}
            <TransactionModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                status={modalState.status}
                txHash={modalState.txHash}
                message={modalState.message}
                error={modalState.error}
            />
        </div>
    );
};

export default IssueCertificate;
