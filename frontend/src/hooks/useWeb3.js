import { useState, useEffect, createContext, useContext } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export const useWeb3 = () => {
    const context = useContext(Web3Context);
    if (!context) {
        throw new Error('useWeb3 must be used within Web3Provider');
    }
    return context;
};

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);

    const expectedChainId = parseInt(process.env.REACT_APP_CHAIN_ID || '31337');

    // Check if MetaMask is installed
    const isMetaMaskInstalled = () => {
        return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
    };

    // Connect to MetaMask
    const connectWallet = async () => {
        if (!isMetaMaskInstalled()) {
            setError('Please install MetaMask to use this application');
            window.open('https://metamask.io/download/', '_blank');
            return;
        }

        setIsConnecting(true);
        setError(null);

        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            // Create provider and signer
            const web3Provider = new ethers.BrowserProvider(window.ethereum);
            const web3Signer = await web3Provider.getSigner();
            const network = await web3Provider.getNetwork();

            setProvider(web3Provider);
            setSigner(web3Signer);
            setAccount(accounts[0]);
            setChainId(Number(network.chainId));

            console.log('✅ Wallet connected:', accounts[0]);
            console.log('🌐 Network:', network.chainId.toString());

            // Check if on correct network
            if (Number(network.chainId) !== expectedChainId) {
                setError(`Please switch to ${process.env.REACT_APP_NETWORK_NAME || 'Hardhat Local'} network`);
            }

        } catch (err) {
            console.error('Wallet connection error:', err);
            setError(err.message || 'Failed to connect wallet');
        } finally {
            setIsConnecting(false);
        }
    };

    // Disconnect wallet
    const disconnectWallet = () => {
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setChainId(null);
        setError(null);
        console.log('👋 Wallet disconnected');
    };

    // Switch network
    const switchNetwork = async () => {
        if (!isMetaMaskInstalled()) return;

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${expectedChainId.toString(16)}` }],
            });
        } catch (err) {
            // This error code indicates that the chain has not been added to MetaMask
            if (err.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: `0x${expectedChainId.toString(16)}`,
                            chainName: process.env.REACT_APP_NETWORK_NAME || 'Hardhat Local',
                            rpcUrls: ['http://127.0.0.1:8545'],
                        }],
                    });
                } catch (addError) {
                    console.error('Error adding network:', addError);
                }
            } else {
                console.error('Error switching network:', err);
            }
        }
    };

    // Listen for account changes
    useEffect(() => {
        if (!isMetaMaskInstalled()) return;

        const handleAccountsChanged = (accounts) => {
            if (accounts.length === 0) {
                disconnectWallet();
            } else if (accounts[0] !== account) {
                setAccount(accounts[0]);
                console.log('🔄 Account changed:', accounts[0]);
            }
        };

        const handleChainChanged = (chainIdHex) => {
            const newChainId = parseInt(chainIdHex, 16);
            setChainId(newChainId);
            console.log('🔄 Chain changed:', newChainId);

            if (newChainId !== expectedChainId) {
                setError(`Please switch to ${process.env.REACT_APP_NETWORK_NAME || 'Hardhat Local'} network`);
            } else {
                setError(null);
            }

            // Reload to reset state
            window.location.reload();
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
            if (window.ethereum.removeListener) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [account, expectedChainId]);

    // Auto-connect if previously connected
    useEffect(() => {
        const autoConnect = async () => {
            if (isMetaMaskInstalled() && localStorage.getItem('walletConnected') === 'true') {
                await connectWallet();
            }
        };
        autoConnect();
    }, []);

    // Save connection state
    useEffect(() => {
        if (account) {
            localStorage.setItem('walletConnected', 'true');
        } else {
            localStorage.removeItem('walletConnected');
        }
    }, [account]);

    const value = {
        account,
        provider,
        signer,
        chainId,
        isConnecting,
        error,
        isConnected: !!account,
        isCorrectNetwork: chainId === expectedChainId,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        isMetaMaskInstalled: isMetaMaskInstalled()
    };

    return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
