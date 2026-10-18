import React from 'react';

const ArchitecturalIllustration = () => {
    return (
        <div className="flex items-center gap-4 select-none opacity-85">
            {/* Spaced vertical technical metadata */}
            <div className="flex flex-col text-[10px] font-mono font-semibold tracking-[0.2em] text-[#B65F3D] leading-relaxed">
                <span>TRUST</span>
                <span>VERIFIABLE</span>
                <span>PERMANENT</span>
            </div>

            {/* Classical Greco-Roman Architectural Temple Line Sketch */}
            <svg
                width="240"
                height="110"
                viewBox="0 0 240 110"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible"
            >
                {/* Triangular Pediment */}
                <polygon points="120,6 20,42 220,42" stroke="#8E9E99" strokeWidth="1.2" fill="#FAF9F5" />
                <polygon points="120,12 28,40 212,40" stroke="#B8C4C0" strokeWidth="0.6" fill="none" />
                
                {/* Pediment Tympanum Medallion */}
                <circle cx="120" cy="27" r="8" stroke="#8E9E99" strokeWidth="0.8" fill="#EDEAE0" />
                <circle cx="120" cy="27" r="4" stroke="#B65F3D" strokeWidth="0.6" fill="none" />

                {/* Entablature & Frieze */}
                <rect x="18" y="42" width="204" height="6" stroke="#8E9E99" strokeWidth="1" fill="#EDEAE0" />
                <line x1="22" y1="45" x2="218" y2="45" stroke="#B8C4C0" strokeWidth="0.5" strokeDasharray="3 3" />
                <rect x="15" y="48" width="210" height="4" stroke="#8E9E99" strokeWidth="1" fill="#FAF9F5" />

                {/* 6 Classical Fluted Columns */}
                {[32, 67, 102, 137, 172, 207].map((colX, idx) => (
                    <g key={idx} transform={`translate(${colX}, 52)`}>
                        {/* Capital (Ionic/Corinthian) */}
                        <rect x="-8" y="0" width="16" height="3" stroke="#8E9E99" strokeWidth="0.8" fill="#FAF9F5" />
                        <line x1="-9" y1="1" x2="9" y2="1" stroke="#8E9E99" strokeWidth="0.8" />
                        <circle cx="-6" cy="1.5" r="1.5" stroke="#8E9E99" strokeWidth="0.6" fill="#EDEAE0" />
                        <circle cx="6" cy="1.5" r="1.5" stroke="#8E9E99" strokeWidth="0.6" fill="#EDEAE0" />

                        {/* Column Shaft */}
                        <line x1="-5" y1="3" x2="-5" y2="45" stroke="#8E9E99" strokeWidth="0.8" />
                        <line x1="-2" y1="3" x2="-2" y2="45" stroke="#B8C4C0" strokeWidth="0.5" />
                        <line x1="0" y1="3" x2="0" y2="45" stroke="#B8C4C0" strokeWidth="0.5" />
                        <line x1="2" y1="3" x2="2" y2="45" stroke="#B8C4C0" strokeWidth="0.5" />
                        <line x1="5" y1="3" x2="5" y2="45" stroke="#8E9E99" strokeWidth="0.8" />

                        {/* Column Base */}
                        <rect x="-7" y="45" width="14" height="3" stroke="#8E9E99" strokeWidth="0.8" fill="#EDEAE0" />
                    </g>
                ))}

                {/* Stepped Stylobate / Foundation (3 Steps) */}
                <rect x="12" y="100" width="216" height="3" stroke="#8E9E99" strokeWidth="0.8" fill="#FAF9F5" />
                <rect x="8" y="103" width="224" height="3" stroke="#8E9E99" strokeWidth="0.8" fill="#EDEAE0" />
                <rect x="4" y="106" width="232" height="3" stroke="#8E9E99" strokeWidth="1" fill="#FAF9F5" />

                {/* Fine crosshatch shading */}
                <line x1="26" y1="52" x2="214" y2="52" stroke="#B8C4C0" strokeWidth="0.5" />
                <line x1="20" y1="98" x2="220" y2="98" stroke="#B8C4C0" strokeWidth="0.5" />
            </svg>
        </div>
    );
};

export default ArchitecturalIllustration;
