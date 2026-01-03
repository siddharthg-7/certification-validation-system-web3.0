import React from 'react';
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

    const truncateAddress = (address) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-end gap-2">
                {error && (
                    <div className="text-red-400 text-sm mb-2 max-w-xs text-right">
                        {error}
                    </div>
                )}
                <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="btn-primary flex items-center gap-2"
                >
                    {isConnecting ? (
                        <>
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            Connecting...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            Connect Wallet
                        </>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-end gap-2">
            {!isCorrectNetwork && (
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-yellow-500 text-sm">Wrong Network</span>
                    <button
                        onClick={switchNetwork}
                        className="ml-2 text-xs bg-yellow-500 hover:bg-yellow-600 text-dark-900 px-3 py-1 rounded-md transition-colors"
                    >
                        Switch
                    </button>
                </div>
            )}

            <div className="flex items-center gap-3 card px-4 py-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-400">Chain {chainId}</span>
                </div>

                <div className="h-4 w-px bg-dark-700"></div>

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                            {account ? account.substring(2, 4).toUpperCase() : ''}
                        </span>
                    </div>
                    <span className="font-mono text-sm text-gray-300">
                        {truncateAddress(account)}
                    </span>
                </div>

                <button
                    onClick={disconnectWallet}
                    className="ml-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Disconnect"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default WalletConnect;
