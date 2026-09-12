import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';

const WalletConnect = () => {
    const {
        account,
        isConnected,
        isConnecting,
        connectWallet,
        disconnectWallet,
        isCorrectNetwork,
        switchNetwork,
        error,
        chainId
    } = useWeb3();

    const [copied, setCopied] = useState(false);

    const truncateAddress = (address) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const copyToClipboard = () => {
        if (account) {
            navigator.clipboard.writeText(account);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-end gap-1.5">
                {error && (
                    <span className="text-red-600 text-xs font-medium max-w-xs text-right">
                        {error}
                    </span>
                )}
                <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="btn-primary text-xs py-2 px-3.5"
                    title="Connect Institutional Web3 Wallet"
                >
                    {isConnecting ? (
                        <>
                            <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                            <span>Connecting...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Connect Wallet</span>
                        </>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {!isCorrectNetwork && (
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-800 text-xs px-2.5 py-1 rounded">
                    <svg className="w-3.5 h-3.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Incorrect Network</span>
                    <button
                        onClick={switchNetwork}
                        className="ml-1 text-[11px] font-semibold bg-amber-600 hover:bg-amber-700 text-white px-2 py-0.5 rounded transition-colors"
                    >
                        Switch
                    </button>
                </div>
            )}

            <div className="inline-flex items-center gap-2 bg-white border border-slate-300 rounded-md px-3 py-1.5 shadow-sm text-xs">
                {/* Network indicator dot */}
                <div className="flex items-center gap-1.5 text-slate-600 border-r border-slate-200 pr-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-mono text-[11px] font-medium text-slate-700">
                        EVM {chainId ? `#${chainId}` : ''}
                    </span>
                </div>

                {/* Account identifier */}
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-800 hover:text-blue-700 transition-colors"
                    title="Click to copy public address"
                >
                    <span>{truncateAddress(account)}</span>
                    <span className="text-[10px] text-slate-400">
                        {copied ? '✓' : '⧉'}
                    </span>
                </button>

                {/* Disconnect */}
                <button
                    onClick={disconnectWallet}
                    className="text-slate-400 hover:text-red-600 pl-1.5 transition-colors border-l border-slate-200"
                    title="Disconnect Session"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default WalletConnect;
