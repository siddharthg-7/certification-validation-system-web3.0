import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    UploadCloud,
    FileCheck,
    Trash2,
    AlertCircle
} from 'lucide-react';

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
            {label && (
                <label className="block text-xs font-semibold text-[#53605B] uppercase tracking-wider mb-2 font-mono">
                    {label}
                </label>
            )}

            <div
                {...getRootProps()}
                className={`relative rounded border-2 border-dashed transition-all p-6 text-center cursor-pointer ${
                    isDragActive
                        ? 'border-[#124B40] bg-[#E6EFEB]'
                        : 'border-[#D5D0C3] bg-[#FAF9F5] hover:border-[#124B40] hover:bg-white'
                }`}
            >
                <input {...getInputProps()} />

                {!file ? (
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-[#E6EFEB] border border-[#C7DFD9] flex items-center justify-center text-[#124B40] mb-3 transition-transform group-hover:scale-105">
                            <UploadCloud size={24} strokeWidth={1.75} />
                        </div>

                        <p className="text-sm font-semibold text-[#102322]">
                            {isDragActive ? (
                                <span className="text-[#124B40] font-bold">Release credential document to attach</span>
                            ) : (
                                <>
                                    <span className="text-[#124B40] underline underline-offset-2">Click to browse file</span>
                                    {' '}or drag &amp; drop document here
                                </>
                            )}
                        </p>
                        <p className="text-xs text-[#53605B] mt-1.5 font-mono">
                            PDF, PNG, JPG, or TIFF • Multi-Layer SHA-256 digested on ingest (Max {(maxSize / 1024 / 1024).toFixed(0)} MB)
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-white border border-[#D5D0C3] rounded p-3.5 shadow-fine">
                        <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-10 h-10 rounded bg-[#E6EFEB] text-[#124B40] flex items-center justify-center flex-shrink-0">
                                <FileCheck size={20} strokeWidth={2} />
                            </div>
                            <div className="text-left truncate">
                                <p className="text-sm font-semibold text-[#102322] truncate max-w-sm">{file.name}</p>
                                <p className="text-xs text-[#53605B] font-mono mt-0.5">
                                    {(file.size / 1024).toFixed(1)} KB • Document Buffered
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
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded transition-colors"
                            title="Remove attached file"
                        >
                            <Trash2 size={13} />
                            <span>Remove</span>
                        </button>
                    </div>
                )}
            </div>

            {fileRejections.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-rose-700 font-medium mt-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded">
                    <AlertCircle size={14} className="text-rose-600" />
                    <span>File rejected: Must be under {(maxSize / 1024 / 1024).toFixed(0)}MB.</span>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
