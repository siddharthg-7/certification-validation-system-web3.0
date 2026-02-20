import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useWeb3 } from '../hooks/useWeb3';
import WalletConnect from '../components/WalletConnect';
import FileUpload from '../components/FileUpload';
import TransactionModal from '../components/TransactionModal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const IssueCertificate = () => {
    const { isConnected, isCorrectNetwork } = useWeb3();

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Create and revoke object URL for preview
    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Cleanup to avoid memory leaks
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);
    const [formData, setFormData] = useState({
        studentName: '',
        courseName: '',
        institution: '',
        issueDate: '',
        grade: '',
        additionalInfo: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalState, setModalState] = useState({
        isOpen: false,
        status: 'pending',
        txHash: null,
        message: '',
        error: null
    });

    const [result, setResult] = useState(null);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isConnected) {
            alert('Please connect your wallet first');
            return;
        }

        if (!isCorrectNetwork) {
            alert('Please switch to the correct network');
            return;
        }

        if (!file) {
            alert('Please upload a certificate file');
            return;
        }

        setIsSubmitting(true);
        setResult(null);
        setModalState({
            isOpen: true,
            status: 'pending',
            txHash: null,
            message: 'Issuing certificate on blockchain...',
            error: null
        });

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('certificate', file);
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            const response = await axios.post(`${API_URL}/api/issue`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setResult(response.data.data);
            setModalState({
                isOpen: true,
                status: 'success',
                txHash: response.data.data.transactionHash,
                message: 'Certificate issued successfully!',
                error: null
            });

            // Reset form
            setFile(null);
            setFormData({
                studentName: '',
                courseName: '',
                institution: '',
                issueDate: '',
                grade: '',
                additionalInfo: ''
            });

        } catch (error) {
            console.error('Issuance error:', error);
            setModalState({
                isOpen: true,
                status: 'error',
                txHash: null,
                message: 'Failed to issue certificate',
                error: error.response?.data?.details || error.message
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setModalState({ ...modalState, isOpen: false });
    };

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
                        <Link to="/verify" className="text-gray-400 hover:text-primary-500 transition-colors">
                            Verify Certificate
                        </Link>
                        <WalletConnect />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold mb-2">Issue Certificate</h2>
                        <p className="text-gray-400">
                            Upload a certificate and add metadata to issue it on the blockchain
                        </p>
                    </div>

                    {!isConnected && (
                        <div className="card mb-8 bg-yellow-500/10 border-yellow-500/30">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <p className="text-yellow-500">Please connect your wallet to issue certificates</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* File Upload */}
                        <div className="card">
                            <FileUpload
                                onFileSelect={setFile}
                                label="Certificate Document"
                                accept="*"
                            />

                            {/* File Preview */}
                            {file && previewUrl && (
                                <div className="mt-6 border-t border-dark-700 pt-6">
                                    <h4 className="text-sm font-medium text-gray-400 mb-4">Document Preview</h4>

                                    <div className="bg-dark-900 rounded-lg p-2 border border-dark-700 overflow-hidden">
                                        {file.type.startsWith('image/') ? (
                                            <div className="flex justify-center bg-dark-800/50 rounded">
                                                <img
                                                    src={previewUrl}
                                                    alt="Certificate Preview"
                                                    className="max-h-[500px] w-auto object-contain"
                                                />
                                            </div>
                                        ) : file.type === 'application/pdf' ? (
                                            <div className="h-[500px] w-full bg-dark-800/50 rounded relative">
                                                <iframe
                                                    src={previewUrl}
                                                    title="Certificate PDF Preview"
                                                    className="w-full h-full rounded"
                                                />
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center text-gray-500 bg-dark-800/30 rounded border border-dashed border-dark-700">
                                                <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p>Preview not available for this file type.</p>
                                                <p className="text-sm opacity-75 mt-1">{file.name}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Metadata Form */}
                        <div className="card">
                            <h3 className="text-xl font-bold mb-6">Certificate Metadata</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Student Name *</label>
                                    <input
                                        type="text"
                                        name="studentName"
                                        value={formData.studentName}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Course Name *</label>
                                    <input
                                        type="text"
                                        name="courseName"
                                        value={formData.courseName}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="Computer Science"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Institution *</label>
                                    <input
                                        type="text"
                                        name="institution"
                                        value={formData.institution}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="University Name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Issue Date</label>
                                    <input
                                        type="date"
                                        name="issueDate"
                                        value={formData.issueDate}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="label">Grade</label>
                                    <input
                                        type="text"
                                        name="grade"
                                        value={formData.grade}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="A+"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="label">Additional Information</label>
                                    <textarea
                                        name="additionalInfo"
                                        value={formData.additionalInfo}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        rows="3"
                                        placeholder="Any additional details..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isConnected || !isCorrectNetwork || isSubmitting || !file}
                            className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block mr-2"></div>
                                    Issuing Certificate...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Issue Certificate
                                </>
                            )}
                        </button>
                    </form>

                    {/* Result Display */}
                    {result && (
                        <div className="card mt-8 bg-green-500/10 border-green-500/30">
                            <h3 className="text-xl font-bold text-green-500 mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Certificate Issued Successfully!
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-400 font-semibold block mb-1">Blockchain IDs:</span>
                                    <div className="pl-3 border-l-2 border-green-500/30 space-y-2">
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase">Binary Hash</span>
                                            <p className="font-mono text-primary-400 break-all text-xs">{result.docHash}</p>
                                        </div>
                                        {result.contentHash && (
                                            <div>
                                                <span className="text-gray-500 text-xs uppercase">Content Hash</span>
                                                <p className="font-mono text-primary-400 break-all text-xs">{result.contentHash}</p>
                                            </div>
                                        )}
                                        {result.imageHash && (
                                            <div>
                                                <span className="text-gray-500 text-xs uppercase">Image Hash</span>
                                                <p className="font-mono text-primary-400 break-all text-xs">{result.imageHash}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-green-500/20">
                                    <div className="mb-2">
                                        <span className="text-gray-400">IPFS CID:</span>
                                        <p className="font-mono text-primary-400 break-all">{result.ipfsCID}</p>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-gray-400">Transaction Hash:</span>
                                        <p className="font-mono text-primary-400 break-all">{result.transactionHash}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

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
