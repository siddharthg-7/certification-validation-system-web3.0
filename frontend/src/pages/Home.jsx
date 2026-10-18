import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
    ShieldCheck,
    AwardCertificate,
    Verify,
    Scan,
    DocumentUpload,
    Lock,
    Activity,
    ArrowRight,
    CheckCircle
} from 'reicon-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans selection:bg-cyber-400 selection:text-obsidian-950">
            <Navbar />

            {/* ── HERO SECTION ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-white/10">
                {/* Ambient Radial Spotlight */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyber-400/10 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
                    <div className="max-w-3xl">
                        {/* Status eyebrow */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-400/10 border border-cyber-400/30 text-xs font-semibold text-cyber-400 uppercase tracking-widest font-mono mb-6 shadow-cyber-sm">
                            <span className="w-2 h-2 rounded-full bg-cyber-400 animate-pulse shadow-cyber-sm" />
                            <span>Enterprise Cryptographic Trust Infrastructure</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 font-display">
                            Decentralized Certificate <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-400 via-sky-300 to-indigo-400">
                                Validation &amp; Registry
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-10 max-w-2xl font-light">
                            An authoritative cryptographic platform for issuing, permanently anchoring, and instantaneously verifying academic degrees, professional credentials, and institutional accreditations on the Ethereum blockchain.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4 mb-14">
                            <Link to="/issue" className="btn-cyber px-6 py-3.5 text-sm font-semibold tracking-wide flex items-center gap-2.5">
                                <DocumentUpload size={18} color="#07090e" weight="Filled" />
                                <span>Issue New Credential</span>
                            </Link>
                            <Link to="/verify" className="btn-secondary px-6 py-3.5 text-sm font-semibold flex items-center gap-2.5">
                                <Verify size={18} color="#00f2fe" />
                                <span>Verify a Certificate</span>
                            </Link>
                            <Link to="/dashboard" className="btn-ghost px-5 py-3.5 text-sm text-slate-300 hover:text-cyber-400 flex items-center gap-1.5 font-medium">
                                <span>Access Registry Ledger</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Specification Badges Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-white/10">
                        <div className="glass-card p-5 hover:border-cyber-400/40 transition-all">
                            <div className="flex items-center gap-2 text-cyber-400 mb-2">
                                <Scan size={18} />
                                <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">Integrity Standard</p>
                            </div>
                            <p className="text-lg font-bold text-white font-display">SHA-256 Hashing</p>
                            <p className="text-xs text-slate-400 mt-1">Bitwise cryptographic uniqueness</p>
                        </div>

                        <div className="glass-card p-5 hover:border-cyber-400/40 transition-all">
                            <div className="flex items-center gap-2 text-indigo-400 mb-2">
                                <Lock size={18} />
                                <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">Archival Security</p>
                            </div>
                            <p className="text-lg font-bold text-white font-display">AES-256 IPFS</p>
                            <p className="text-xs text-slate-400 mt-1">Encrypted distributed archival</p>
                        </div>

                        <div className="glass-card p-5 hover:border-cyber-400/40 transition-all">
                            <div className="flex items-center gap-2 text-mint-400 mb-2">
                                <ShieldCheck size={18} />
                                <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">Consensus Engine</p>
                            </div>
                            <p className="text-lg font-bold text-white font-display">EVM Smart Contracts</p>
                            <p className="text-xs text-slate-400 mt-1">Immutable on-chain state machine</p>
                        </div>

                        <div className="glass-card p-5 hover:border-cyber-400/40 transition-all">
                            <div className="flex items-center gap-2 text-cyber-400 mb-2">
                                <Activity size={18} />
                                <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">Analysis Engine</p>
                            </div>
                            <p className="text-lg font-bold text-white font-display">Multi-Layer Audit</p>
                            <p className="text-xs text-slate-400 mt-1">Binary, OCR &amp; pHash telemetry</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ARCHITECTURE SECTION ─────────────────────────────────────── */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="mb-14">
                        <span className="text-xs font-mono font-bold text-cyber-400 uppercase tracking-widest bg-cyber-400/10 px-3 py-1 rounded border border-cyber-400/25">
                            Core Architecture
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 font-display">
                            Three Pillars of Cryptographic Verification
                        </h2>
                        <p className="text-sm sm:text-base text-slate-400 mt-2.5 max-w-2xl font-light leading-relaxed">
                            The platform eliminates fraudulent degree mills and altered certifications through an automated multi-stage pipeline guaranteeing data provenance, confidentiality, and tamper-resistance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Pillar 1 */}
                        <div className="glass-card group hover:border-cyber-400/50 transition-all relative overflow-hidden">
                            <div className="w-12 h-12 rounded-xl bg-cyber-400/10 border border-cyber-400/30 flex items-center justify-center text-cyber-400 mb-5 shadow-cyber-sm group-hover:scale-110 transition-transform">
                                <Scan size={24} color="#00f2fe" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2.5 font-display">
                                Multi-Layer Integrity Validation
                            </h3>
                            <p className="text-sm text-slate-300 leading-relaxed mb-5">
                                Combines raw binary SHA-256 digest comparison with Tesseract OCR semantic text extraction and perceptual visual hash (pHash) analysis to detect both file edits and visual tampering.
                            </p>
                            <span className="badge-neutral text-[11px] font-mono">
                                RFC 3161 Timestamping Standard
                            </span>
                        </div>

                        {/* Pillar 2 */}
                        <div className="glass-card group hover:border-mint-400/50 transition-all relative overflow-hidden">
                            <div className="w-12 h-12 rounded-xl bg-mint-500/10 border border-mint-500/30 flex items-center justify-center text-mint-400 mb-5 shadow-mint-glow group-hover:scale-110 transition-transform">
                                <Lock size={24} color="#00c9a7" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2.5 font-display">
                                Encrypted Decentralized Archival
                            </h3>
                            <p className="text-sm text-slate-300 leading-relaxed mb-5">
                                Private recipient metadata and document payloads are encrypted with AES-256-CBC prior to distributed pinning across the InterPlanetary File System (IPFS), safeguarding privacy.
                            </p>
                            <span className="badge-neutral text-[11px] font-mono">
                                AES-256 + IPFS CID Content Addressing
                            </span>
                        </div>

                        {/* Pillar 3 */}
                        <div className="glass-card group hover:border-indigo-400/50 transition-all relative overflow-hidden">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 shadow-indigo-glow group-hover:scale-110 transition-transform">
                                <AwardCertificate size={24} color="#818cf8" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2.5 font-display">
                                Immutable Governance &amp; Audit
                            </h3>
                            <p className="text-sm text-slate-300 leading-relaxed mb-5">
                                Authorized public key registries anchor issuances to the blockchain. Authorized institutions maintain full lifecycle governance, including verifiable on-chain revocation and reinstatements.
                            </p>
                            <span className="badge-neutral text-[11px] font-mono">
                                Role-Based Access Control (RBAC)
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── WORKFLOW PROCEDURE SECTION ───────────────────────────────── */}
            <section className="py-20 bg-obsidian-900/60 border-y border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="mb-12 text-center max-w-2xl mx-auto">
                        <span className="text-xs font-mono font-bold text-cyber-400 uppercase tracking-widest bg-cyber-400/10 px-3 py-1 rounded border border-cyber-400/25">
                            Procedural Protocol
                        </span>
                        <h2 className="text-3xl font-extrabold text-white mt-3 font-display">
                            Credential Issuance &amp; Verification Workflow
                        </h2>
                        <p className="text-sm text-slate-400 mt-2 font-light">
                            Four continuous checkpoints ensuring end-to-end mathematical trust from issuance to employer validation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="glass-card p-6 border-white/10 hover:border-cyber-400/40 transition-all relative">
                            <span className="text-xs font-mono font-bold text-cyber-400 bg-cyber-400/10 px-2.5 py-1 rounded border border-cyber-400/30 inline-block mb-3.5">
                                Phase 01
                            </span>
                            <h4 className="text-base font-bold text-white mb-2 font-display">Document Ingestion</h4>
                            <p className="text-xs text-slate-300 leading-relaxed font-light">
                                Authorized institutional issuer attaches the official credential and fills in verified student and course metadata.
                            </p>
                        </div>

                        <div className="glass-card p-6 border-white/10 hover:border-cyber-400/40 transition-all relative">
                            <span className="text-xs font-mono font-bold text-cyber-400 bg-cyber-400/10 px-2.5 py-1 rounded border border-cyber-400/30 inline-block mb-3.5">
                                Phase 02
                            </span>
                            <h4 className="text-base font-bold text-white mb-2 font-display">Cryptographic Hashing</h4>
                            <p className="text-xs text-slate-300 leading-relaxed font-light">
                                Computes binary SHA-256 digest, extracts OCR semantic content, calculates perceptual visual hash, and encrypts payload.
                            </p>
                        </div>

                        <div className="glass-card p-6 border-white/10 hover:border-cyber-400/40 transition-all relative">
                            <span className="text-xs font-mono font-bold text-cyber-400 bg-cyber-400/10 px-2.5 py-1 rounded border border-cyber-400/30 inline-block mb-3.5">
                                Phase 03
                            </span>
                            <h4 className="text-base font-bold text-white mb-2 font-display">Blockchain Calldata Anchor</h4>
                            <p className="text-xs text-slate-300 leading-relaxed font-light">
                                Smart contract records the cryptographic hashes, IPFS reference CID, and issuer public key permanently on Ethereum.
                            </p>
                        </div>

                        <div className="glass-card p-6 border-white/10 hover:border-cyber-400/40 transition-all relative">
                            <span className="text-xs font-mono font-bold text-cyber-400 bg-cyber-400/10 px-2.5 py-1 rounded border border-cyber-400/30 inline-block mb-3.5">
                                Phase 04
                            </span>
                            <h4 className="text-base font-bold text-white mb-2 font-display">Zero-Trust Public Audit</h4>
                            <p className="text-xs text-slate-300 leading-relaxed font-light">
                                Employers or verification agencies upload a certificate or query by hash to receive an instant authentic/revoked verdict.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA STRIP ────────────────────────────────────────────────── */}
            <section className="py-14 bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border-b border-white/10 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle size={16} color="#00c9a7" />
                            <span className="text-xs font-mono text-mint-400 font-semibold uppercase tracking-wider">Production Ready Protocol</span>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight text-white font-display">
                            Ready to anchor or verify credentials on-chain?
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
                            Access the public zero-trust verification portal or connect your administrative institutional wallet.
                        </p>
                    </div>
                    <div className="flex items-center gap-3.5 flex-shrink-0">
                        <Link to="/verify" className="btn-secondary text-xs px-5 py-3 font-semibold">
                            Verify Credential
                        </Link>
                        <Link to="/issue" className="btn-cyber text-xs px-5 py-3 font-semibold">
                            Issue Credential
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────────────────── */}
            <footer className="mt-auto bg-obsidian-950 border-t border-white/5 py-8 text-xs text-slate-500 font-mono">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-300 font-sans">VeriChain Enterprise</span>
                        <span>•</span>
                        <span>Decentralized Credential Registry System</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                        Compliant with EVM Smart Contract Specifications &amp; W3C Verifiable Credentials Principles.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
