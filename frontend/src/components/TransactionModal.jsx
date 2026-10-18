import React, { useState } from 'react';
import {
    CheckCircle,
    AlertCircle,
    Activity,
    Copy,
    TickCircle
} from 'reicon-react';

const TransactionModal = ({ isOpen, onClose, status, txHash, message, error }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const copyTxHash = () => {
        if (txHash) {
            navigator.clipboard.writeText(txHash);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        }
    };

    const renderStatusIcon = () => {
        switch (status) {
            case 'pending':
                return (
                    <div className="relative w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyber-400/40 flex items-center justify-center text-cyber-400 mb-5 shadow-cyber">
                        <div className="w-8 h-8 border-2 border-cyber-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                );
            case 'success':
                return (
                    <div className="relative w-16 h-16 rounded-2xl bg-mint-500/10 border border-mint-500/40 flex items-center justify-center text-mint-400 mb-5 shadow-mint-glow animate-bounce">
                        <CheckCircle size={36} color="#00c9a7" weight="Filled" />
                    </div>
                );
            case 'error':
                return (
                    <div className="relative w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-5 shadow-lg">
                        <AlertCircle size={36} color="#ef4444" weight="Filled" />
                    </div>
                );
            default:
                return (
                    <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 mb-5">
                        <Activity size={32} color="#00f2fe" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md transition-opacity">
            <div className="bg-obsidian-900 border border-white/10 rounded-xl shadow-modal max-w-lg w-full p-7 text-center relative overflow-hidden">
                {/* Decorative Cyber Border Accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-400 to-transparent" />

                <div className="flex flex-col items-center">
                    {renderStatusIcon()}

                    <h3 className="text-xl font-bold text-white mb-2 font-display tracking-tight">
                        {getStatusTitle()}
                    </h3>

                    {message && (
                        <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                            {message}
                        </p>
                    )}

                    {error && (
                        <div className="w-full bg-rose-500/10 border border-rose-500/30 rounded-lg p-3.5 mb-5 text-left">
                            <p className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider mb-1">
                                Execution Diagnostics
                            </p>
                            <p className="text-xs text-rose-200 font-mono break-words leading-relaxed">
                                {error}
                            </p>
                        </div>
                    )}

                    {txHash && (
                        <div className="w-full bg-obsidian-850 border border-cyber-400/30 rounded-lg p-3.5 mb-6 text-left shadow-sm">
                            <div className="flex items-center justify-between mb-1.5">
                                <p className="text-[11px] font-semibold text-cyber-400 uppercase tracking-wider font-mono">
                                    Ethereum Transaction Hash
                                </p>
                                <button
                                    type="button"
                                    onClick={copyTxHash}
                                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyber-400 transition-colors font-mono"
                                    title="Copy transaction hash"
                                >
                                    {copied ? (
                                        <>
                                            <TickCircle size={13} color="#00c9a7" />
                                            <span className="text-mint-400">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={13} />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="font-mono text-xs text-slate-200 break-all select-all bg-obsidian-950/80 p-2 rounded border border-white/5">
                                {txHash}
                            </p>
                            <p className="text-[11px] text-mint-400 mt-2 flex items-center gap-1.5 font-mono">
                                <span className="w-2 h-2 rounded-full bg-mint-500 shadow-mint-glow animate-pulse" />
                                Immutably finalized onto blockchain calldata
                            </p>
                        </div>
                    )}

                    {status === 'pending' ? (
                        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                            <span className="w-2 h-2 rounded-full bg-cyber-400 animate-ping" />
                            <span>Awaiting wallet signature &amp; EVM block mining confirmation...</span>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-cyber w-full py-2.5 text-sm"
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
