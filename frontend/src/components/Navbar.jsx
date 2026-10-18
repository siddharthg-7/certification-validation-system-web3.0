import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import StatusBar from './StatusBar';
import WalletConnect from './WalletConnect';
import {
    Home,
    Layers,
    FileText,
    ShieldCheck,
    Menu,
    X
} from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <header className="sticky top-0 z-50 bg-[#F5F3EB] border-b border-[#D5D0C3]">
            {/* Top System Status Bar */}
            <StatusBar />

            {/* Main Header Container */}
            <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
                <div className="flex items-center justify-between h-[64px]">
                    {/* Left: Brand Identity */}
                    <Link to="/" className="flex items-center gap-3 group select-none">
                        {/* Geometric Blockchain Hexagon / Cube Logo */}
                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" stroke="#102322" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
                                <line x1="20" y1="20" x2="20" y2="2" stroke="#102322" strokeWidth="1.8" strokeLinecap="round" />
                                <line x1="20" y1="20" x2="36" y2="29" stroke="#102322" strokeWidth="1.8" strokeLinecap="round" />
                                <line x1="20" y1="20" x2="4" y2="29" stroke="#102322" strokeWidth="1.8" strokeLinecap="round" />
                                <line x1="20" y1="11" x2="28" y2="15.5" stroke="#B65F3D" strokeWidth="1.2" />
                                <line x1="20" y1="11" x2="12" y2="15.5" stroke="#B65F3D" strokeWidth="1.2" />
                                <line x1="20" y1="20" x2="20" y2="29" stroke="#124B40" strokeWidth="1.2" />
                            </svg>
                        </div>

                        <div>
                            <div className="flex items-baseline gap-1.5 leading-none">
                                <span className="text-[17px] font-bold text-[#102322] font-sans tracking-tight">
                                    VeriChain
                                </span>
                                <span className="text-[9px] font-mono font-semibold uppercase tracking-[0.16em] text-[#B65F3D]">
                                    ENTERPRISE
                                </span>
                            </div>
                            <p className="text-[10px] text-[#53605B] font-normal leading-tight mt-1">
                                Decentralized Credential Infrastructure
                            </p>
                        </div>
                    </Link>

                    {/* Center: Desktop Navigation Links with active bottom line indicator flush to border */}
                    <nav className="hidden lg:flex items-center h-full">
                        <Link
                            to="/"
                            className={`inline-flex items-center gap-2 h-full px-4 text-[13px] font-medium transition-colors relative -mb-[1px] ${
                                isActive('/')
                                    ? 'text-[#124B40] font-semibold border-b-[2.5px] border-[#124B40]'
                                    : 'text-[#53605B] hover:text-[#102322] border-b-[2.5px] border-transparent'
                            }`}
                        >
                            <Home size={15} strokeWidth={isActive('/') ? 2.2 : 1.75} />
                            <span>Overview</span>
                        </Link>

                        <Link
                            to="/dashboard"
                            className={`inline-flex items-center gap-2 h-full px-4 text-[13px] font-medium transition-colors relative -mb-[1px] ${
                                isActive('/dashboard')
                                    ? 'text-[#124B40] font-semibold border-b-[2.5px] border-[#124B40]'
                                    : 'text-[#53605B] hover:text-[#102322] border-b-[2.5px] border-transparent'
                            }`}
                        >
                            <Layers size={15} strokeWidth={isActive('/dashboard') ? 2.2 : 1.75} />
                            <span>Registry Ledger</span>
                        </Link>

                        <Link
                            to="/issue"
                            className={`inline-flex items-center gap-2 h-full px-4 text-[13px] font-medium transition-colors relative -mb-[1px] ${
                                isActive('/issue')
                                    ? 'text-[#124B40] font-semibold border-b-[2.5px] border-[#124B40]'
                                    : 'text-[#53605B] hover:text-[#102322] border-b-[2.5px] border-transparent'
                            }`}
                        >
                            <FileText size={15} strokeWidth={isActive('/issue') ? 2.2 : 1.75} />
                            <span>Issue Credential</span>
                        </Link>

                        <Link
                            to="/verify"
                            className={`inline-flex items-center gap-2 h-full px-4 text-[13px] font-medium transition-colors relative -mb-[1px] ${
                                isActive('/verify')
                                    ? 'text-[#124B40] font-semibold border-b-[2.5px] border-[#124B40]'
                                    : 'text-[#53605B] hover:text-[#102322] border-b-[2.5px] border-transparent'
                            }`}
                        >
                            <ShieldCheck size={15} strokeWidth={isActive('/verify') ? 2.2 : 1.75} />
                            <span>Verify Credential</span>
                        </Link>
                    </nav>

                    {/* Right: Wallet Connect & Mobile Menu Trigger */}
                    <div className="flex items-center gap-3">
                        <WalletConnect />

                        {/* Mobile menu toggle */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-1.5 rounded border border-[#D5D0C3] text-[#102322] hover:bg-[#EDEAE0]"
                            aria-label="Toggle Navigation"
                        >
                            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-[#D5D0C3] bg-[#FAF9F5] px-4 py-3 space-y-1">
                    <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium ${
                            isActive('/')
                                ? 'bg-[#E6EFEB] text-[#124B40] font-semibold'
                                : 'text-[#53605B] hover:bg-[#EDEAE0] hover:text-[#102322]'
                        }`}
                    >
                        <Home size={16} />
                        <span>Overview</span>
                    </Link>
                    <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium ${
                            isActive('/dashboard')
                                ? 'bg-[#E6EFEB] text-[#124B40] font-semibold'
                                : 'text-[#53605B] hover:bg-[#EDEAE0] hover:text-[#102322]'
                        }`}
                    >
                        <Layers size={16} />
                        <span>Registry Ledger</span>
                    </Link>
                    <Link
                        to="/issue"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium ${
                            isActive('/issue')
                                ? 'bg-[#E6EFEB] text-[#124B40] font-semibold'
                                : 'text-[#53605B] hover:bg-[#EDEAE0] hover:text-[#102322]'
                        }`}
                    >
                        <FileText size={16} />
                        <span>Issue Credential</span>
                    </Link>
                    <Link
                        to="/verify"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium ${
                            isActive('/verify')
                                ? 'bg-[#E6EFEB] text-[#124B40] font-semibold'
                                : 'text-[#53605B] hover:bg-[#EDEAE0] hover:text-[#102322]'
                        }`}
                    >
                        <ShieldCheck size={16} />
                        <span>Verify Credential</span>
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
