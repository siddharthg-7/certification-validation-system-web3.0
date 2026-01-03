import React from 'react';
import { Link } from 'react-router-dom';
import WalletConnect from '../components/WalletConnect';

const Home = () => {
    return (
        <div className="min-h-screen bg-dark-950">
            {/* Header */}
            <header className="border-b border-dark-800">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold gradient-text">CertiChain</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                        <WalletConnect />
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-block mb-6">
                        <span className="bg-primary-500/10 text-primary-400 px-4 py-2 rounded-full text-sm font-medium border border-primary-500/30">
                            🔐 Powered by Blockchain Technology
                        </span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-bold mb-6 text-shadow">
                        Decentralized Certificate
                        <br />
                        <span className="gradient-text">Validation System</span>
                    </h2>

                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Issue and verify certificates on the Ethereum blockchain with tamper-proof security,
                        encrypted metadata storage on IPFS, and instant verification.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/issue" className="btn-primary text-lg">
                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Issue Certificate
                        </Link>
                        <Link to="/verify" className="btn-secondary text-lg">
                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Verify Certificate
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="card-hover text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4 glow">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Tamper-Proof</h3>
                        <p className="text-gray-400">
                            Certificates are hashed with SHA-256 and stored on Ethereum blockchain, making them immutable and verifiable.
                        </p>
                    </div>

                    <div className="card-hover text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-4 glow-green">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Encrypted Storage</h3>
                        <p className="text-gray-400">
                            Certificate metadata is encrypted with AES-256 and stored on IPFS for secure, decentralized access.
                        </p>
                    </div>

                    <div className="card-hover text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Instant Verification</h3>
                        <p className="text-gray-400">
                            Verify any certificate in seconds by uploading the file. Get instant results with full audit trail.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="container mx-auto px-4 py-20">
                <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

                <div className="max-w-4xl mx-auto">
                    <div className="space-y-8">
                        {/* Issuance Flow */}
                        <div className="flex gap-6 items-start">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                1
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Certificate Issuance</h3>
                                <p className="text-gray-400">
                                    Authorized institutions upload certificates with metadata. The system generates a SHA-256 hash,
                                    encrypts the metadata, stores it on IPFS, and records the hash on the blockchain.
                                </p>
                            </div>
                        </div>

                        {/* Verification Flow */}
                        <div className="flex gap-6 items-start">
                            <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                2
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Certificate Verification</h3>
                                <p className="text-gray-400">
                                    Anyone can verify a certificate by uploading it. The system computes the hash and checks it
                                    against the blockchain. If it matches, the certificate is valid and authentic.
                                </p>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="flex gap-6 items-start">
                            <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                3
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Tamper Detection</h3>
                                <p className="text-gray-400">
                                    Any modification to the certificate, even a single character, will result in a different hash.
                                    The verification will fail, immediately detecting tampering.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-dark-800 mt-20">
                <div className="container mx-auto px-4 py-8 text-center text-gray-500">
                    <p>© 2024 CertiChain. Powered by Ethereum, IPFS, and Web3.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
