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
            background: '#FFFFFF',
            color: '#102322',
            border: '1px solid #D5D0C3',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(16, 35, 34, 0.08)',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#124B40',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#B65F3D',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </Web3Provider>
  );
}

export default App;
