import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Web3Provider } from './hooks/useWeb3';
import Home from './pages/Home';
import IssueCertificate from './pages/IssueCertificate';
import VerifyCertificate from './pages/VerifyCertificate';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <Web3Provider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/issue" element={<IssueCertificate />} />
          <Route path="/verify" element={<VerifyCertificate />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(15, 20, 32, 0.95)',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.65), 0 0 16px rgba(0, 242, 254, 0.15)',
            fontSize: '13px',
            backdropFilter: 'blur(16px)',
          },
          success: {
            iconTheme: {
              primary: '#00c9a7',
              secondary: '#07090e',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#07090e',
            },
          },
        }}
      />
    </Web3Provider>
  );
}

export default App;
