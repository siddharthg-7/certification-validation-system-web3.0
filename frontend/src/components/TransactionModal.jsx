import React from 'react';

const TransactionModal = ({ isOpen, onClose, status, txHash, message, error }) => {
    if (!isOpen) return null;

    const renderStatusIcon = () => {
        switch (status) {
            case 'pending':
                return (
                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                );
            case 'success':
                return (
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'error':
                return (
                    <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    };

    const getStatusTitle = () => {
        switch (status) {
            case 'pending':
                return 'Transaction Processing';
            case 'success':
                return 'Issuance Confirmed';
            case 'error':
                return 'Transaction Failed';
            default:
                return 'Ledger Notice';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]">
            <div className="bg-white rounded-lg border border-slate-200 shadow-modal max-w-md w-full p-6 text-center">
                <div className="flex flex-col items-center">
                    {renderStatusIcon()}

                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {getStatusTitle()}
                    </h3>

                    {message && (
                        <p className="text-sm text-slate-600 mb-4">
                            {message}
                        </p>
                    )}

                    {error && (
                        <div className="w-full bg-red-50 border border-red-200 rounded p-3 mb-4 text-left">
                            <p className="text-xs font-semibold text-red-800 uppercase tracking-wider mb-0.5">Error Details</p>
                            <p className="text-xs text-red-700 break-words">{error}</p>
                        </div>
                    )}

                    {txHash && (
                        <div className="w-full bg-slate-50 border border-slate-200 rounded p-3 mb-5 text-left">
                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                Blockchain Transaction Hash
                            </p>
                            <p className="font-mono text-xs text-slate-800 break-all select-all">
                                {txHash}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Recorded immutably to EVM ledger
                            </p>
                        </div>
                    )}

                    {status === 'pending' ? (
                        <p className="text-xs text-slate-500 mt-2">
                            Please confirm the transaction in your Web3 wallet and wait for block confirmation...
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-primary w-full mt-2"
                        >
                            Acknowledge &amp; Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;
