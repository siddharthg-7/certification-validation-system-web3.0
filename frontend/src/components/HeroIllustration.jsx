import React from 'react';

const HeroIllustration = () => {
    return (
        <div className="relative w-full max-w-[620px] mx-auto select-none">
            <svg
                viewBox="0 0 680 520"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto overflow-visible"
            >
                <defs>
                    {/* Shadow for certificate */}
                    <filter id="certShadow" x="-10%" y="-10%" width="130%" height="130%">
                        <feDropShadow dx="12" dy="16" stdDeviation="14" floodColor="#102322" floodOpacity="0.08" />
                        <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#102322" floodOpacity="0.04" />
                    </filter>
                    
                    {/* Architectural grid pattern */}
                    <pattern id="archGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#D5D0C3" strokeWidth="0.5" strokeDasharray="1 3" />
                    </pattern>

                    {/* Ethereum gradient */}
                    <linearGradient id="ethGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#185D50" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#102322" stopOpacity="0.95" />
                    </linearGradient>
                    <linearGradient id="ethGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#237B6B" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#124B40" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="ethGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#103D35" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#0B2520" stopOpacity="1" />
                    </linearGradient>

                    {/* Seal gradient */}
                    <radialGradient id="sealGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="60%" stopColor="#FAF5F0" />
                        <stop offset="100%" stopColor="#F5ECE4" />
                    </radialGradient>
                </defs>

                {/* Subtle background architectural perspective grid */}
                <rect x="20" y="20" width="640" height="480" fill="url(#archGrid)" opacity="0.6" />

                {/* Perspective Construction Lines */}
                <line x1="60" y1="360" x2="620" y2="360" stroke="#C9C9BC" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="120" y1="80" x2="120" y2="440" stroke="#E7E3D8" strokeWidth="0.8" />
                <line x1="560" y1="60" x2="560" y2="440" stroke="#E7E3D8" strokeWidth="0.8" />
                <line x1="50" y1="280" x2="590" y2="140" stroke="#D5D0C3" strokeWidth="0.5" strokeDasharray="2 4" />

                {/* ── ETHEREUM 3D DIAMOND (Top Right) ── */}
                <g transform="translate(585, 95)">
                    {/* Faint orbiting construction rings */}
                    <ellipse cx="0" cy="20" rx="42" ry="14" stroke="#B65F3D" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.6" />
                    <ellipse cx="0" cy="20" rx="30" ry="10" stroke="#124B40" strokeWidth="0.5" opacity="0.4" />

                    {/* Ethereum Octahedron Geometry */}
                    {/* Upper Left Facet */}
                    <polygon points="0,-48 -26,14 0,4" fill="url(#ethGrad1)" stroke="#124B40" strokeWidth="0.75" />
                    {/* Upper Right Facet */}
                    <polygon points="0,-48 26,14 0,4" fill="url(#ethGrad2)" stroke="#185D50" strokeWidth="0.75" />
                    {/* Lower Left Facet */}
                    <polygon points="0,9 -26,18 0,56" fill="url(#ethGrad3)" stroke="#102322" strokeWidth="0.75" />
                    {/* Lower Right Facet */}
                    <polygon points="0,9 26,18 0,56" fill="url(#ethGrad1)" stroke="#103D35" strokeWidth="0.75" />

                    {/* Wireframe outer accents */}
                    <line x1="0" y1="-48" x2="0" y2="56" stroke="#4ADE80" strokeWidth="0.75" opacity="0.6" strokeDasharray="3 2" />
                    <circle cx="0" cy="-48" r="2" fill="#4ADE80" />
                    <circle cx="0" cy="56" r="2" fill="#4ADE80" />
                </g>

                {/* ── PERSPECTIVE SHADOW BACKDROP FOR CERTIFICATE ── */}
                <polygon
                    points="70,72 546,62 558,308 82,318"
                    fill="#EDEAE0"
                    stroke="#D5D0C3"
                    strokeWidth="1"
                    opacity="0.8"
                />

                {/* ── MAIN FRAMED ACADEMIC CERTIFICATE WITH PERSPECTIVE TILT ── */}
                <g filter="url(#certShadow)" transform="rotate(-1.2 320 180) skewY(-1)">
                    {/* Outer Certificate Frame */}
                    <rect
                        x="84"
                        y="52"
                        width="468"
                        height="262"
                        rx="2"
                        fill="#FFFFFF"
                        stroke="#102322"
                        strokeWidth="1.75"
                    />

                    {/* Inner Fine Guilloche Border */}
                    <rect
                        x="92"
                        y="60"
                        width="452"
                        height="246"
                        rx="1"
                        fill="none"
                        stroke="#B65F3D"
                        strokeWidth="0.85"
                    />
                    <rect
                        x="96"
                        y="64"
                        width="444"
                        height="238"
                        fill="none"
                        stroke="#D5D0C3"
                        strokeWidth="0.5"
                    />

                    {/* Header: Academic Credential */}
                    <text
                        x="122"
                        y="94"
                        fontFamily="Newsreader, 'DM Serif Display', Georgia, serif"
                        fontSize="20"
                        fontWeight="700"
                        fill="#102322"
                        letterSpacing="0.02em"
                    >
                        Academic Credential
                    </text>

                    {/* Thin horizontal divider below title */}
                    <line x1="122" y1="104" x2="385" y2="104" stroke="#D5D0C3" strokeWidth="0.75" />

                    {/* ── Metadata Key-Value Grid ── */}
                    <g transform="translate(122, 122)">
                        {/* ISSUER */}
                        <text x="0" y="0" fontFamily="'IBM Plex Mono', monospace" fontSize="9" fontWeight="600" fill="#53605B" letterSpacing="0.08em">
                            ISSUER
                        </text>
                        <text x="75" y="0" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600" fill="#102322">
                            VNR VJIET
                        </text>

                        {/* RECIPIENT */}
                        <text x="0" y="20" fontFamily="'IBM Plex Mono', monospace" fontSize="9" fontWeight="600" fill="#53605B" letterSpacing="0.08em">
                            RECIPIENT
                        </text>
                        <text x="75" y="20" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="500" fill="#102322">
                            Siddhartha G.
                        </text>

                        {/* DEGREE */}
                        <text x="0" y="40" fontFamily="'IBM Plex Mono', monospace" fontSize="9" fontWeight="600" fill="#53605B" letterSpacing="0.08em">
                            DEGREE
                        </text>
                        <text x="75" y="40" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600" fill="#124B40">
                            B.Tech Information Technology
                        </text>

                        {/* ISSUED */}
                        <text x="0" y="60" fontFamily="'IBM Plex Mono', monospace" fontSize="9" fontWeight="600" fill="#53605B" letterSpacing="0.08em">
                            ISSUED
                        </text>
                        <text x="75" y="60" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="500" fill="#102322">
                            12 Jun 2026
                        </text>

                        {/* STATUS */}
                        <text x="0" y="80" fontFamily="'IBM Plex Mono', monospace" fontSize="9" fontWeight="600" fill="#53605B" letterSpacing="0.08em">
                            STATUS
                        </text>
                        <g transform="translate(75, 71)">
                            <text x="0" y="9" fontFamily="Inter, sans-serif" fontSize="10.5" fontWeight="700" fill="#15803D">
                                Valid
                            </text>
                        </g>

                        {/* TX HASH */}
                        <text x="0" y="100" fontFamily="'IBM Plex Mono', monospace" fontSize="9" fontWeight="600" fill="#53605B" letterSpacing="0.08em">
                            TX HASH
                        </text>
                        <text x="75" y="100" fontFamily="'IBM Plex Mono', monospace" fontSize="10" fontWeight="500" fill="#53605B">
                            0xb03...18e9
                        </text>
                    </g>

                    {/* ── COPPER INSTITUTIONAL EMBLEM SEAL (Top Right of Certificate) ── */}
                    <g transform="translate(488, 106)">
                        {/* Outer serrated / beaded ring */}
                        <circle cx="0" cy="0" r="26" fill="url(#sealGrad)" stroke="#B65F3D" strokeWidth="1.5" />
                        <circle cx="0" cy="0" r="22" fill="none" stroke="#B65F3D" strokeWidth="0.75" strokeDasharray="2 1.5" />
                        <circle cx="0" cy="0" r="17" fill="none" stroke="#D5B49A" strokeWidth="0.75" />

                        {/* Seal Emblem: Crest / Eagle / Book */}
                        <path d="M -8 -3 Q 0 -9 8 -3 Q 8 7 0 11 Q -8 7 -8 -3 Z" fill="none" stroke="#B65F3D" strokeWidth="1.2" />
                        <line x1="0" y1="-8" x2="0" y2="10" stroke="#B65F3D" strokeWidth="0.8" />
                        <circle cx="0" cy="-2" r="2" fill="#B65F3D" />

                        {/* Latin micro-lettering marks */}
                        <text x="0" y="-12" textAnchor="middle" fontSize="4" fontFamily="'IBM Plex Mono', monospace" fill="#B65F3D" fontWeight="700" letterSpacing="0.2em">
                            VERITAS
                        </text>
                        <text x="0" y="15" textAnchor="middle" fontSize="3.5" fontFamily="'IBM Plex Mono', monospace" fill="#B65F3D" fontWeight="600" letterSpacing="0.1em">
                            OFFICIAL SEAL
                        </text>
                    </g>

                    {/* ── Cursive Signature Flourish ── */}
                    <g transform="translate(378, 238)">
                        <path
                            d="M 2 12 Q 18 -8 28 6 T 52 4 Q 68 -2 82 10 T 104 8"
                            fill="none"
                            stroke="#102322"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                        />
                        <path
                            d="M 12 18 Q 30 14 55 16 T 98 15"
                            fill="none"
                            stroke="#102322"
                            strokeWidth="0.7"
                            opacity="0.7"
                        />
                        <line x1="0" y1="22" x2="110" y2="22" stroke="#C9C9BC" strokeWidth="0.6" />
                    </g>

                    {/* ── Vector QR Code ── */}
                    <g transform="translate(480, 218)">
                        {/* Background */}
                        <rect x="-1" y="-1" width="38" height="38" fill="#FFFFFF" stroke="#D5D0C3" strokeWidth="0.6" />

                        {/* Corner Position markers */}
                        {/* Top-Left */}
                        <rect x="2" y="2" width="10" height="10" fill="#102322" />
                        <rect x="4" y="4" width="6" height="6" fill="#FFFFFF" />
                        <rect x="5.5" y="5.5" width="3" height="3" fill="#102322" />

                        {/* Top-Right */}
                        <rect x="24" y="2" width="10" height="10" fill="#102322" />
                        <rect x="26" y="4" width="6" height="6" fill="#FFFFFF" />
                        <rect x="27.5" y="5.5" width="3" height="3" fill="#102322" />

                        {/* Bottom-Left */}
                        <rect x="2" y="24" width="10" height="10" fill="#102322" />
                        <rect x="4" y="26" width="6" height="6" fill="#FFFFFF" />
                        <rect x="5.5" y="27.5" width="3" height="3" fill="#102322" />

                        {/* Random crisp data modules */}
                        <rect x="14" y="3" width="3" height="3" fill="#102322" />
                        <rect x="19" y="5" width="3" height="3" fill="#102322" />
                        <rect x="14" y="9" width="3" height="3" fill="#102322" />
                        <rect x="5" y="15" width="3" height="3" fill="#102322" />
                        <rect x="10" y="17" width="3" height="3" fill="#102322" />
                        <rect x="15" y="14" width="3" height="3" fill="#102322" />
                        <rect x="18" y="18" width="4" height="4" fill="#102322" />
                        <rect x="25" y="15" width="3" height="3" fill="#102322" />
                        <rect x="30" y="17" width="3" height="3" fill="#102322" />
                        <rect x="14" y="25" width="3" height="3" fill="#102322" />
                        <rect x="19" y="28" width="3" height="3" fill="#102322" />
                        <rect x="26" y="24" width="3" height="3" fill="#102322" />
                        <rect x="30" y="29" width="3" height="3" fill="#102322" />
                    </g>
                </g>

                {/* ── CONNECTING VERTICAL DROP LINES FROM CERTIFICATE TO PIPELINE ── */}
                <line x1="130" y1="314" x2="130" y2="395" stroke="#124B40" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
                <line x1="250" y1="314" x2="250" y2="400" stroke="#C9C9BC" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="370" y1="314" x2="370" y2="405" stroke="#C9C9BC" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="490" y1="314" x2="490" y2="400" stroke="#124B40" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />

                {/* ── ISOMETRIC PIPELINE AXIS LINE ── */}
                <path
                    d="M 70 380 L 175 400 L 295 410 L 425 405 L 555 390 L 640 375"
                    stroke="#102322"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinejoin="round"
                />

                {/* ── 5 ISOMETRIC WIREFRAME CUBES PIPELINE ── */}

                {/* Helper component in SVG: Cube at (cx, cy) with size and label */}
                {/* 1. ISSUE */}
                <g transform="translate(130, 395)">
                    {/* Wireframe Cube */}
                    {/* Top Face */}
                    <polygon points="0,-16 16,-8 0,0 -16,-8" fill="#EDEAE0" stroke="#102322" strokeWidth="1.2" />
                    {/* Left Face */}
                    <polygon points="-16,-8 0,0 0,16 -16,8" fill="#FAF9F5" stroke="#102322" strokeWidth="1.2" />
                    {/* Right Face */}
                    <polygon points="0,0 16,-8 16,8 0,16" fill="#E4EFEA" stroke="#102322" strokeWidth="1.2" />
                    {/* Node Dot on axis */}
                    <circle cx="0" cy="0" r="2.5" fill="#B65F3D" />
                    {/* Label */}
                    <text x="0" y="32" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="9.5" fontWeight="700" fill="#102322" letterSpacing="0.1em">
                        ISSUE
                    </text>
                </g>

                {/* 2. HASH */}
                <g transform="translate(250, 410)">
                    {/* Top Face */}
                    <polygon points="0,-16 16,-8 0,0 -16,-8" fill="#EDEAE0" stroke="#102322" strokeWidth="1.2" />
                    {/* Left Face */}
                    <polygon points="-16,-8 0,0 0,16 -16,8" fill="#FAF9F5" stroke="#102322" strokeWidth="1.2" />
                    {/* Right Face */}
                    <polygon points="0,0 16,-8 16,8 0,16" fill="#F8EDE6" stroke="#102322" strokeWidth="1.2" />
                    <circle cx="0" cy="0" r="2.5" fill="#B65F3D" />
                    <text x="0" y="32" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="9.5" fontWeight="700" fill="#102322" letterSpacing="0.1em">
                        HASH
                    </text>
                </g>

                {/* 3. STORE (IPFS) */}
                <g transform="translate(370, 418)">
                    {/* Top Face */}
                    <polygon points="0,-16 16,-8 0,0 -16,-8" fill="#EDEAE0" stroke="#102322" strokeWidth="1.2" />
                    {/* Left Face */}
                    <polygon points="-16,-8 0,0 0,16 -16,8" fill="#FAF9F5" stroke="#102322" strokeWidth="1.2" />
                    {/* Right Face */}
                    <polygon points="0,0 16,-8 16,8 0,16" fill="#E4EFEA" stroke="#102322" strokeWidth="1.2" />
                    <circle cx="0" cy="0" r="2.5" fill="#124B40" />
                    <text x="0" y="32" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="9.5" fontWeight="700" fill="#102322" letterSpacing="0.08em">
                        STORE (IPFS)
                    </text>
                </g>

                {/* 4. ANCHOR (EVM) */}
                <g transform="translate(490, 405)">
                    {/* Top Face */}
                    <polygon points="0,-16 16,-8 0,0 -16,-8" fill="#185D50" stroke="#102322" strokeWidth="1.2" />
                    {/* Left Face */}
                    <polygon points="-16,-8 0,0 0,16 -16,8" fill="#124B40" stroke="#102322" strokeWidth="1.2" />
                    {/* Right Face */}
                    <polygon points="0,0 16,-8 16,8 0,16" fill="#103D35" stroke="#102322" strokeWidth="1.2" />
                    <circle cx="0" cy="0" r="2.5" fill="#4ADE80" />
                    <text x="0" y="32" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="9.5" fontWeight="700" fill="#102322" letterSpacing="0.08em">
                        ANCHOR (EVM)
                    </text>
                </g>

                {/* 5. VERIFY */}
                <g transform="translate(600, 385)">
                    {/* Top Face */}
                    <polygon points="0,-16 16,-8 0,0 -16,-8" fill="#EDEAE0" stroke="#102322" strokeWidth="1.2" />
                    {/* Left Face */}
                    <polygon points="-16,-8 0,0 0,16 -16,8" fill="#FAF9F5" stroke="#102322" strokeWidth="1.2" />
                    {/* Right Face */}
                    <polygon points="0,0 16,-8 16,8 0,16" fill="#E4EFEA" stroke="#102322" strokeWidth="1.2" />
                    <circle cx="0" cy="0" r="2.5" fill="#B65F3D" />
                    <text x="0" y="32" textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="9.5" fontWeight="700" fill="#102322" letterSpacing="0.1em">
                        VERIFY
                    </text>
                </g>
            </svg>
        </div>
    );
};

export default HeroIllustration;
