import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FloatingLabelInput from '../components/FloatingLabelInput';
import {
    AwardCertificate,
    ShieldCheck,
    Activity,
    Refresh,
    Search,
    Copy,
    TickCircle,
    DocumentUpload,
    Scan
} from 'reicon-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'authentic' | 'revoked'
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
        if (!window.confirm(`Are you sure you want to revoke certificate ${docHash}? This action broadcasts an on-chain status update to the EVM registry.`)) {
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
        if (!window.confirm(`Re-instate certificate ${docHash}? This will restore its authentic status.`)) return;
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
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedHash(id);
        setTimeout(() => setCopiedHash(null), 1800);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const filteredTx = transactions.filter(tx => {
        const matchesSearch = 
            (tx.docHash && tx.docHash.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (tx.issuer && tx.issuer.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (tx.txHash && tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        if (statusFilter === 'revoked') return tx.status === 'revoked';
        if (statusFilter === 'authentic') return tx.status !== 'revoked';
        return true;
    });

    return (
        <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans selection:bg-cyber-400 selection:text-obsidian-950">
            <Navbar />

            {/* Page Header */}
            <div className="bg-obsidian-900/80 border-b border-white/10 py-8 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-3">
                        <Link to="/" className="hover:text-cyber-400 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-cyber-400 font-medium">Registry Administration</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
                                Registry Audit Ledger &amp; Management
                            </h1>
                            <p className="text-sm text-slate-400 mt-1.5 font-light">
                                Real-time cryptographic ledger monitoring, transaction proof audits, and decentralized credential lifecycle governance.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchData}
                                disabled={isLoading}
                                className="btn-secondary text-xs px-4 py-2.5 flex items-center gap-2 font-medium"
                                title="Refresh Registry Data from Blockchain"
                            >
                                <Refresh size={14} className={isLoading ? 'animate-spin' : ''} />
                                <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
                            </button>
                            <Link to="/issue" className="btn-cyber text-xs px-4 py-2.5 flex items-center gap-2 font-semibold">
                                <DocumentUpload size={14} color="#07090e" weight="Filled" />
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
                        <div className="glass-card hover:border-cyber-400/40 transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                                        Total Anchored Credentials
                                    </p>
                                    <p className="text-3xl font-extrabold text-white mt-1.5 font-display tracking-tight">
                                        {stats?.totalCertificates ?? transactions.length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-cyber-400/10 border border-cyber-400/30 flex items-center justify-center text-cyber-400 shadow-cyber-sm">
                                    <AwardCertificate size={24} color="#00f2fe" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-3.5 flex items-center gap-2 font-mono">
                                <span className="w-2 h-2 rounded-full bg-mint-500 shadow-mint-glow animate-pulse" />
                                <span>Cryptographically anchored on EVM</span>
                            </p>
                        </div>

                        <div className="glass-card hover:border-mint-400/40 transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                                        Authorized Consortium Issuers
                                    </p>
                                    <p className="text-3xl font-extrabold text-white mt-1.5 font-display tracking-tight">
                                        {stats?.totalIssuers ?? 1}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-mint-500/10 border border-mint-500/30 flex items-center justify-center text-mint-400 shadow-mint-glow">
                                    <ShieldCheck size={24} color="#00c9a7" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-3.5 flex items-center gap-2 font-mono">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-cyber-sm" />
                                <span>Role-based access control enabled</span>
                            </p>
                        </div>

                        <div className="glass-card hover:border-indigo-400/40 transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                                        Ledger Transactions Mined
                                    </p>
                                    <p className="text-3xl font-extrabold text-white mt-1.5 font-display tracking-tight">
                                        {stats?.totalTransactions ?? transactions.length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-indigo-glow">
                                    <Activity size={24} color="#818cf8" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 mt-3.5 flex items-center gap-2 font-mono">
                                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                                <span>Consensus: {stats?.network || 'EVM Hardhat Local'}</span>
                            </p>
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="glass-card p-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            {/* Search Input */}
                            <div className="w-full md:max-w-md">
                                <FloatingLabelInput
                                    label=""
                                    placeholder="Search by Document Hash, Issuer Address, or TX..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    id="searchTransactions"
                                    icon={Search}
                                />
                            </div>

                            {/* Status Filter Pills */}
                            <div className="flex items-center gap-2 self-start md:self-center">
                                <div className="flex bg-obsidian-900 p-1 rounded-lg border border-white/10 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter('all')}
                                        className={`px-3 py-1 rounded-md transition-all font-medium ${
                                            statusFilter === 'all'
                                                ? 'bg-cyber-400 text-obsidian-950 font-bold shadow-cyber-sm'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        All ({transactions.length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter('authentic')}
                                        className={`px-3 py-1 rounded-md transition-all font-medium ${
                                            statusFilter === 'authentic'
                                                ? 'bg-mint-500 text-obsidian-950 font-bold shadow-mint-glow'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        Authentic
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter('revoked')}
                                        className={`px-3 py-1 rounded-md transition-all font-medium ${
                                            statusFilter === 'revoked'
                                                ? 'bg-amber-500 text-obsidian-950 font-bold'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        Revoked
                                    </button>
                                </div>

                                <div className="text-xs font-mono text-slate-400 pl-2">
                                    {filteredTx.length} record(s)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registry Transactions Data Table */}
                    <div className="glass-card p-0 overflow-hidden">
                        <div className="card-header px-6 pt-5 pb-4 mb-0">
                            <div>
                                <h3 className="card-title">Audited Credential Registry Entries</h3>
                                <p className="card-subtitle">
                                    Permanent cryptographic anchors recorded on the smart contract registry.
                                </p>
                            </div>
                            <span className="badge-neutral text-xs font-mono">
                                Live Synchronized
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
                                                <td colSpan={5} className="py-6 px-6 text-center text-xs text-slate-400 font-mono">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-3.5 h-3.5 border-2 border-cyber-400 border-t-transparent rounded-full animate-spin" />
                                                        <span>Querying blockchain node state...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : filteredTx.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-14 text-center text-slate-400">
                                                <div className="flex flex-col items-center justify-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                                                        <Scan size={24} />
                                                    </div>
                                                    <p className="text-base font-semibold text-white font-display">No registry entries found</p>
                                                    <p className="text-xs text-slate-400 max-w-sm font-light">
                                                        {searchTerm ? 'No results matched your search query. Try clearing the filter.' : 'No certificates have been issued yet. Issue a credential to record the first blockchain anchor.'}
                                                    </p>
                                                    {searchTerm && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setSearchTerm('')}
                                                            className="btn-ghost text-xs px-3 py-1.5 text-cyber-400"
                                                        >
                                                            Clear Search Filter
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTx.map((tx, idx) => (
                                            <tr key={tx.id || idx}>
                                                {/* Hashes */}
                                                <td>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-xs font-semibold text-white" title={tx.docHash}>
                                                                {tx.docHash ? `${tx.docHash.substring(0, 10)}...${tx.docHash.slice(-8)}` : 'N/A'}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(tx.docHash, `doc-${idx}`)}
                                                                className="text-slate-400 hover:text-cyber-400 transition-colors"
                                                                title="Copy full document hash"
                                                            >
                                                                {copiedHash === `doc-${idx}` ? (
                                                                    <TickCircle size={13} color="#00c9a7" />
                                                                ) : (
                                                                    <Copy size={13} />
                                                                )}
                                                            </button>
                                                        </div>
                                                        {tx.txHash && (
                                                            <p className="font-mono text-[11px] text-slate-400" title={tx.txHash}>
                                                                tx: {tx.txHash.substring(0, 8)}...{tx.txHash.slice(-6)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td>
                                                    {tx.status === 'revoked' ? (
                                                        <span className="badge-revoked text-[11px] font-mono">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                            REVOKED
                                                        </span>
                                                    ) : (
                                                        <span className="badge-valid text-[11px] font-mono">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-mint-400 animate-pulse" />
                                                            AUTHENTIC
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Issuer */}
                                                <td>
                                                    <span className="font-mono text-xs text-slate-300" title={tx.issuer}>
                                                        {tx.issuer ? `${tx.issuer.substring(0, 6)}...${tx.issuer.slice(-4)}` : 'N/A'}
                                                    </span>
                                                </td>

                                                {/* Date */}
                                                <td>
                                                    <span className="text-xs text-slate-300 font-mono">
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
