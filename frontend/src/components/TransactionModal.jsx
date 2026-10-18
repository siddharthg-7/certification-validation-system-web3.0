import React, { useState } from 'react';
import {
    CheckCircle2,
    AlertCircle,
    Loader2,
    Copy,
    Check,
    Activity
} from 'lucide-react';

const TransactionModal = ({ isOpen, onClose, status, txHash, message, error }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const copyTxHash = () => {
        if (txHash) {
            navigator.clipboard.writeText(txHash);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const renderStatusIcon = () => {
        switch (status) {
            case 'pending':
                return (
                    <div className="w-14 h-14 rounded-full bg-[#E6EFEB] border border-[#C7DFD9] flex items-center justify-center text-[#124B40] mb-4">
                        <Loader2 size={28} className="animate-spin text-[#124B40]" />
                    </div>
                );
            case 'success':
                return (
                    <div className="w-14 h-14 rounded-full bg-[#E6EFEB] border border-[#A7D7C5] flex items-center justify-center text-[#15803D] mb-4">
                        <CheckCircle2 size={32} />
                    </div>
                );
            case 'error':
                return (
                    <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
                        <AlertCircle size={32} />
                    </div>
                );
            default:
                return (
                    <div className="w-14 h-14 rounded-full bg-[#FAF9F5] border border-[#D5D0C3] flex items-center justify-center text-[#53605B] mb-4">
                        <Activity size={28} />
                    </div>
                );
        }
    };

    const getStatusTitle = () => {
        switch (status) {
            case 'pending':
                return 'Smart Contract Anchoring In Progress';
            case 'success':
                return 'On-Chain Ledger Confirmation';
            case 'error':
                return 'Ledger Transaction Exception';
            default:
                return 'Ledger Notice';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102322]/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white border border-[#D5D0C3] rounded-lg shadow-elevated max-w-lg w-full p-6 text-center relative overflow-hidden">
                {/* Decorative Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#124B40]" />

                <div className="flex flex-col items-center">
                    {renderStatusIcon()}

                    <h3 className="text-xl font-bold text-[#102322] font-serif mb-2 tracking-tight">
                        {getStatusTitle()}
                    </h3>

                    {message && (
                        <p className="text-sm text-[#53605B] mb-4 leading-relaxed max-w-md">
                            {message}
                        </p>
                    )}

                    {error && (
                        <div className="w-full bg-rose-50 border border-rose-200 rounded p-3 mb-4 text-left">
                            <p className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider mb-1 font-mono">
                                Execution Diagnostics
                            </p>
                            <p className="text-xs text-rose-700 font-mono break-words leading-relaxed">
                                {error}
                            </p>
                        </div>
                    )}

                    {txHash && (
                        <div className="w-full bg-[#FAF9F5] border border-[#D5D0C3] rounded p-3.5 mb-5 text-left">
                            <div className="flex items-center justify-between mb-1.5">
                                <p className="text-[10.5px] font-semibold text-[#124B40] uppercase tracking-wider font-mono">
                                    Ethereum Transaction Hash
                                </p>
                                <button
                                    type="button"
                                    onClick={copyTxHash}
                                    className="inline-flex items-center gap-1 text-[11px] text-[#53605B] hover:text-[#102322] font-mono"
                                    title="Copy transaction hash"
                                >
                                    {copied ? (
                                        <>
                                            <Check size={12} className="text-emerald-600" />
                                            <span className="text-emerald-700">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={12} />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="font-mono text-xs text-[#102322] break-all select-all bg-white p-2 rounded border border-[#D5D0C3]">
                                {txHash}
                            </p>
                            <p className="text-[11px] text-[#15803D] mt-2 flex items-center gap-1.5 font-mono">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                Immutably finalized onto blockchain calldata
                            </p>
                        </div>
                    )}

                    {status === 'pending' ? (
                        <div className="flex items-center justify-center gap-2 text-xs text-[#53605B] mt-1 font-mono">
                            <span className="w-2 h-2 rounded-full bg-[#124B40] animate-ping inline-block" />
                            <span>Awaiting wallet signature &amp; EVM block confirmation...</span>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center justify-center w-full py-2.5 text-[13.5px] font-semibold text-white bg-[#124B40] hover:bg-[#103D35] rounded transition-colors shadow-sm"
                        >
                            Acknowledge &amp; Return to Console
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;
