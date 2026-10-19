import React from 'react';
import { AlertTriangle, CheckCircle2, X, Loader2 } from 'lucide-react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Ledger Action',
    message,
    confirmText = 'Confirm Action',
    cancelText = 'Cancel',
    confirmVariant = 'danger', // 'danger' | 'success'
    isLoading = false,
    details = null
}) => {
    if (!isOpen) return null;

    const isDanger = confirmVariant === 'danger';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102322]/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white border border-[#D5D0C3] rounded-lg shadow-elevated max-w-md w-full p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Decorative Top Accent Bar */}
                <div
                    className={`absolute top-0 left-0 right-0 h-[3px] ${
                        isDanger ? 'bg-[#B65F3D]' : 'bg-[#124B40]'
                    }`}
                />

                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-4 right-4 text-[#7B8984] hover:text-[#102322] transition-colors p-1 rounded"
                    aria-label="Close dialog"
                >
                    <X size={16} />
                </button>

                <div className="flex items-start gap-4">
                    <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isDanger
                                ? 'bg-[#FAF5F0] border border-[#E8D4C5] text-[#B65F3D]'
                                : 'bg-[#E6EFEB] border border-[#C7DFD9] text-[#124B40]'
                        }`}
                    >
                        {isDanger ? (
                            <AlertTriangle size={22} strokeWidth={2} />
                        ) : (
                            <CheckCircle2 size={22} strokeWidth={2} />
                        )}
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                        <h3 className="text-lg font-bold text-[#102322] font-serif leading-snug">
                            {title}
                        </h3>
                        <p className="text-xs text-[#53605B] mt-1.5 leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                {details && (
                    <div className="mt-4 bg-[#FAF9F5] border border-[#D5D0C3] rounded p-3 text-xs font-mono">
                        {details.docHash && (
                            <div>
                                <span className="text-[10px] uppercase font-sans font-semibold text-[#7B8984] block mb-0.5">
                                    Target Document Hash:
                                </span>
                                <span className="text-[#102322] break-all select-all font-mono text-[11px] bg-white px-2 py-1 rounded border border-[#D5D0C3] block">
                                    {details.docHash}
                                </span>
                            </div>
                        )}
                        {details.note && (
                            <p className="text-[11px] text-[#8E4426] mt-2 font-sans font-medium flex items-center gap-1.5">
                                <span>•</span>
                                <span>{details.note}</span>
                            </p>
                        )}
                    </div>
                )}

                <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#EDEAE0]">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-xs font-semibold text-[#53605B] hover:text-[#102322] hover:bg-[#FAF9F5] border border-[#D5D0C3] rounded transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded transition-colors shadow-sm ${
                            isDanger
                                ? 'bg-[#B65F3D] hover:bg-[#9F5131]'
                                : 'bg-[#124B40] hover:bg-[#103D35]'
                        } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {isLoading && <Loader2 size={13} className="animate-spin" />}
                        <span>{isLoading ? 'Broadcasting...' : confirmText}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
