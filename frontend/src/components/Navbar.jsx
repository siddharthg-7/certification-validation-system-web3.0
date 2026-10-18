import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import WalletConnect from './WalletConnect';
import {
    ShieldCheck,
    AwardCertificate,
    Activity,
    Verify,
    DocumentUpload
} from 'reicon-react';

const Navbar = () => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <header className="sticky top-0 z-40 bg-obsidian-950/85 backdrop-blur-xl border-b border-white/10 shadow-glass">
            {/* Telemetry / Live Network Banner */}
            <div className="bg-obsidian-900/90 text-slate-400 text-[11px] py-1.5 px-4 sm:px-8 border-b border-white/5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-400 shadow-cyber-sm"></span>
                        </span>
                        <span className="font-semibold tracking-wider text-slate-200 uppercase font-mono text-[10.5px]">
                            Consensus Ledger Active
                        </span>
                        <span className="hidden sm:inline text-slate-600">•</span>
                        <span className="hidden sm:inline text-slate-400 font-mono text-[10.5px]">
                            EVM Smart Contract • IPFS Cryptographic Archival
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400">
                        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                            <Activity size={12} color="#00f2fe" />
                            <span>142ms ZK-Proof Latency</span>
                        </span>
                        <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-slate-300 border border-white/10">
                            v3.0.0-PRO
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
                {/* Brand Identity */}
                <Link to="/" className="flex items-center gap-3 group select-none">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-obsidian-850 to-obsidian-900 border border-cyber-400/30 flex items-center justify-center text-cyber-400 shadow-cyber-sm group-hover:border-cyber-400 group-hover:shadow-cyber transition-all duration-300 flex-shrink-0">
                        <ShieldCheck size={22} color="#00f2fe" weight="Outline" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-extrabold tracking-tight text-white font-display">
                                Veri<span className="text-cyber-400">Chain</span>
                            </span>
                            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-cyber-400/10 text-cyber-400 px-1.5 py-0.5 rounded border border-cyber-400/25">
                                Enterprise
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5 tracking-normal">
                            Decentralized Credential Infrastructure
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-1.5 text-sm">
                    <Link
                        to="/"
                        className={isActive('/') && location.pathname === '/' ? 'nav-link-active' : 'nav-link'}
                    >
                        <Activity size={16} />
                        <span>Overview</span>
                    </Link>
                    <Link
                        to="/dashboard"
                        className={isActive('/dashboard') ? 'nav-link-active' : 'nav-link'}
                    >
                        <AwardCertificate size={16} />
                        <span>Registry Ledger</span>
                    </Link>
                    <Link
                        to="/issue"
                        className={isActive('/issue') ? 'nav-link-active' : 'nav-link'}
                    >
                        <DocumentUpload size={16} />
                        <span>Issue Credential</span>
                    </Link>
                    <Link
                        to="/verify"
                        className={isActive('/verify') ? 'nav-link-active' : 'nav-link'}
                    >
                        <Verify size={16} />
                        <span>Verify Credential</span>
                    </Link>
                </nav>

                {/* Right Action: Wallet Connect & Mobile Menu Button */}
                <div className="flex items-center gap-2.5">
                    <WalletConnect />

                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-md bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Toggle navigation menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-white/10 bg-obsidian-950/95 backdrop-blur-2xl px-4 py-3 space-y-1 shadow-modal">
                    <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                            isActive('/') && location.pathname === '/' ? 'text-cyber-400 bg-cyber-400/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Activity size={18} />
                        <span>Overview</span>
                    </Link>
                    <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                            isActive('/dashboard') ? 'text-cyber-400 bg-cyber-400/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <AwardCertificate size={18} />
                        <span>Registry Ledger</span>
                    </Link>
                    <Link
                        to="/issue"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                            isActive('/issue') ? 'text-cyber-400 bg-cyber-400/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <DocumentUpload size={18} />
                        <span>Issue Credential</span>
                    </Link>
                    <Link
                        to="/verify"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                            isActive('/verify') ? 'text-cyber-400 bg-cyber-400/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Verify size={18} />
                        <span>Verify Credential</span>
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
