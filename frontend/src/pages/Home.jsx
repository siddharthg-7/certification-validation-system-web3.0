import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            {/* ── HERO SECTION ─────────────────────────────────────────────── */}
            <section className="bg-white border-b border-slate-200 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="max-w-3xl">
                        {/* Status eyebrow */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-6">
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                            Official Public Infrastructure Specification
                        </div>

                        {/* Heading */}
                        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                            Decentralized Certificate Validation &amp; Registry System
                        </h1>

                        {/* Description */}
                        <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
                            An authoritative cryptographic platform for issuing, permanently anchoring, and instantaneously verifying academic degrees, professional credentials, and institutional accreditations on the Ethereum blockchain.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-3.5 mb-12">
                            <Link to="/issue" className="btn-primary px-5 py-3 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Issue New Credential
                            </Link>
                            <Link to="/verify" className="btn-secondary px-5 py-3 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Verify a Certificate
                            </Link>
                            <Link to="/dashboard" className="btn-ghost px-4 py-3 text-sm text-slate-700">
                                Access Registry Ledger →
                            </Link>
                        </div>
                    </div>

                    {/* Specification Badges Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-200">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Integrity Standard</p>
                            <p className="text-base font-bold text-slate-900 mt-1">SHA-256 Hashing</p>
                            <p className="text-xs text-slate-500 mt-0.5">Cryptographic uniqueness</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Archival Security</p>
                            <p className="text-base font-bold text-slate-900 mt-1">AES-256 IPFS</p>
                            <p className="text-xs text-slate-500 mt-0.5">Encrypted distributed storage</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Consensus Engine</p>
                            <p className="text-base font-bold text-slate-900 mt-1">EVM Smart Contracts</p>
                            <p className="text-xs text-slate-500 mt-0.5">Immutable on-chain ledger</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Analysis Engine</p>
                            <p className="text-base font-bold text-slate-900 mt-1">Multi-Layer Audit</p>
                            <p className="text-xs text-slate-500 mt-0.5">Binary, OCR &amp; pHash checks</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ARCHITECTURE SECTION ─────────────────────────────────────── */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="mb-12">
                        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Technical Architecture</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                            Three Pillars of Cryptographic Verification
                        </h2>
                        <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                            The platform mitigates credential fraud through an automated multi-stage pipeline guaranteeing data provenance, confidentiality, and tamper-resistance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Pillar 1 */}
                        <div className="card">
                            <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-2">
                                Multi-Layer Integrity Validation
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Combines raw binary SHA-256 digest comparison with Tesseract OCR semantic text extraction and perceptual visual hash (pHash) analysis to detect both file edits and visual tampering.
                            </p>
                            <span className="badge-neutral text-[11px]">RFC 3161 Standard</span>
                        </div>

                        {/* Pillar 2 */}
                        <div className="card">
                            <div className="w-10 h-10 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-2">
                                Encrypted Decentralized Archival
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Private recipient metadata and document payloads are encrypted with AES-256-CBC prior to distributed pinning across the InterPlanetary File System (IPFS), safeguarding privacy.
                            </p>
                            <span className="badge-neutral text-[11px]">AES-256 + IPFS CID</span>
                        </div>

                        {/* Pillar 3 */}
                        <div className="card">
                            <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-800 mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-2">
                                Immutable Governance &amp; Audit
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Authorized public key registries anchor issuances to the blockchain. Authorized institutions maintain full lifecycle governance, including verifiable on-chain revocation and reinstatements.
                            </p>
                            <span className="badge-neutral text-[11px]">Role-Based Access Control</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── WORKFLOW PROCEDURE SECTION ───────────────────────────────── */}
            <section className="py-16 bg-white border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="mb-10 text-center max-w-2xl mx-auto">
                        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Procedural Lifecycle</span>
                        <h2 className="text-2xl font-bold text-slate-900 mt-1">
                            Credential Issuance &amp; Verification Workflow
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-5 rounded-lg border border-slate-200 bg-slate-50">
                            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 inline-block mb-3">
                                Stage 01
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mb-1">Document Ingestion</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Authorized institutional issuer attaches the official credential and fills in verified student and course metadata.
                            </p>
                        </div>

                        <div className="p-5 rounded-lg border border-slate-200 bg-slate-50">
                            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 inline-block mb-3">
                                Stage 02
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mb-1">Cryptographic Processing</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Generates binary SHA-256, extracts OCR semantic content, calculates perceptual visual hash, and encrypts payload.
                            </p>
                        </div>

                        <div className="p-5 rounded-lg border border-slate-200 bg-slate-50">
                            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 inline-block mb-3">
                                Stage 03
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mb-1">Blockchain Anchoring</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Smart contract records the cryptographic hashes, IPFS reference CID, and issuer public key permanently on Ethereum.
                            </p>
                        </div>

                        <div className="p-5 rounded-lg border border-slate-200 bg-slate-50">
                            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 inline-block mb-3">
                                Stage 04
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mb-1">Instant Public Audit</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Employers or verification agencies upload a certificate or query by hash to receive an instant authentic/revoked verdict.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FORMAL CTA STRIP ─────────────────────────────────────────── */}
            <section className="py-12 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight">Ready to verify or register credentials?</h3>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            Access the public verification portal or connect your administrative institutional wallet.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <Link to="/verify" className="btn-secondary text-slate-900 bg-white hover:bg-slate-100 text-xs px-4 py-2.5">
                            Verify Credential
                        </Link>
                        <Link to="/issue" className="btn-primary bg-blue-700 hover:bg-blue-800 text-white text-xs px-4 py-2.5 border-transparent">
                            Issue Credential
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FORMAL FOOTER ────────────────────────────────────────────── */}
            <footer className="mt-auto bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">CertiChain</span>
                        <span>•</span>
                        <span>Decentralized Credential Registry System</span>
                    </div>
                    <p className="text-slate-500">
                        Compliant with EVM Smart Contract Specifications &amp; W3C Verifiable Credentials Principles.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
