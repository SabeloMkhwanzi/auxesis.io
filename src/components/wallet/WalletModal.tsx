'use client';

import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import { useWallet } from '@/components/wallet/WalletProvider';
import { useEffect } from 'react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { isConnected } = useWallet();
  
  // Close modal when wallet connects
  useEffect(() => {
    if (isConnected) {
      setTimeout(() => {
        onClose(); // Just close the modal, don't redirect
      }, 1000); // Give a moment to see the connection success
    }
  }, [isConnected, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#181818] rounded-xl p-8 max-w-md w-full relative border border-white/10">
        <button 
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          onClick={onClose}
        >
          ✕
        </button>
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <img 
              src="/Auxesis-logo-persona.svg" 
              alt="Auxesis.io" 
              className="w-30 h-30"
            />
          </div>
          <p className="text-base text-white/80 font-medium">
            Cross-Chain Portfolio Autopilot
          </p>
        </div>
        
        {/* UX Message */}
        <div className="bg-[#243029]/30 rounded-lg p-4 mb-6 border border-[#559779]/20">
          <h3 className="text-white font-medium mb-2">Connect Your Wallet</h3>
          <p className="text-sm text-white/80 leading-relaxed">
            Connect your wallet to start managing your cross-chain DeFi portfolio. 
            Track assets across multiple networks and optimize your allocations with 1inch infrastructure.
          </p>
        </div>
        
        {/* Wallet Connect Button */}
        <div className="flex justify-center">
          <WalletConnectButton />
        </div>
        
        {/* Security Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-white/50">
            🔒 Your wallet stays secure. We never store your private keys.
          </p>
        </div>
      </div>
    </div>
  );
}
