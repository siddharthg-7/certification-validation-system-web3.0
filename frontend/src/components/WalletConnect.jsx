import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import {
    AlertTriangle,
    Copy,
    Check,
    Wallet,
    LogOut
} from 'lucide-react';

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
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isConnected) {
        return (
            <div className="flex items-center gap-2">
                {error && (
                    <span className="hidden sm:inline-block text-rose-700 text-xs bg-rose-50 border border-rose-200 px-2 py-1 rounded">
                        {error}
                    </span>
                )}
                <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-forest-800 hover:bg-forest-900 text-white rounded transition-colors shadow-sm"
                    title="Connect MetaMask Wallet"
                >
                    <Wallet size={14} />
                    <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {!isCorrectNetwork && (
                <div className="inline-flex items-center gap-1.5 bg-[#FDF2EC] border border-[#E9C3B2] text-[#B65F3D] text-xs px-2.5 py-1 rounded">
                    <AlertTriangle size={13} className="text-[#B65F3D]" />
                    <span className="font-medium text-[11px]">Wrong Network</span>
                    <button
                        onClick={switchNetwork}
                        className="ml-1 text-[11px] font-semibold bg-[#B65F3D] hover:bg-[#9F5131] text-white px-2 py-0.5 rounded transition-colors"
                    >
                        Switch
                    </button>
                </div>
            )}

            <div className="inline-flex items-center bg-white border border-rule rounded text-xs px-2.5 py-1 text-ink-900 shadow-fine">
                {/* Network label with indicator */}
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold pr-2.5 border-r border-rule">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-ink-700">
                        EVM {chainId ? `#${chainId === 31337 ? '1' : chainId}` : '#1'}
                    </span>
                </div>

                {/* Account identifier with copy button */}
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 pl-2.5 font-mono text-[11px] font-semibold text-ink-900 hover:text-forest-800 transition-colors"
                    title="Click to copy public address"
                >
                    <span>{truncateAddress(account)}</span>
                    <span className="text-ink-500">
                        {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    </span>
                </button>

                {/* Disconnect button */}
                <button
                    onClick={disconnectWallet}
                    className="text-ink-400 hover:text-rose-600 pl-2 ml-1 border-l border-rule transition-colors"
                    title="Disconnect Wallet"
                >
                    <LogOut size={12} />
                </button>
            </div>
        </div>
    );
};

export default WalletConnect;
