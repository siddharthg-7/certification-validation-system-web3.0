import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import FloatingLabelInput from '../components/FloatingLabelInput';
import ConfirmationModal from '../components/ConfirmationModal';
import {
    Award,
    ShieldCheck,
    Activity,
    RotateCcw,
    Search,
    Copy,
    Check,
    FilePlus,
    Layers,
    Download
} from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'authentic' | 'revoked'
    const [copiedHash, setCopiedHash] = useState(null);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: null,
        docHash: null,
        title: '',
        message: '',
        confirmVariant: 'danger',
        confirmText: ''
    });

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
            toast.error('Could not sync with blockchain ledger');
        } finally {
            setIsLoading(false);
        }
    };

    const promptRevoke = (docHash) => {
        setConfirmModal({
            isOpen: true,
            type: 'revoke',
            docHash,
            title: 'Revoke Certificate On-Chain',
            message: 'Are you sure you want to revoke this certificate? This action broadcasts an on-chain status update to the EVM registry, immediately invalidating public verification.',
            confirmVariant: 'danger',
            confirmText: 'Revoke On-Chain'
        });
    };

    const promptUnrevoke = (docHash) => {
        setConfirmModal({
            isOpen: true,
            type: 'unrevoke',
            docHash,
            title: 'Reinstate Certificate On-Chain',
            message: 'Are you sure you want to reinstate this certificate? This will restore its status to Authentic on the blockchain registry.',
            confirmVariant: 'success',
            confirmText: 'Reinstate Credential'
        });
    };

    const handleExecuteConfirm = async () => {
        const { type, docHash } = confirmModal;
        if (!docHash) return;
        setActionLoading(docHash);
        try {
            if (type === 'revoke') {
                await axios.post(`${API_URL}/api/revoke`, { docHash });
                await fetchData();
                toast.success('Certificate marked as REVOKED on blockchain.');
            } else {
                await axios.post(`${API_URL}/api/unrevoke`, { docHash });
                await fetchData();
                toast.success('Certificate reinstated as AUTHENTIC on blockchain.');
            }
            setConfirmModal({ ...confirmModal, isOpen: false });
        } catch (error) {
            console.error('Action error:', error);
            toast.error('Failed: ' + (error.response?.data?.details || error.message));
        } finally {
            setActionLoading(null);
        }
    };

    const exportToCSV = () => {
        if (!transactions || transactions.length === 0) {
            toast.error('No registry transactions available to export.');
            return;
        }
        const headers = ['Document Hash', 'Transaction Hash', 'Status', 'Issuer Address', 'Timestamp UTC', 'IPFS CID'];
        const rows = transactions.map(tx => [
            `"${tx.docHash || ''}"`,
            `"${tx.txHash || ''}"`,
            `"${tx.status || 'authentic'}"`,
            `"${tx.issuer || ''}"`,
            `"${tx.timestamp ? new Date(parseInt(tx.timestamp) * 1000).toISOString() : ''}"`,
            `"${tx.ipfsCID || ''}"`
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `verichain_registry_ledger_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Audited registry ledger exported as CSV!');
    };

    const copyToClipboard = (text, key) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedHash(key);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopiedHash(null), 2000);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(parseInt(timestamp) * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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
        <div className="min-h-screen bg-[#F5F3EB] text-[#102322] flex flex-col font-sans selection:bg-[#B65F3D] selection:text-white">
            <Navbar />

            {/* Page Header */}
            <div className="bg-[#EDEAE0] border-b border-[#D5D0C3] py-8">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs font-mono text-[#53605B] mb-3">
                        <Link to="/" className="hover:text-[#124B40] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-[#124B40] font-semibold">Registry Administration</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-bold text-[#102322] font-serif tracking-tight">
                                Registry Audit Ledger &amp; Management
                            </h1>
                            <p className="text-sm text-[#53605B] mt-1.5 font-normal">
                                Real-time cryptographic ledger monitoring, transaction proof audits, and decentralized credential lifecycle governance.
                            </p>
                        </div>

                        <div className="flex items-center gap-2.5 flex-wrap">
                            <button
                                onClick={exportToCSV}
                                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-[#D5D0C3] hover:border-[#102322] text-[#102322] rounded transition-colors shadow-fine"
                                title="Export Audited Ledger Records to CSV"
                            >
                                <Download size={13} />
                                <span>Export CSV</span>
                            </button>
                            <button
                                onClick={fetchData}
                                disabled={isLoading}
                                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-[#D5D0C3] hover:border-[#102322] text-[#102322] rounded transition-colors shadow-fine"
                                title="Refresh Registry Data from Blockchain"
                            >
                                <RotateCcw size={13} className={isLoading ? 'animate-spin' : ''} />
                                <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
                            </button>
                            <Link
                                to="/issue"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#124B40] hover:bg-[#103D35] text-white rounded transition-colors shadow-sm"
                            >
                                <FilePlus size={14} />
                                <span>Issue Credential</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 py-10">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-8 space-y-8">

                    {/* Metrics Overview Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="bg-white border border-[#D5D0C3] rounded p-6 shadow-fine">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[11px] font-mono font-semibold text-[#53605B] uppercase tracking-wider">
                                        Total Anchored Credentials
                                    </p>
                                    <p className="text-3xl font-bold text-[#102322] mt-1.5 font-serif tracking-tight">
                                        {stats?.totalCertificates ?? transactions.length}
                                    </p>
                                </div>
                                <div className="w-11 h-11 rounded bg-[#FAF5F0] border border-[#E8D4C5] text-[#B65F3D] flex items-center justify-center">
                                    <Award size={22} />
                                </div>
                            </div>
                            <p className="text-xs text-[#53605B] mt-3.5 flex items-center gap-1.5 font-mono">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                <span>Cryptographically anchored on EVM</span>
                            </p>
                        </div>

                        <div className="bg-white border border-[#D5D0C3] rounded p-6 shadow-fine">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[11px] font-mono font-semibold text-[#53605B] uppercase tracking-wider">
                                        Authorized Consortium Issuers
                                    </p>
                                    <p className="text-3xl font-bold text-[#102322] mt-1.5 font-serif tracking-tight">
                                        {stats?.totalIssuers ?? 1}
                                    </p>
                                </div>
                                <div className="w-11 h-11 rounded bg-[#E6EFEB] border border-[#C7DFD9] text-[#124B40] flex items-center justify-center">
                                    <ShieldCheck size={22} />
                                </div>
                            </div>
                            <p className="text-xs text-[#53605B] mt-3.5 flex items-center gap-1.5 font-mono">
                                <span className="w-2 h-2 rounded-full bg-[#124B40] inline-block" />
                                <span>Role-based access control enabled</span>
                            </p>
                        </div>

                        <div className="bg-white border border-[#D5D0C3] rounded p-6 shadow-fine">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[11px] font-mono font-semibold text-[#53605B] uppercase tracking-wider">
                                        Ledger Transactions Mined
                                    </p>
                                    <p className="text-3xl font-bold text-[#102322] mt-1.5 font-serif tracking-tight">
                                        {stats?.totalTransactions ?? transactions.length}
                                    </p>
                                </div>
                                <div className="w-11 h-11 rounded bg-[#EDEAE0] border border-[#D5D0C3] text-[#53605B] flex items-center justify-center">
                                    <Activity size={22} />
                                </div>
                            </div>
                            <p className="text-xs text-[#53605B] mt-3.5 flex items-center gap-1.5 font-mono">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                <span>Consensus: {stats?.network || 'EVM Hardhat Local'}</span>
                            </p>
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="bg-white border border-[#D5D0C3] rounded p-4 shadow-fine">
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
                                <div className="flex bg-[#EDEAE0] p-1 rounded border border-[#D5D0C3] text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter('all')}
                                        className={`px-3 py-1 rounded transition-all font-medium ${
                                            statusFilter === 'all'
                                                ? 'bg-[#124B40] text-white font-bold shadow-sm'
                                                : 'text-[#53605B] hover:text-[#102322]'
                                        }`}
                                    >
                                        All ({transactions.length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter('authentic')}
                                        className={`px-3 py-1 rounded transition-all font-medium ${
                                            statusFilter === 'authentic'
                                                ? 'bg-[#124B40] text-white font-bold shadow-sm'
                                                : 'text-[#53605B] hover:text-[#102322]'
                                        }`}
                                    >
                                        Authentic
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter('revoked')}
                                        className={`px-3 py-1 rounded transition-all font-medium ${
                                            statusFilter === 'revoked'
                                                ? 'bg-[#B65F3D] text-white font-bold shadow-sm'
                                                : 'text-[#53605B] hover:text-[#102322]'
                                        }`}
                                    >
                                        Revoked
                                    </button>
                                </div>

                                <div className="text-xs font-mono text-[#53605B] pl-2">
                                    {filteredTx.length} record(s)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registry Transactions Data Table */}
                    <div className="bg-white border border-[#D5D0C3] rounded shadow-fine overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#D5D0C3] flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-[#102322] font-serif">Audited Credential Registry Entries</h3>
                                <p className="text-xs text-[#53605B]">
                                    Permanent cryptographic anchors recorded on the smart contract registry.
                                </p>
                            </div>
                            <span className="text-[10px] font-mono uppercase bg-[#FAF9F5] border border-[#D5D0C3] px-2.5 py-0.5 rounded text-[#53605B]">
                                Live Synchronized
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-[#FAF9F5] border-b border-[#D5D0C3] text-[#53605B] font-mono uppercase text-[10px]">
                                        <th className="py-3 px-6">Document Hash / TX Hash</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Issuing Authority</th>
                                        <th className="py-3 px-4">Registration Date</th>
                                        <th className="py-3 px-6 text-right">Lifecycle Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#EDEAE0]">
                                    {isLoading ? (
                                        [...Array(4)].map((_, i) => (
                                            <tr key={i}>
                                                <td colSpan={5} className="py-6 px-6 text-center text-xs text-[#53605B] font-mono">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-3.5 h-3.5 border-2 border-[#124B40] border-t-transparent rounded-full animate-spin" />
                                                        <span>Querying blockchain node state...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : filteredTx.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-14 text-center text-[#53605B]">
                                                <div className="flex flex-col items-center justify-center gap-2.5">
                                                    <div className="w-12 h-12 rounded bg-[#FAF9F5] border border-[#D5D0C3] flex items-center justify-center text-[#7B8984]">
                                                        <Layers size={22} />
                                                    </div>
                                                    <p className="text-base font-semibold text-[#102322] font-serif">No registry entries found</p>
                                                    <p className="text-xs text-[#53605B] max-w-sm">
                                                        {searchTerm ? 'No results matched your search query. Try clearing the filter.' : 'No certificates have been issued yet. Issue a credential to record the first blockchain anchor.'}
                                                    </p>
                                                    {searchTerm && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setSearchTerm('')}
                                                            className="text-xs text-[#124B40] font-semibold hover:underline mt-1"
                                                        >
                                                            Clear Search Filter
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTx.map((tx, idx) => (
                                            <tr key={tx.id || idx} className="hover:bg-[#FAF9F5] transition-colors">
                                                {/* Hashes */}
                                                <td className="py-3.5 px-6">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-xs font-semibold text-[#102322]" title={tx.docHash}>
                                                                {tx.docHash ? `${tx.docHash.substring(0, 10)}...${tx.docHash.slice(-8)}` : 'N/A'}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(tx.docHash, `doc-${idx}`)}
                                                                className="text-[#7B8984] hover:text-[#102322]"
                                                                title="Copy full document hash"
                                                            >
                                                                {copiedHash === `doc-${idx}` ? (
                                                                    <Check size={13} className="text-emerald-600" />
                                                                ) : (
                                                                    <Copy size={13} />
                                                                )}
                                                            </button>
                                                        </div>
                                                        {tx.txHash && (
                                                            <p className="font-mono text-[11px] text-[#7B8984]" title={tx.txHash}>
                                                                tx: {tx.txHash.substring(0, 8)}...{tx.txHash.slice(-6)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td className="py-3.5 px-4">
                                                    {tx.status === 'revoked' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#FAF5F0] border border-[#E8D4C5] text-[#B65F3D]">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#B65F3D]" />
                                                            REVOKED
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#F0FDF4] border border-[#86EFAC] text-[#15803D]">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                            AUTHENTIC
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Issuer */}
                                                <td className="py-3.5 px-4">
                                                    <span className="font-mono text-xs text-[#53605B]" title={tx.issuer}>
                                                        {tx.issuer ? `${tx.issuer.substring(0, 6)}...${tx.issuer.slice(-4)}` : 'N/A'}
                                                    </span>
                                                </td>

                                                {/* Date */}
                                                <td className="py-3.5 px-4">
                                                    <span className="text-xs text-[#53605B] font-mono">
                                                        {formatDate(tx.timestamp)}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3.5 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            to={`/verify?hash=${encodeURIComponent(tx.docHash)}`}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-white border border-[#D5D0C3] hover:border-[#102322] text-[#102322] hover:text-[#124B40] transition-colors shadow-fine"
                                                            title="Audit certificate on verification portal"
                                                        >
                                                            <ShieldCheck size={12} className="text-[#124B40]" />
                                                            <span>Audit</span>
                                                        </Link>

                                                        {tx.status === 'revoked' ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => promptUnrevoke(tx.docHash)}
                                                                disabled={actionLoading === tx.docHash}
                                                                className="px-2.5 py-1 text-xs font-semibold rounded bg-[#F0FDF4] border border-[#86EFAC] text-[#15803D] hover:bg-[#DCFCE7] transition-colors cursor-pointer"
                                                            >
                                                                {actionLoading === tx.docHash ? 'Processing...' : 'Re-instate'}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => promptRevoke(tx.docHash)}
                                                                disabled={actionLoading === tx.docHash}
                                                                className="px-2.5 py-1 text-xs font-semibold rounded bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                                                            >
                                                                {actionLoading === tx.docHash ? 'Processing...' : 'Revoke'}
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

            {/* Custom Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={handleExecuteConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                confirmVariant={confirmModal.confirmVariant}
                isLoading={actionLoading === confirmModal.docHash}
                details={{ docHash: confirmModal.docHash }}
            />
        </div>
    );
};

export default Dashboard;
