import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useWeb3 } from '../hooks/useWeb3';
import WalletConnect from '../components/WalletConnect';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard = () => {
    useWeb3(); // Keep context active for wallet display
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [txRes, statsRes] = await Promise.all([
                axios.get(`${API_URL}/api/transactions`),
                axios.get(`${API_URL}/api/stats`)
            ]);
            setTransactions(txRes.data.transactions);
            setStats(statsRes.data.stats);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevoke = async (docHash) => {
        if (!window.confirm('Are you sure you want to revoke this certificate? This will be recorded on the blockchain.')) return;

        setActionLoading(docHash);
        try {
            await axios.post(`${API_URL}/api/revoke`, { docHash });
            await fetchData();
            alert('Certificate revoked successfully');
        } catch (error) {
            console.error('Revocation error:', error);
            alert('Failed to revoke: ' + (error.response?.data?.details || error.message));
        } finally {
            setActionLoading(null);
        }
    };

    const handleUnrevoke = async (docHash) => {
        setActionLoading(docHash);
        try {
            await axios.post(`${API_URL}/api/unrevoke`, { docHash });
            await fetchData();
            alert('Certificate unrevoked successfully');
        } catch (error) {
            console.error('Unrevocation error:', error);
            alert('Failed to unrevoke: ' + (error.response?.data?.details || error.message));
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-dark-950">
            {/* Header */}
            <header className="border-b border-dark-800 glass sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold gradient-text">CertiChain</h1>
                    </Link>
                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                            <Link to="/issue" className="text-gray-400 hover:text-white transition-colors">Issue</Link>
                            <Link to="/verify" className="text-gray-400 hover:text-white transition-colors">Verify</Link>
                        </nav>
                        <WalletConnect />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-4xl font-bold mb-2">System Dashboard</h2>
                        <p className="text-gray-400 font-medium">Manage and monitor all issued certificates</p>
                    </div>
                    <Link to="/issue" className="btn-primary flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Issue New Certificate
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="card bg-gradient-to-br from-primary-500/10 to-transparent border-primary-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span className="text-primary-500 font-bold text-2xl">{stats?.totalCertificates || 0}</span>
                        </div>
                        <h3 className="text-gray-400 font-semibold uppercase tracking-wider text-xs">Total Certificates</h3>
                    </div>

                    <div className="card bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span className="text-green-500 font-bold text-2xl">{stats?.totalIssuers || 0}</span>
                        </div>
                        <h3 className="text-gray-400 font-semibold uppercase tracking-wider text-xs">Active Issuers</h3>
                    </div>

                    <div className="card bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-purple-500 font-bold text-2xl">{stats?.totalTransactions || 0}</span>
                        </div>
                        <h3 className="text-gray-400 font-semibold uppercase tracking-wider text-xs">Blockchain TXs</h3>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="card overflow-hidden">
                    <div className="p-6 border-b border-dark-800 flex justify-between items-center">
                        <h3 className="text-xl font-bold">Recent Issuances</h3>
                        <button onClick={fetchData} className="text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-2">
                            <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-dark-800/50 text-gray-400 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4">Certificate Hash</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Issuer</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            <div className="animate-pulse flex flex-col items-center">
                                                <div className="h-4 w-64 bg-dark-800 rounded mb-4"></div>
                                                <div className="h-4 w-48 bg-dark-800 rounded"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No certificates issued yet.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-dark-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-mono text-xs text-primary-400 truncate w-32" title={tx.docHash}>
                                                        {tx.docHash}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 truncate w-32" title={tx.txHash}>
                                                        TX: {tx.txHash}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${tx.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs text-gray-400" title={tx.issuer}>
                                                    {tx.issuer.substring(0, 6)}...{tx.issuer.substring(tx.issuer.length - 4)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-400">
                                                {formatDate(tx.timestamp)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleRevoke(tx.docHash)}
                                                        disabled={actionLoading === tx.docHash}
                                                        className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                                                    >
                                                        {actionLoading === tx.docHash ? 'Wait...' : 'Revoke'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleUnrevoke(tx.docHash)}
                                                        disabled={actionLoading === tx.docHash}
                                                        className="text-xs font-bold text-green-500 hover:text-green-400 transition-colors disabled:opacity-50"
                                                    >
                                                        Unrevoke
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
