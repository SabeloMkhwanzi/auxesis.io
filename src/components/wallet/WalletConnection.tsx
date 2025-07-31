'use client';

import React from 'react';
import { WalletConnectButton } from './WalletConnectButton';
import { WalletInfo } from './WalletInfo';
import { useWallet } from './WalletProvider';

interface WalletConnectionProps {
  className?: string;
  showInfo?: boolean;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({ 
  className = '',
  showInfo = true 
}) => {
  const { 
    isConnected, 
    activeAddress,
    isValidAddress 
  } = useWallet();
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Connection Interface */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Connect your wallet to view your portfolio and execute trades
          </p>
        </div>
        <WalletConnectButton className="flex justify-center" />
        
        {isConnected && (
          <div className="text-center">
            <p className="text-sm text-green-600 font-medium">
              ✓ Wallet connected successfully!
            </p>
          </div>
        )}
      </div>
      
      {/* Wallet Info Display */}
      {showInfo && activeAddress && isValidAddress(activeAddress) && (
        <WalletInfo className="mt-4" />
      )}
      
      {/* Helper Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Supports MetaMask, WalletConnect, Coinbase Wallet, and more
        </p>
      </div>
    </div>
  );
};
