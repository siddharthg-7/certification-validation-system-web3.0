import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

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
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 mb-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>

                        <p className="text-sm font-semibold text-slate-800">
                            {isDragActive ? (
                                <span className="text-blue-600">Release document to attach</span>
                            ) : (
                                <>
                                    <span className="text-blue-700 hover:underline">Click to browse file</span>
                                    {' '}or drag &amp; drop document here
                                </>
                            )}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            PDF, PNG, JPG or TIFF • Max {(maxSize / 1024 / 1024).toFixed(0)} MB
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-md p-3.5 shadow-sm">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="text-left truncate">
                                <p className="text-sm font-medium text-slate-900 truncate max-w-sm">{file.name}</p>
                                <p className="text-xs text-slate-500 font-mono">
                                    {(file.size / 1024).toFixed(1)} KB • Document Attached
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
                            className="btn-ghost text-xs px-2.5 py-1 text-red-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200 rounded"
                            title="Remove attached file"
                        >
                            Remove
                        </button>
                    </div>
                )}
            </div>

            {fileRejections.length > 0 && (
                <p className="text-xs text-red-600 font-medium mt-1.5">
                    File rejected: Must be under {(maxSize / 1024 / 1024).toFixed(0)}MB.
                </p>
            )}
        </div>
    );
};

export default FileUpload;
