import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    DocumentUpload,
    FileCheck,
    Trash,
    AlertCircle
} from 'reicon-react';

const FileUpload = ({ onFileSelect, accept = '*', maxSize = 10485760, label = 'Upload Certificate Document' }) => {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
        onDrop,
        accept: accept === '*' ? undefined : { [accept]: [] },
        maxSize,
        multiple: false
    });

    const file = acceptedFiles[0];

    return (
        <div className="w-full">
            {label && <label className="label-formal">{label}</label>}

            <div
                {...getRootProps()}
                className={`drop-zone-formal ${isDragActive ? 'drag-active' : ''}`}
            >
                <input {...getInputProps()} />

                {!file ? (
                    <div className="flex flex-col items-center justify-center py-5 text-center">
                        <div className="w-14 h-14 rounded-xl bg-obsidian-850 border border-cyber-400/30 flex items-center justify-center text-cyber-400 mb-3 shadow-cyber-sm group-hover:scale-105 transition-transform">
                            <DocumentUpload size={28} color="#00f2fe" weight="Outline" />
                        </div>

                        <p className="text-sm font-semibold text-slate-200">
                            {isDragActive ? (
                                <span className="text-cyber-400 font-bold">Release credential document to attach</span>
                            ) : (
                                <>
                                    <span className="text-cyber-400 hover:underline cursor-pointer">Click to browse file</span>
                                    {' '}or drag &amp; drop document here
                                </>
                            )}
                        </p>
                        <p className="text-xs text-slate-400 mt-1.5 font-mono">
                            PDF, PNG, JPG, or TIFF • Cryptographic SHA-256 digested on ingest (Max {(maxSize / 1024 / 1024).toFixed(0)} MB)
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-obsidian-850/90 border border-cyber-400/40 rounded-lg p-4 shadow-cyber-sm">
                        <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-11 h-11 rounded-lg bg-mint-500/10 border border-mint-500/30 flex items-center justify-center text-mint-400 flex-shrink-0">
                                <FileCheck size={22} color="#00c9a7" />
                            </div>
                            <div className="text-left truncate">
                                <p className="text-sm font-semibold text-white truncate max-w-sm">{file.name}</p>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">
                                    {(file.size / 1024).toFixed(1)} KB • Document Attached &amp; Buffered
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                acceptedFiles.length = 0;
                                onFileSelect(null);
                            }}
                            className="btn-danger text-xs px-3 py-1.5 flex items-center gap-1.5"
                            title="Remove attached file"
                        >
                            <Trash size={14} />
                            <span>Remove</span>
                        </button>
                    </div>
                )}
            </div>

            {fileRejections.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mt-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-md">
                    <AlertCircle size={14} color="#f43f5e" />
                    <span>File rejected: Must be under {(maxSize / 1024 / 1024).toFixed(0)}MB.</span>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
