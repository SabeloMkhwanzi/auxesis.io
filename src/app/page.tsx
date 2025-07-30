'use client';

import NavBar from '@/components/landing/NavBar';
import Hero from '@/components/landing/Hero';
import SupportedChains from '@/components/landing/SupportedChains';
import WalletModal from '@/components/wallet/WalletModal';
import { useState, useEffect } from 'react';

export default function Home() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

  // Check for connect=true in URL parameters
  useEffect(() => {
    if (searchParams && searchParams.get('connect') === 'true') {
      setShowWalletModal(true);
      
      // Clean up the URL by removing the connect parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [searchParams]);

  // Function to be passed to child components to open the modal
  const openWalletModal = () => setShowWalletModal(true);
  // Function to be passed to child components to close the modal
  const closeWalletModal = () => setShowWalletModal(false);

  return (
    <div className="min-h-screen bg-black p-0 overflow-hidden">
      <NavBar openWalletModal={openWalletModal} />
      <Hero openWalletModal={openWalletModal} />
      <SupportedChains />
      
      {/* Wallet Modal at root level */}
      <WalletModal 
        isOpen={showWalletModal} 
        onClose={closeWalletModal} 
      />
    </div>
  );
}
