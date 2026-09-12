import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FloatingLabelInput from '../components/FloatingLabelInput';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedHash, setCopiedHash] = useState(null);

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
            setTransactions(txRes.data.transactions || []);
            setStats(statsRes.data.stats || null);
        } catch (error) {
            console.error('Error fetching registry data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevoke = async (docHash) => {
        if (!window.confirm(`Are you sure you want to revoke certificate ${docHash}? This action broadcasts an on-chain status update.`)) {
            return;
        }
        setActionLoading(docHash);
        try {
            await axios.post(`${API_URL}/api/revoke`, { docHash });
            await fetchData();
            alert('Certificate successfully marked as REVOKED on the blockchain.');
        } catch (error) {
            console.error('Revocation error:', error);
            alert('Failed to revoke certificate: ' + (error.response?.data?.details || error.message));
        } finally {
            setActionLoading(null);
        }
    };

    const handleUnrevoke = async (docHash) => {
        if (!window.confirm(`Re-instate certificate ${docHash}?`)) return;
        setActionLoading(docHash);
        try {
            await axios.post(`${API_URL}/api/unrevoke`, { docHash });
            await fetchData();
            alert('Certificate status re-instated successfully.');
        } catch (error) {
            console.error('Unrevocation error:', error);
            alert('Failed to re-instate certificate: ' + (error.response?.data?.details || error.message));
        } finally {
            setActionLoading(null);
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedHash(id);
        setTimeout(() => setCopiedHash(null), 1500);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const filteredTx = transactions.filter(tx =>
        (tx.docHash && tx.docHash.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tx.issuer && tx.issuer.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            {/* Page Header */}
            <div className="bg-white border-b border-slate-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <Link to="/" className="hover:text-slate-800">Home</Link>
                        <span>/</span>
                        <span className="text-slate-800 font-medium">Registry Administration</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                Registry Audit Ledger &amp; Management
                            </h1>
                            <p className="text-sm text-slate-600 mt-1">
                                Monitor verified credentials, audit blockchain transactions, and manage certificate status.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchData}
                                disabled={isLoading}
                                className="btn-secondary text-xs px-3.5 py-2.5"
                                title="Refresh Registry Data"
                            >
                                <svg className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Refresh</span>
                            </button>
                            <Link to="/issue" className="btn-primary text-xs px-4 py-2.5">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Issue Credential</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">

                    {/* Metrics Overview Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Total Registered Certificates
                                    </p>
                                    <p className="text-3xl font-extrabold text-slate-900 mt-1">
                                        {stats?.totalCertificates ?? transactions.length}
                                    </p>
                                </div>
                                <div className="w-11 h-11 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Cryptographically anchored on EVM
                            </p>
                        </div>

                        <div className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Authorized Issuers
                                    </p>
                                    <p className="text-3xl font-extrabold text-slate-900 mt-1">
                                        {stats?.totalIssuers ?? 1}
                                    </p>
                                </div>
                                <div className="w-11 h-11 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Role-based access control enabled
                            </p>
                        </div>

                        <div className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Blockchain Transactions
                                    </p>
                                    <p className="text-3xl font-extrabold text-slate-900 mt-1">
                                        {stats?.totalTransactions ?? transactions.length}
                                    </p>
                                </div>
                                <div className="w-11 h-11 rounded-md bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-800">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                Network: {stats?.network || 'EVM Localhost'}
                            </p>
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="card p-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="w-full sm:max-w-md">
                                <FloatingLabelInput
                                    label=""
                                    placeholder="Search by Document Hash or Issuer Address..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    id="searchTransactions"
                                />
                            </div>
                            <div className="text-xs text-slate-500 self-end sm:self-center font-medium">
                                Showing {filteredTx.length} of {transactions.length} record(s)
                            </div>
                        </div>
                    </div>

                    {/* Registry Transactions Data Table */}
                    <div className="card p-0 overflow-hidden">
                        <div className="card-header px-6 pt-5 pb-4 mb-0">
                            <div>
                                <h3 className="card-title">Audited Credential Registry Entries</h3>
                                <p className="card-subtitle">
                                    Permanent cryptographic anchors recorded on the smart contract registry.
                                </p>
                            </div>
                            <span className="badge-neutral text-xs">
                                {filteredTx.length} records found
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="table-formal">
                                <thead>
                                    <tr>
                                        <th>Document Hash / TX Hash</th>
                                        <th>Status</th>
                                        <th>Issuing Authority</th>
                                        <th>Registration Date</th>
                                        <th className="text-right">Administration Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        [...Array(4)].map((_, i) => (
                                            <tr key={i}>
                                                <td colSpan={5} className="py-4 px-6 text-center text-xs text-slate-400">
                                                    Loading registry entries from blockchain...
                                                </td>
                                            </tr>
                                        ))
                                    ) : filteredTx.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-slate-500">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <p className="text-sm font-medium text-slate-700">No registry entries found</p>
                                                    <p className="text-xs text-slate-500">
                                                        {searchTerm ? 'Try adjusting your search criteria.' : 'Issue a credential to view it on the audit ledger.'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTx.map((tx, idx) => (
                                            <tr key={tx.id || idx}>
                                                {/* Hashes */}
                                                <td>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-mono text-xs font-semibold text-slate-900" title={tx.docHash}>
                                                                {tx.docHash ? `${tx.docHash.substring(0, 10)}...${tx.docHash.slice(-8)}` : 'N/A'}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(tx.docHash, `doc-${idx}`)}
                                                                className="text-[10px] text-slate-400 hover:text-slate-700"
                                                                title="Copy full document hash"
                                                            >
                                                                {copiedHash === `doc-${idx}` ? '✓' : '⧉'}
                                                            </button>
                                                        </div>
                                                        {tx.txHash && (
                                                            <p className="font-mono text-[11px] text-slate-500" title={tx.txHash}>
                                                                tx: {tx.txHash.substring(0, 8)}...{tx.txHash.slice(-6)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td>
                                                    {tx.status === 'revoked' ? (
                                                        <span className="badge-revoked text-[11px]">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                            REVOKED
                                                        </span>
                                                    ) : (
                                                        <span className="badge-valid text-[11px]">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                            AUTHENTIC
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Issuer */}
                                                <td>
                                                    <span className="font-mono text-xs text-slate-700" title={tx.issuer}>
                                                        {tx.issuer ? `${tx.issuer.substring(0, 6)}...${tx.issuer.slice(-4)}` : 'N/A'}
                                                    </span>
                                                </td>

                                                {/* Date */}
                                                <td>
                                                    <span className="text-xs text-slate-600">
                                                        {formatDate(tx.timestamp)}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {tx.status === 'revoked' ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUnrevoke(tx.docHash)}
                                                                disabled={actionLoading === tx.docHash}
                                                                className="btn-success"
                                                            >
                                                                {actionLoading === tx.docHash ? 'Processing...' : 'Re-instate'}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRevoke(tx.docHash)}
                                                                disabled={actionLoading === tx.docHash}
                                                                className="btn-danger"
                                                            >
                                                                {actionLoading === tx.docHash ? 'Processing...' : 'Revoke Credential'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;
