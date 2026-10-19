import React from 'react';

const StatusBar = () => {
    return (
        <div className="bg-[#0B2520] text-[#DCE7E4] text-[11px] py-1.5 px-4 sm:px-8 border-b border-[#123B33] select-none font-mono">
            <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-2">
                {/* Left side: Consensus ledger active indicators */}
                <div className="flex items-center gap-2 tracking-wide truncate">
                    <span className="w-2 h-2 rounded-full bg-[#B65F3D] inline-block animate-pulse flex-shrink-0" />
                    <span className="font-semibold text-white uppercase text-[10.5px] truncate">
                        Consensus Ledger Active
                    </span>
                    <span className="text-[#3A6058] mx-0.5 hidden sm:inline">|</span>
                    <span className="text-[#B2C5C0] text-[10.5px] hidden sm:inline">
                        EVM Smart Contract
                    </span>
                    <span className="text-[#B65F3D] text-[10px] mx-0.5 hidden md:inline">•</span>
                    <span className="text-[#B2C5C0] text-[10.5px] hidden md:inline">
                        IPFS Cryptographic Archival
                    </span>
                </div>

                {/* Right side: Latency and version */}
                <div className="flex items-center gap-2.5 flex-shrink-0">
                    <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#103D35] border border-[#1C5B50] text-[#4ADE80] text-[10.5px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] inline-block" />
                        <span>142ms 2x-Proof Latency</span>
                    </div>
                    <span className="text-[#3A6058] mx-0.5 hidden sm:inline">|</span>
                    <span className="text-[#9DB5B0] text-[10.5px]">
                        v3.0.0 · ENTERPRISE
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StatusBar;
