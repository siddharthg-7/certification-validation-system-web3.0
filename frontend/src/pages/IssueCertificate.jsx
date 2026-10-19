import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useWeb3 } from '../hooks/useWeb3';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import TransactionModal from '../components/TransactionModal';
import FloatingLabelInput from '../components/FloatingLabelInput';
import {
    FileText,
    Award,
    ShieldCheck,
    User,
    Calendar,
    Copy,
    Check,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    ExternalLink,
    Sparkles
} from 'lucide-react';

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

    const isPdf = file && (file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf'));
    const isImage = file && (file.type?.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name || ''));

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

    const handleFillSample = () => {
        setFormData({
            studentName: 'Alex Thorne',
            courseName: 'Master of Science in Distributed Computing',
            institution: 'Stanford Institute of Technology',
            issueDate: new Date().toISOString().split('T')[0],
            grade: 'Summa Cum Laude (GPA 4.0)',
            additionalInfo: 'ID-2024-MSDC-8849'
        });
        toast.success('Sample university metadata loaded!');
    };

    const copyText = (text, key) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isConnected) {
            toast.error('Please connect your institutional wallet to proceed.');
            return;
        }
        if (!isCorrectNetwork) {
            toast.error('Please switch to the designated blockchain network in your wallet.');
            return;
        }
        if (!file) {
            toast.error('Please attach a certificate document file.');
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
                message: 'Certificate successfully verified and permanently anchored on-chain.',
                error: null
            });
            toast.success('Certificate successfully registered on-chain!');

            // Reset form
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
            const errMsg = error.response?.data?.details || error.message || 'Failed to record certificate';
            setModalState({
                isOpen: true,
                status: 'error',
                txHash: null,
                message: 'Failed to record certificate on the ledger.',
                error: errMsg
            });
            toast.error(errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => setModalState({ ...modalState, isOpen: false });

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
                        <span className="text-[#124B40] font-semibold">Issue Credential</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-bold text-[#102322] font-serif tracking-tight">
                                Issue Academic / Professional Certificate
                            </h1>
                            <p className="text-sm text-[#53605B] mt-1.5 font-normal">
                                Anchor a tamper-proof credential to the Ethereum ledger with cryptographic hashing and encrypted archival.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#E6EFEB] border border-[#C7DFD9] text-[#124B40] text-xs font-mono font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                                Smart Contract Registry Ready
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 py-10">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-8">

                    {/* Step Tracker Indicator */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-[#FAF9F5] border border-[#D5D0C3] rounded p-4 flex items-center gap-3.5 shadow-fine">
                            <div className="w-8 h-8 rounded bg-[#FAF5F0] border border-[#E8D4C5] text-[#B65F3D] flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                                01
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-[#102322] truncate font-sans">Ingest File</p>
                                <p className="text-[11px] text-[#53605B] truncate font-mono">SHA-256 Digest</p>
                            </div>
                        </div>

                        <div className="bg-[#FAF9F5] border border-[#D5D0C3] rounded p-4 flex items-center gap-3.5 shadow-fine">
                            <div className="w-8 h-8 rounded bg-[#FAF5F0] border border-[#E8D4C5] text-[#B65F3D] flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                                02
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-[#102322] truncate font-sans">Metadata</p>
                                <p className="text-[11px] text-[#53605B] truncate font-mono">AES-256 + IPFS</p>
                            </div>
                        </div>

                        <div className="bg-[#FAF9F5] border border-[#D5D0C3] rounded p-4 flex items-center gap-3.5 shadow-fine">
                            <div className="w-8 h-8 rounded bg-[#E6EFEB] border border-[#C7DFD9] text-[#124B40] flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                                03
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-[#102322] truncate font-sans">Calldata Anchor</p>
                                <p className="text-[11px] text-[#53605B] truncate font-mono">Immutable State</p>
                            </div>
                        </div>
                    </div>

                    {/* Wallet connection warning */}
                    {!isConnected && (
                        <div className="bg-[#FAF5F0] border border-[#E8D4C5] rounded p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[#8E4426] text-sm shadow-fine">
                            <div className="flex items-start gap-3">
                                <AlertTriangle size={20} className="text-[#B65F3D] flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-[#102322]">Institutional Wallet Not Connected</p>
                                    <p className="text-xs text-[#53605B] mt-0.5 leading-relaxed">
                                        Please connect your authorized issuer wallet to sign and broadcast cryptographic transactions to the registry.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={connectWallet}
                                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#124B40] hover:bg-[#103D35] text-white rounded transition-colors whitespace-nowrap shadow-sm"
                            >
                                Connect Wallet
                            </button>
                        </div>
                    )}

                    {/* Success Attestation Banner (if result exists) */}
                    {result && (
                        <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded p-6 mb-8 shadow-fine">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#DCFCE7] text-[#15803D] px-2 py-0.5 rounded border border-[#86EFAC]">
                                            ON-CHAIN FINALIZED
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#102322] font-serif">
                                        Certificate Successfully Registered
                                    </h3>
                                    <p className="text-xs text-[#53605B] mt-0.5">
                                        The document digest, multi-layer hashes, and encrypted metadata have been anchored onto the immutable blockchain registry.
                                    </p>

                                    <div className="mt-4 bg-white border border-[#D5D0C3] rounded p-3.5 text-xs space-y-2.5 font-mono">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="truncate">
                                                <span className="text-[#53605B] font-sans font-semibold">Document Hash: </span>
                                                <span className="text-[#102322] font-mono">{result.docHash}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => copyText(result.docHash, 'docHash')}
                                                className="text-[#53605B] hover:text-[#102322] flex-shrink-0"
                                                title="Copy document hash"
                                            >
                                                {copiedKey === 'docHash' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between gap-2">
                                            <div className="truncate">
                                                <span className="text-[#53605B] font-sans font-semibold">IPFS Reference CID: </span>
                                                <span className="text-[#102322] font-mono">{result.ipfsCID}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => copyText(result.ipfsCID, 'ipfsCID')}
                                                className="text-[#53605B] hover:text-[#102322] flex-shrink-0"
                                                title="Copy IPFS CID"
                                            >
                                                {copiedKey === 'ipfsCID' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between gap-2">
                                            <div className="truncate">
                                                <span className="text-[#53605B] font-sans font-semibold">Transaction: </span>
                                                <span className="text-[#124B40] font-mono">{result.transactionHash}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => copyText(result.transactionHash, 'txHash')}
                                                className="text-[#53605B] hover:text-[#102322] flex-shrink-0"
                                                title="Copy transaction hash"
                                            >
                                                {copiedKey === 'txHash' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center gap-3">
                                        <Link
                                            to={`/verify?hash=${encodeURIComponent(result.docHash)}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#124B40] hover:bg-[#103D35] text-white rounded transition-colors shadow-sm"
                                        >
                                            <ShieldCheck size={13} />
                                            <span>Verify on Public Portal</span>
                                            <ArrowRight size={13} />
                                        </Link>
                                        <Link
                                            to="/dashboard"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-[#D5D0C3] hover:border-[#102322] text-[#102322] rounded transition-colors shadow-fine"
                                        >
                                            <span>View in Registry Ledger</span>
                                            <ArrowRight size={13} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Two-Column Form & Preview Layout */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: File Upload & Metadata Fields (7 cols) */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Card 1: Document Upload */}
                            <div className="bg-white border border-[#D5D0C3] rounded p-6 shadow-fine">
                                <h3 className="text-base font-bold text-[#102322] font-serif mb-1 flex items-center gap-2">
                                    <FileText size={18} className="text-[#124B40]" />
                                    <span>Official Credential Document</span>
                                </h3>
                                <p className="text-xs text-[#53605B] mb-4">
                                    Attach the official university or professional certificate file to compute binary SHA-256 and visual perceptual hashes.
                                </p>
                                <FileUpload onFileSelect={setFile} label="" />

                                {/* Attached Document Quick Preview in Ingestion Card */}
                                {file && previewUrl && (
                                    <div className="mt-4 pt-4 border-t border-[#D5D0C3]">
                                        <div className="flex items-center justify-between mb-2.5">
                                            <span className="text-xs font-bold text-[#102322] flex items-center gap-1.5 font-sans">
                                                <CheckCircle2 size={15} className="text-emerald-600" />
                                                <span>Attached Document Preview ({isPdf ? 'PDF' : isImage ? 'Image' : 'File'})</span>
                                            </span>
                                            <a
                                                href={previewUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#124B40] hover:text-[#103D35] bg-[#E6EFEB] px-2 py-0.5 rounded transition-colors"
                                                title="Open in new window"
                                            >
                                                <span>Open in new window</span>
                                                <ExternalLink size={12} />
                                            </a>
                                        </div>

                                        {isPdf ? (
                                            <div className="w-full h-80 border border-[#D5D0C3] rounded bg-white overflow-hidden shadow-inner">
                                                <object
                                                    data={`${previewUrl}#toolbar=0&navpanes=0`}
                                                    type="application/pdf"
                                                    className="w-full h-full"
                                                >
                                                    <iframe
                                                        src={`${previewUrl}#toolbar=0&navpanes=0`}
                                                        title="Attached PDF Document Preview"
                                                        className="w-full h-full border-0"
                                                    />
                                                </object>
                                            </div>
                                        ) : isImage ? (
                                            <div className="w-full max-h-72 border border-[#D5D0C3] rounded bg-neutral-50 p-2 flex items-center justify-center">
                                                <img
                                                    src={previewUrl}
                                                    alt="Attached document preview"
                                                    className="max-h-64 object-contain rounded bg-white border border-[#D5D0C3]"
                                                />
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-[#FAF9F5] border border-[#D5D0C3] rounded text-xs text-[#53605B]">
                                                {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Card 2: Student & Institution Details */}
                            <div className="bg-white border border-[#D5D0C3] rounded p-6 shadow-fine space-y-4">
                                <div className="flex items-center justify-between pb-1 border-b border-[#EDEAE0] mb-3">
                                    <div>
                                        <h3 className="text-base font-bold text-[#102322] font-serif flex items-center gap-2">
                                            <Award size={18} className="text-[#124B40]" />
                                            <span>Recipient &amp; Institutional Metadata</span>
                                        </h3>
                                        <p className="text-xs text-[#53605B] mt-0.5">
                                            Encrypted with AES-256-CBC prior to IPFS storage to ensure student privacy.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleFillSample}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#124B40] hover:text-[#103D35] bg-[#E6EFEB] hover:bg-[#D7E6E0] rounded transition-colors flex-shrink-0"
                                        title="Fill with realistic sample credential data"
                                    >
                                        <Sparkles size={12} />
                                        <span>Fill Sample</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FloatingLabelInput
                                        id="studentName"
                                        name="studentName"
                                        label="Recipient Full Name"
                                        value={formData.studentName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. Alex Thorne"
                                        icon={User}
                                    />

                                    <FloatingLabelInput
                                        id="courseName"
                                        name="courseName"
                                        label="Degree / Course Awarded"
                                        value={formData.courseName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. Master of Science in Distributed Computing"
                                        icon={Award}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FloatingLabelInput
                                        id="institution"
                                        name="institution"
                                        label="Issuing Institution"
                                        value={formData.institution}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. Stanford Institute of Technology"
                                        icon={ShieldCheck}
                                    />

                                    <FloatingLabelInput
                                        id="issueDate"
                                        name="issueDate"
                                        type="date"
                                        label="Issuance Date"
                                        value={formData.issueDate}
                                        onChange={handleInputChange}
                                        required
                                        icon={Calendar}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FloatingLabelInput
                                        id="grade"
                                        name="grade"
                                        label="Grade / Distinction (Optional)"
                                        value={formData.grade}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Summa Cum Laude (GPA 4.0)"
                                    />

                                    <FloatingLabelInput
                                        id="additionalInfo"
                                        name="additionalInfo"
                                        label="Roll / Student ID (Optional)"
                                        value={formData.additionalInfo}
                                        onChange={handleInputChange}
                                        placeholder="e.g. ID-2024-MSDC-8849"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                {!isConnected ? (
                                    <div className="bg-[#FAF5F0] border border-[#E8D4C5] rounded p-4 text-center">
                                        <p className="text-xs text-[#8E4426] font-medium mb-2.5">
                                            Connect your institutional wallet to sign and anchor credentials on-chain.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={connectWallet}
                                            className="inline-flex items-center gap-2 py-2 px-4 rounded font-semibold text-xs bg-[#124B40] hover:bg-[#103D35] text-white transition-all shadow-sm"
                                        >
                                            Connect Institutional Wallet
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full py-3.5 px-6 rounded font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2.5 ${
                                            isSubmitting
                                                ? 'bg-[#D5D0C3] text-[#53605B] cursor-not-allowed'
                                                : 'bg-[#124B40] hover:bg-[#103D35] text-white cursor-pointer'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Processing Calldata Anchoring...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck size={18} />
                                                <span>Sign &amp; Anchor Certificate On-Chain</span>
                                                <span>→</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Dynamic Certificate Preview (5 cols) */}
                        <div className="lg:col-span-5">
                            <div className="bg-white border border-[#D5D0C3] rounded p-6 shadow-fine sticky top-24">
                                <h3 className="text-base font-bold text-[#102322] font-serif mb-1 flex items-center gap-2">
                                    <Award size={18} className="text-[#124B40]" />
                                    <span>Real-Time Certificate Draft</span>
                                </h3>
                                <p className="text-xs text-[#53605B] mb-5">
                                    Visual verification draft prior to smart contract registration.
                                </p>

                                {/* Framed Certificate Box */}
                                <div className="border-2 border-[#102322] p-5 rounded bg-[#FAF9F5] relative shadow-fine">
                                    {/* Inner Guilloche Border */}
                                    <div className="border border-[#B65F3D] p-5 bg-white relative">
                                        {/* Seal rosette top-right */}
                                        <div className="absolute top-4 right-4 w-12 h-12 rounded-full border-2 border-dashed border-[#B65F3D] flex items-center justify-center text-[8px] font-mono text-[#B65F3D] font-bold text-center leading-none uppercase p-1">
                                            SEAL OF VERITAS
                                        </div>

                                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B65F3D] font-semibold mb-1">
                                            OFFICIAL CREDENTIAL
                                        </p>
                                        <h4 className="text-xl font-bold font-serif text-[#102322] mb-3">
                                            Academic Credential
                                        </h4>

                                        <div className="space-y-2 text-xs font-mono text-[#53605B] mb-5">
                                            <div>
                                                <span className="text-[10px] uppercase text-[#7B8984] block font-sans">Recipient:</span>
                                                <span className="text-[#102322] font-semibold text-sm font-sans">
                                                    {formData.studentName || 'Recipient Name Pending'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] uppercase text-[#7B8984] block font-sans">Degree Program:</span>
                                                <span className="text-[#124B40] font-semibold font-sans">
                                                    {formData.courseName || 'Degree Program Pending'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] uppercase text-[#7B8984] block font-sans">Institution:</span>
                                                <span className="text-[#102322] font-sans">
                                                    {formData.institution || 'Issuing Institution Pending'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] uppercase text-[#7B8984] block font-sans">Date of Record:</span>
                                                <span className="text-[#102322]">
                                                    {formData.issueDate || '—'}
                                                </span>
                                            </div>
                                            {formData.grade && (
                                                <div>
                                                    <span className="text-[10px] uppercase text-[#7B8984] block font-sans">Grade:</span>
                                                    <span className="text-[#102322] font-sans">{formData.grade}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Attached Document Preview */}
                                        {previewUrl ? (
                                            <div className="border border-[#D5D0C3] rounded bg-[#FAF9F5] p-2.5 mb-4 shadow-fine">
                                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D5D0C3]">
                                                    <div className="flex items-center gap-1.5 min-w-0">
                                                        <FileText size={14} className="text-[#124B40] flex-shrink-0" />
                                                        <span className="text-[11px] font-semibold text-[#102322] font-sans truncate max-w-[150px] sm:max-w-[190px]">
                                                            {file?.name || 'Attached Document'}
                                                        </span>
                                                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#E6EFEB] text-[#124B40] font-bold">
                                                            {isPdf ? 'PDF' : isImage ? 'IMAGE' : 'DOC'}
                                                        </span>
                                                    </div>
                                                    <a
                                                        href={previewUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-[10px] font-mono text-[#124B40] hover:underline flex-shrink-0"
                                                        title="Open document in new window"
                                                    >
                                                        <span>Open</span>
                                                        <ExternalLink size={11} />
                                                    </a>
                                                </div>

                                                {isPdf ? (
                                                    <div className="w-full h-80 rounded border border-[#D5D0C3] bg-white overflow-hidden shadow-inner">
                                                        <object
                                                            data={`${previewUrl}#toolbar=0&navpanes=0`}
                                                            type="application/pdf"
                                                            className="w-full h-full"
                                                        >
                                                            <iframe
                                                                src={`${previewUrl}#toolbar=0&navpanes=0`}
                                                                title="Credential attachment preview"
                                                                className="w-full h-full border-0"
                                                            />
                                                        </object>
                                                    </div>
                                                ) : isImage ? (
                                                    <img
                                                        src={previewUrl}
                                                        alt={file?.name || 'Credential attachment'}
                                                        className="w-full max-h-64 object-contain rounded bg-white border border-[#D5D0C3]"
                                                    />
                                                ) : (
                                                    <div className="p-3 bg-white border border-[#D5D0C3] rounded text-xs text-[#53605B]">
                                                        {file?.name} ({(file?.size / 1024).toFixed(1)} KB)
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="border border-dashed border-[#D5D0C3] rounded p-3 text-center text-xs text-[#7B8984] mb-3">
                                                No document attached yet
                                            </div>
                                        )}

                                        <div className="pt-2 border-t border-[#D5D0C3] flex items-center justify-between text-[10px] font-mono text-[#7B8984]">
                                            <span>STATUS: DRAFT</span>
                                            <span>CHAIN ID: 31337</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            {/* Transaction Modal */}
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
