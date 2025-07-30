'use client';

import React, { useState } from 'react';
import { Wallet, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { WalletConnectButton } from './WalletConnectButton';
import { AddressInput } from './AddressInput';
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
    isManualMode, 
    setManualMode, 
    activeAddress,
    isValidAddress 
  } = useWallet();
  
  const [inputMode, setInputMode] = useState<'wallet' | 'manual'>('wallet');
  
  const handleModeToggle = (mode: 'wallet' | 'manual') => {
    setInputMode(mode);
    if (mode === 'manual') {
      setManualMode(true);
    } else {
      setManualMode(false);
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mode Toggle */}
      <div className="flex items-center justify-center space-x-4 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => handleModeToggle('wallet')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
            inputMode === 'wallet'
              ? 'bg-white text-blue-600 shadow-sm font-medium'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </button>
        
        <button
          onClick={() => handleModeToggle('manual')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
            inputMode === 'manual'
              ? 'bg-white text-blue-600 shadow-sm font-medium'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Enter Address</span>
        </button>
      </div>
      
      {/* Connection Interface */}
      <div className="min-h-[120px]">
        {inputMode === 'wallet' ? (
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
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                View Any Portfolio
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter any Ethereum address to view their portfolio (read-only)
              </p>
            </div>
            <AddressInput />
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
          {inputMode === 'wallet' 
            ? 'Supports MetaMask, WalletConnect, Coinbase Wallet, and more'
            : 'Portfolio data is fetched from 1inch and other DeFi protocols'
          }
        </p>
      </div>
    </div>
  );
};
