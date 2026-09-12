import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import WalletConnect from './WalletConnect';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
            {/* Institutional Top Identity Strip */}
            <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 sm:px-8 border-b border-slate-800">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="font-semibold tracking-wide text-slate-200 uppercase">
                            Decentralized Credential Registry System
                        </span>
                        <span className="hidden sm:inline text-slate-500">|</span>
                        <span className="hidden sm:inline text-slate-400">
                            EVM Smart Contract Consensus • IPFS Distributed Archival
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                        <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                            v3.0.0
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
                {/* Brand Identity */}
                <Link to="/" className="flex items-center gap-3 group select-none">
                    <div className="w-9 h-9 rounded-md bg-slate-900 flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:bg-blue-900 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-base font-bold text-slate-900 tracking-tight">
                                CertiChain
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                                Institutional
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                            National Credential Validation Infrastructure
                        </p>
                    </div>
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-1 text-sm">
                    <Link
                        to="/"
                        className={isActive('/') && location.pathname === '/' ? 'nav-link-active' : 'nav-link'}
                    >
                        Overview
                    </Link>
                    <Link
                        to="/dashboard"
                        className={isActive('/dashboard') ? 'nav-link-active' : 'nav-link'}
                    >
                        Registry Dashboard
                    </Link>
                    <Link
                        to="/issue"
                        className={isActive('/issue') ? 'nav-link-active' : 'nav-link'}
                    >
                        Issue Credential
                    </Link>
                    <Link
                        to="/verify"
                        className={isActive('/verify') ? 'nav-link-active' : 'nav-link'}
                    >
                        Verify Credential
                    </Link>
                </nav>

                {/* Right Action: Wallet Connect */}
                <div className="flex items-center gap-3">
                    <WalletConnect />
                </div>
            </div>
        </header>
    );
};

export default Navbar;
