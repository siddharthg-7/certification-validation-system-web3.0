import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroIllustration from '../components/HeroIllustration';
import ArchitecturalIllustration from '../components/ArchitecturalIllustration';
import {
    Fingerprint,
    Box,
    GitBranch,
    FileSearch,
    Layers,
    FileText,
    ShieldCheck,
    ArrowRight
} from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-[#F5F3EB] text-[#102322] flex flex-col font-sans selection:bg-[#B65F3D] selection:text-white">
            <Navbar />

            {/* ── SECTION C: HERO SECTION ────────────────────────────────────────── */}
            <section className="pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-[#D5D0C3]">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* Left Column: Heading, Subtitle & Actions (7 cols) */}
                        <div className="lg:col-span-6 xl:col-span-6">
                            {/* Eyebrow */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-5 h-[1.5px] bg-[#B65F3D] inline-block" />
                                <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[#B65F3D]">
                                    Enterprise Cryptographic Trust Infrastructure
                                </span>
                            </div>

                            {/* Main Editorial Serif Heading */}
                            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#102322] font-serif leading-[1.08] tracking-tight mb-5">
                                Decentralized Certificate <br />
                                Validation &amp; Registry
                            </h1>

                            {/* Supporting Paragraph */}
                            <p className="text-[15px] sm:text-[16px] text-[#53605B] leading-[1.6] mb-8 max-w-[530px] font-normal">
                                An authoritative cryptographic platform for issuing, permanently anchoring, and instantaneously verifying academic degrees, professional credentials, and institutional accreditations on the Ethereum blockchain.
                            </p>

                            {/* Primary Action Buttons & Link on Single Row */}
                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5 mb-2">
                                <Link
                                    to="/issue"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold bg-[#124B40] hover:bg-[#103D35] text-white rounded transition-colors shadow-sm whitespace-nowrap"
                                >
                                    <FileText size={15} strokeWidth={2} />
                                    <span>Issue New Credential</span>
                                    <span className="text-white/80">→</span>
                                </Link>

                                <Link
                                    to="/verify"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold bg-white hover:bg-[#FAF9F5] text-[#102322] border border-[#D5D0C3] hover:border-[#102322] rounded transition-colors shadow-fine whitespace-nowrap"
                                >
                                    <ShieldCheck size={15} strokeWidth={2} className="text-[#124B40]" />
                                    <span>Verify a Certificate</span>
                                </Link>

                                <Link
                                    to="/dashboard"
                                    className="inline-flex items-center gap-1.5 px-2 py-2.5 text-[13px] font-semibold text-[#102322] hover:text-[#124B40] transition-colors whitespace-nowrap"
                                >
                                    <span>Access Registry Ledger</span>
                                    <ArrowRight size={13} />
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: Custom Architectural Certificate Illustration (6 cols) */}
                        <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end">
                            <HeroIllustration />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION D: SECURITY CAPABILITIES STRIP ──────────────────────────── */}
            <section className="py-8 bg-[#F5F3EB]">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
                    <div className="bg-[#FAF9F5] border border-[#D5D0C3] rounded-md shadow-fine">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D5D0C3]">
                            {/* Card 1: Integrity Standard */}
                            <div className="p-6 flex items-start gap-4">
                                <div className="text-[#102322] mt-0.5 flex-shrink-0">
                                    <Fingerprint size={28} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-[#53605B] mb-1">
                                        Integrity Standard
                                    </p>
                                    <h4 className="text-[16px] font-bold text-[#102322] font-sans leading-snug">
                                        SHA-256 Hashing
                                    </h4>
                                    <p className="text-[12px] text-[#53605B] mt-0.5 leading-normal">
                                        Bitwise cryptographic uniqueness
                                    </p>
                                </div>
                            </div>

                            {/* Card 2: Archival Security */}
                            <div className="p-6 flex items-start gap-4">
                                <div className="text-[#102322] mt-0.5 flex-shrink-0">
                                    <Box size={28} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-[#53605B] mb-1">
                                        Archival Security
                                    </p>
                                    <h4 className="text-[16px] font-bold text-[#102322] font-sans leading-snug">
                                        AES-256 IPFS
                                    </h4>
                                    <p className="text-[12px] text-[#53605B] mt-0.5 leading-normal">
                                        Encrypted distributed archival
                                    </p>
                                </div>
                            </div>

                            {/* Card 3: Consensus Engine */}
                            <div className="p-6 flex items-start gap-4">
                                <div className="text-[#102322] mt-0.5 flex-shrink-0">
                                    <GitBranch size={28} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-[#53605B] mb-1">
                                        Consensus Engine
                                    </p>
                                    <h4 className="text-[16px] font-bold text-[#102322] font-sans leading-snug">
                                        EVM Smart Contracts
                                    </h4>
                                    <p className="text-[12px] text-[#53605B] mt-0.5 leading-normal">
                                        Immutable on-chain state machine
                                    </p>
                                </div>
                            </div>

                            {/* Card 4: Analysis Engine */}
                            <div className="p-6 flex items-start gap-4">
                                <div className="text-[#102322] mt-0.5 flex-shrink-0">
                                    <FileSearch size={28} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-[#53605B] mb-1">
                                        Analysis Engine
                                    </p>
                                    <h4 className="text-[16px] font-bold text-[#102322] font-sans leading-snug">
                                        Multi-Layer Audit
                                    </h4>
                                    <p className="text-[12px] text-[#53605B] mt-0.5 leading-normal">
                                        Binary, OCR &amp; pHash telemetry
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION E: CORE ARCHITECTURE ────────────────────────────────────── */}
            <section className="py-12 bg-[#F5F3EB]">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
                    {/* Header with classical institutional engraving */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#D5D0C3]">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2 mb-2.5">
                                <span className="w-5 h-[1.5px] bg-[#B65F3D] inline-block" />
                                <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[#B65F3D]">
                                    Core Architecture
                                </span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-[#102322] font-serif tracking-tight mb-3">
                                Three Pillars of Cryptographic Verification
                            </h2>
                            <p className="text-[14.5px] text-[#53605B] leading-[1.6] max-w-xl">
                                The platform eliminates fraudulent degree mills and altered certifications through an automated multi-stage pipeline guaranteeing data provenance, confidentiality, and tamper-resistance.
                            </p>
                        </div>

                        {/* Classical Greco-Roman temple line engraving */}
                        <div className="hidden md:block">
                            <ArchitecturalIllustration />
                        </div>
                    </div>

                    {/* Three Pillars Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Pillar 01 */}
                        <div className="bg-[#FAF9F5] border border-[#D5D0C3] rounded-md p-6 flex flex-col justify-between shadow-fine hover:border-[#102322] transition-colors">
                            <div>
                                <div className="flex items-center gap-2.5 mb-4">
                                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#FAF5F0] border border-[#E8D4C5] text-[#B65F3D]">
                                        01
                                    </span>
                                    <div className="text-[#124B40]">
                                        <Layers size={22} strokeWidth={1.75} />
                                    </div>
                                </div>
                                <h3 className="text-[19px] font-bold text-[#102322] font-serif mb-2.5 leading-snug">
                                    Multi-Layer Integrity Validation
                                </h3>
                                <p className="text-[13px] text-[#53605B] leading-[1.6] mb-6">
                                    Combines raw binary SHA-256 digest comparison with Tesseract OCR semantic text extraction and perceptual visual hash (pHash) analysis to detect both file edits and visual tampering.
                                </p>
                            </div>
                            <div>
                                <span className="inline-block text-[10px] font-mono font-semibold tracking-wider text-[#53605B] uppercase bg-white border border-[#D5D0C3] px-2.5 py-1 rounded">
                                    RFC 3161 TIMESTAMPING STANDARD
                                </span>
                            </div>
                        </div>

                        {/* Pillar 02 */}
                        <div className="bg-[#FAF9F5] border border-[#D5D0C3] rounded-md p-6 flex flex-col justify-between shadow-fine hover:border-[#102322] transition-colors">
                            <div>
                                <div className="flex items-center gap-2.5 mb-4">
                                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#FAF5F0] border border-[#E8D4C5] text-[#B65F3D]">
                                        02
                                    </span>
                                    <div className="text-[#124B40]">
                                        <FileText size={22} strokeWidth={1.75} />
                                    </div>
                                </div>
                                <h3 className="text-[19px] font-bold text-[#102322] font-serif mb-2.5 leading-snug">
                                    Encrypted Decentralized Archival
                                </h3>
                                <p className="text-[13px] text-[#53605B] leading-[1.6] mb-6">
                                    Private recipient metadata and document payloads are encrypted with AES-256-CBC prior to distributed pinning across the InterPlanetary File System (IPFS), safeguarding privacy.
                                </p>
                            </div>
                            <div>
                                <span className="inline-block text-[10px] font-mono font-semibold tracking-wider text-[#53605B] uppercase bg-white border border-[#D5D0C3] px-2.5 py-1 rounded">
                                    AES-256 + IPFS CID CONTENT ADDRESSING
                                </span>
                            </div>
                        </div>

                        {/* Pillar 03 */}
                        <div className="bg-[#FAF9F5] border border-[#D5D0C3] rounded-md p-6 flex flex-col justify-between shadow-fine hover:border-[#102322] transition-colors">
                            <div>
                                <div className="flex items-center gap-2.5 mb-4">
                                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#FAF5F0] border border-[#E8D4C5] text-[#B65F3D]">
                                        03
                                    </span>
                                    <div className="text-[#124B40]">
                                        <ShieldCheck size={22} strokeWidth={1.75} />
                                    </div>
                                </div>
                                <h3 className="text-[19px] font-bold text-[#102322] font-serif mb-2.5 leading-snug">
                                    Immutable Governance &amp; Audit
                                </h3>
                                <p className="text-[13px] text-[#53605B] leading-[1.6] mb-6">
                                    Authorized public key registries anchor issuances to the blockchain. Authorized institutions maintain full lifecycle governance, including verifiable on-chain revocation and reinstatements.
                                </p>
                            </div>
                            <div>
                                <span className="inline-block text-[10px] font-mono font-semibold tracking-wider text-[#53605B] uppercase bg-white border border-[#D5D0C3] px-2.5 py-1 rounded">
                                    ROLE-BASED ACCESS CONTROL (RBAC)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION F: CREDENTIAL ISSUANCE & VERIFICATION WORKFLOW ──────────── */}
            <section className="py-14 bg-[#F5F3EB] border-t border-[#D5D0C3]">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
                    {/* Centered Heading */}
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <div className="inline-flex items-center justify-center gap-1.5 mb-2">
                            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[#B65F3D]">
                                PROCEDURAL PROTOCOL
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#102322] font-serif tracking-tight mb-2.5">
                            Credential Issuance &amp; Verification Workflow
                        </h2>
                        <p className="text-[14px] text-[#53605B] font-normal">
                            Four continuous checkpoints ensuring end-to-end mathematical trust from issuance to employer validation.
                        </p>
                    </div>

                    {/* 4 Connected Stages with Continuous Axis Line */}
                    <div className="relative">
                        {/* Horizontal Connector Line for Desktop */}
                        <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-[1px] bg-[#D5D0C3] z-0" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                            {/* Step 01 */}
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#FAF9F5] border border-[#D5D0C3] flex items-center justify-center flex-shrink-0 shadow-fine text-[#102322]">
                                    <FileText size={20} strokeWidth={1.5} />
                                </div>
                                <div className="pt-1">
                                    <span className="text-[11px] font-mono font-bold text-[#B65F3D] block mb-1">
                                        01
                                    </span>
                                    <h4 className="text-[15px] font-bold text-[#102322] font-sans mb-1.5">
                                        Document Ingestion
                                    </h4>
                                    <p className="text-[12.5px] text-[#53605B] leading-[1.55]">
                                        Authorized institutional issuer attaches the official credential and fills in verified student and course metadata.
                                    </p>
                                </div>
                            </div>

                            {/* Step 02 */}
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#FAF9F5] border border-[#D5D0C3] flex items-center justify-center flex-shrink-0 shadow-fine text-[#102322] font-mono text-[18px] font-bold">
                                    #
                                </div>
                                <div className="pt-1">
                                    <span className="text-[11px] font-mono font-bold text-[#B65F3D] block mb-1">
                                        02
                                    </span>
                                    <h4 className="text-[15px] font-bold text-[#102322] font-sans mb-1.5">
                                        Cryptographic Hashing
                                    </h4>
                                    <p className="text-[12.5px] text-[#53605B] leading-[1.55]">
                                        Computes binary SHA-256 digest, extracts OCR semantic content, calculates perceptual visual hash, and encrypts payload.
                                    </p>
                                </div>
                            </div>

                            {/* Step 03 */}
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#FAF9F5] border border-[#D5D0C3] flex items-center justify-center flex-shrink-0 shadow-fine text-[#102322]">
                                    <Box size={20} strokeWidth={1.5} />
                                </div>
                                <div className="pt-1">
                                    <span className="text-[11px] font-mono font-bold text-[#B65F3D] block mb-1">
                                        03
                                    </span>
                                    <h4 className="text-[15px] font-bold text-[#102322] font-sans mb-1.5">
                                        Blockchain Calldata Anchor
                                    </h4>
                                    <p className="text-[12.5px] text-[#53605B] leading-[1.55]">
                                        Smart contract records the cryptographic hashes, IPFS reference CID, and issuer public key permanently on Ethereum.
                                    </p>
                                </div>
                            </div>

                            {/* Step 04 */}
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#FAF9F5] border border-[#D5D0C3] flex items-center justify-center flex-shrink-0 shadow-fine text-[#102322]">
                                    <ShieldCheck size={20} strokeWidth={1.5} />
                                </div>
                                <div className="pt-1">
                                    <span className="text-[11px] font-mono font-bold text-[#B65F3D] block mb-1">
                                        04
                                    </span>
                                    <h4 className="text-[15px] font-bold text-[#102322] font-sans mb-1.5">
                                        Zero-Trust Public Audit
                                    </h4>
                                    <p className="text-[12.5px] text-[#53605B] leading-[1.55]">
                                        Employers or verification agencies upload a certificate or query by hash to receive an instant authentic/revoked verdict.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION G: PRODUCTION READY PROTOCOL CTA BANNER ─────────────────── */}
            <section className="bg-[#103D35] text-white py-12 border-t border-[#0B2520] relative overflow-hidden">
                {/* Subtle technical line grid backdrop */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(#FAF9F5 1px, transparent 1px), linear-gradient(90deg, #FAF9F5 1px, transparent 1px)`,
                        backgroundSize: '36px 36px'
                    }}
                />

                <div className="max-w-[1360px] mx-auto px-4 sm:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-5 h-[1.5px] bg-[#D5B49A] inline-block" />
                            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[#D5B49A]">
                                PRODUCTION READY PROTOCOL
                            </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#F5F3EB] tracking-tight">
                            Ready to anchor or verify credentials on-chain?
                        </h3>
                        <p className="text-[13.5px] text-[#C7DFD9] mt-1.5 max-w-xl font-normal">
                            Access the public zero-trust verification portal or connect your administrative institutional wallet.
                        </p>
                    </div>

                    <div className="flex items-center gap-3.5 flex-shrink-0">
                        <Link
                            to="/verify"
                            className="inline-flex items-center justify-center px-5 py-2.5 text-[13.5px] font-semibold text-[#F5F3EB] bg-[#0E352E] hover:bg-[#14493F] border border-[#23584E] rounded transition-colors"
                        >
                            Verify Credential
                        </Link>
                        <Link
                            to="/issue"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[13.5px] font-semibold text-white bg-[#B65F3D] hover:bg-[#9F5131] rounded transition-colors shadow-sm"
                        >
                            <span>Issue Credential</span>
                            <span>→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── SECTION H: UNDERSTATED FOOTER ───────────────────────────────────── */}
            <footer className="bg-[#F5F3EB] border-t border-[#D5D0C3] py-4 text-[11.5px] text-[#53605B]">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-[#102322] font-sans">
                            VeriChain Enterprise
                        </span>
                        <span>|</span>
                        <span>Decentralized Credential Registry System</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#7B8984]">
                        <span>Compliant with EVM Smart Contract Specifications</span>
                        <span>|</span>
                        <span>Verifiable Credentials Principles</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
