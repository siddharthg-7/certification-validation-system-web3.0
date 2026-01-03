import React from 'react';

const TransactionModal = ({ isOpen, onClose, status, txHash, message, error }) => {
    if (!isOpen) return null;

    const getStatusIcon = () => {
        switch (status) {
            case 'pending':
                return (
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                );
            case 'success':
                return (
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center glow-green">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'error':
                return (
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center glow-red">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'pending':
                return 'Transaction Pending...';
            case 'success':
                return 'Transaction Successful!';
            case 'error':
                return 'Transaction Failed';
            default:
                return '';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="card max-w-md w-full animate-scale-in">
                <div className="flex flex-col items-center text-center">
                    {getStatusIcon()}

                    <h3 className="text-2xl font-bold mt-6 mb-2">
                        {getStatusText()}
                    </h3>

                    {message && (
                        <p className="text-gray-400 mb-4">
                            {message}
                        </p>
                    )}

                    {error && (
                        <div className="w-full bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                            <p className="text-red-400 text-sm">
                                {error}
                            </p>
                        </div>
                    )}

                    {txHash && (
                        <div className="w-full bg-dark-800 rounded-lg p-4 mb-4">
                            <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                            <p className="font-mono text-sm text-primary-400 break-all">
                                {txHash}
                            </p>
                            <a
                                href={`https://etherscan.io/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary-500 hover:text-primary-400 mt-2 inline-flex items-center gap-1"
                            >
                                View on Explorer
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    )}

                    {status !== 'pending' && (
                        <button
                            onClick={onClose}
                            className="btn-primary w-full"
                        >
                            Close
                        </button>
                    )}

                    {status === 'pending' && (
                        <p className="text-sm text-gray-500 mt-4">
                            Please wait while your transaction is being processed...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;
