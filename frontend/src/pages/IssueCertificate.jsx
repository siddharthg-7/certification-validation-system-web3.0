import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useWeb3 } from '../hooks/useWeb3';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';
import TransactionModal from '../components/TransactionModal';
import FloatingLabelInput from '../components/FloatingLabelInput';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const IssueCertificate = () => {
    const { isConnected, isCorrectNetwork } = useWeb3();

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

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
                        <span className="text-slate-800 font-medium">Issue Credential</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        Issue Academic / Professional Certificate
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                        Anchor a tamper-proof credential to the Ethereum ledger with cryptographic hashing and encrypted archival.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-8">

                    {/* Wallet connection warning */}
                    {!isConnected && (
                        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-8 flex items-start gap-3 text-amber-900 text-sm">
                            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="font-semibold">Institutional Wallet Not Connected</p>
                                <p className="text-xs text-amber-800 mt-0.5">
                                    Please click "Connect Wallet" at the top right to authorize and sign blockchain transactions as an approved issuer.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Success Attestation Banner (if result exists) */}
                    {result && (
                        <div className="card mb-8 border-emerald-300 bg-emerald-50/50">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                                    ✓
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-bold text-emerald-900">
                                        Certificate Successfully Registered
                                    </h3>
                                    <p className="text-xs text-emerald-800 mt-0.5">
                                        The document digest and metadata have been anchored onto the immutable blockchain registry.
                                    </p>

                                    <div className="mt-4 bg-white border border-emerald-200 rounded p-3 text-xs space-y-2 font-mono">
                                        <div>
                                            <span className="text-slate-500 font-sans font-semibold">Document Hash: </span>
                                            <span className="text-slate-800 break-all">{result.docHash}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 font-sans font-semibold">Transaction: </span>
                                            <span className="text-slate-800 break-all">{result.transactionHash}</span>
                                        </div>
                                        {result.ipfsCID && (
                                            <div>
                                                <span className="text-slate-500 font-sans font-semibold">IPFS Encrypted CID: </span>
                                                <span className="text-slate-800 break-all">{result.ipfsCID}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex gap-3">
                                        <Link to="/verify" className="btn-primary text-xs px-3.5 py-1.5">
                                            Verify in Public Portal →
                                        </Link>
                                        <Link to="/dashboard" className="btn-secondary text-xs px-3.5 py-1.5">
                                            View in Registry Ledger
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form Container */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* SECTION 1: Document Upload */}
                        <div className="card">
                            <div className="card-header">
                                <div>
                                    <h2 className="card-title">1. Document Attachment</h2>
                                    <p className="card-subtitle">
                                        Upload the primary digital credential document (PDF or image).
                                    </p>
                                </div>
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Required</span>
                            </div>

                            <FileUpload
                                onFileSelect={setFile}
                                label=""
                                accept="*"
                            />

                            {previewUrl && file && file.type.startsWith('image/') && (
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <p className="label-formal">Document Preview</p>
                                    <div className="max-h-48 overflow-hidden rounded border border-slate-200 bg-slate-100 flex items-center justify-center">
                                        <img src={previewUrl} alt="Attached Preview" className="max-h-48 object-contain" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SECTION 2: Credential & Recipient Details */}
                        <div className="card">
                            <div className="card-header">
                                <div>
                                    <h2 className="card-title">2. Credential &amp; Recipient Details</h2>
                                    <p className="card-subtitle">
                                        Enter official candidate and institutional accreditation parameters.
                                    </p>
                                </div>
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Metadata</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FloatingLabelInput
                                    label="Student / Recipient Full Name"
                                    name="studentName"
                                    value={formData.studentName}
                                    onChange={handleInputChange}
                                    id="studentName"
                                    required
                                    placeholder="e.g. Alexander Hamilton"
                                />

                                <FloatingLabelInput
                                    label="Course / Program Name"
                                    name="courseName"
                                    value={formData.courseName}
                                    onChange={handleInputChange}
                                    id="courseName"
                                    required
                                    placeholder="e.g. Master of Public Policy & Administration"
                                />

                                <FloatingLabelInput
                                    label="Issuing Authority / Institution"
                                    name="institution"
                                    value={formData.institution}
                                    onChange={handleInputChange}
                                    id="institution"
                                    required
                                    placeholder="e.g. National Administrative Academy"
                                />

                                <FloatingLabelInput
                                    label="Official Issue Date"
                                    type="date"
                                    name="issueDate"
                                    value={formData.issueDate}
                                    onChange={handleInputChange}
                                    id="issueDate"
                                    required
                                />

                                <FloatingLabelInput
                                    label="Grade / Honors / Score (Optional)"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleInputChange}
                                    id="grade"
                                    placeholder="e.g. Distinction / First Class / 94.5%"
                                />

                                <div className="md:col-span-2">
                                    <FloatingLabelInput
                                        label="Additional Institutional Remarks (Optional)"
                                        name="additionalInfo"
                                        value={formData.additionalInfo}
                                        onChange={handleInputChange}
                                        id="additionalInfo"
                                        textarea
                                        rows={2}
                                        placeholder="Enter registration license number, faculty signature references, or internal audit codes..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: Cryptographic Sign-Off & Submission */}
                        <div className="card bg-slate-50 border-slate-300">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Cryptographic Attestation &amp; Registration
                                    </h3>
                                    <p className="text-xs text-slate-600 mt-0.5">
                                        Signing broadcasts the binary SHA-256 hash and encrypted payload reference to the smart contract.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !isConnected}
                                    className="btn-primary py-3 px-6 text-sm flex-shrink-0"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                            <span>Broadcasting Transaction...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            <span>Issue &amp; Anchor on Blockchain</span>
                                        </>
                                    )}
                                </button>
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
