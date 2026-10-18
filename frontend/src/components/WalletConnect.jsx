import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import {
    Wallet,
    AlertTriangle,
    Copy,
    CheckCircle
} from 'reicon-react';

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
            setTimeout(() => setCopied(false), 1800);
        }
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-end gap-1">
                {error && (
                    <span className="text-rose-400 text-[11px] font-medium max-w-xs text-right bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                        {error}
                    </span>
                )}
                <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="btn-cyber text-xs py-2 px-3.5 tracking-wide"
                    title="Connect Web3 Provider (MetaMask)"
                >
                    {isConnecting ? (
                        <>
                            <div className="animate-spin h-3.5 w-3.5 border-2 border-black border-t-transparent rounded-full" />
                            <span>Connecting...</span>
                        </>
                    ) : (
                        <>
                            <Wallet size={16} color="#07090e" weight="Filled" />
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
                <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-2.5 py-1 rounded-md">
                    <AlertTriangle size={14} color="#f59e0b" />
                    <span className="font-medium text-[11px]">Wrong Network</span>
                    <button
                        onClick={switchNetwork}
                        className="ml-1 text-[10px] font-bold bg-amber-500 hover:bg-amber-400 text-obsidian-950 px-2 py-0.5 rounded transition-all shadow-sm"
                    >
                        Switch
                    </button>
                </div>
            )}

            <div className="inline-flex items-center gap-2.5 bg-obsidian-900/90 border border-white/10 hover:border-cyber-400/40 rounded-md px-3 py-1.5 shadow-glass text-xs transition-colors">
                {/* Network indicator dot */}
                <div className="flex items-center gap-1.5 text-slate-400 border-r border-white/10 pr-2.5">
                    <span className="w-2 h-2 rounded-full bg-mint-500 shadow-mint-glow animate-pulse" />
                    <span className="font-mono text-[11px] font-semibold text-slate-300">
                        EVM {chainId ? `#${chainId}` : ''}
                    </span>
                </div>

                {/* Account identifier with copy tooltip */}
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-slate-200 hover:text-cyber-400 transition-colors"
                    title="Click to copy full public key address"
                >
                    <span>{truncateAddress(account)}</span>
                    <span className="text-slate-400">
                        {copied ? (
                            <CheckCircle size={13} color="#00c9a7" />
                        ) : (
                            <Copy size={13} color="#94a3b8" />
                        )}
                    </span>
                </button>

                {/* Disconnect */}
                <button
                    onClick={disconnectWallet}
                    className="text-slate-500 hover:text-rose-400 pl-1.5 transition-colors border-l border-white/10"
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
