import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileSelect, accept = '*', maxSize = 10485760, label = 'Upload File' }) => {
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
        <div>
            <label className="label">{label}</label>
            <div
                {...getRootProps()}
                className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-700 hover:border-primary-500/50 bg-dark-800/50'
                    }
        `}
            >
                <input {...getInputProps()} />

                {!file ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>

                        {isDragActive ? (
                            <p className="text-primary-400 font-medium">Drop the file here</p>
                        ) : (
                            <>
                                <p className="text-gray-300">
                                    <span className="text-primary-500 font-medium">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-sm text-gray-500">
                                    Maximum file size: {(maxSize / 1024 / 1024).toFixed(0)}MB
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-dark-900 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-gray-200 font-medium">{file.name}</p>
                                <p className="text-sm text-gray-500">
                                    {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                acceptedFiles.length = 0;
                                onFileSelect(null);
                            }}
                            className="text-red-400 hover:text-red-300 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {fileRejections.length > 0 && (
                <div className="mt-2 text-red-400 text-sm">
                    {fileRejections[0].errors[0].message}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
