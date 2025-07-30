'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useActiveAccount, useActiveWallet } from 'thirdweb/react';

interface WalletContextType {
  // Wallet connection state
  isConnected: boolean;
  address: string | null;
  
  // Manual address input state
  isManualMode: boolean;
  manualAddress: string;
  
  // Actions
  setManualMode: (enabled: boolean) => void;
  setManualAddress: (address: string) => void;
  
  // Current active address (either connected wallet or manual input)
  activeAddress: string | null;
  
  // Validation
  isValidAddress: (address: string) => boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  
  // Wallet connection state
  const isConnected = !!account && !!wallet;
  const address = account?.address || null;
  
  // Determine the active address to use for portfolio queries
  const activeAddress = isManualMode && manualAddress 
    ? manualAddress 
    : address;
  
  // Address validation function
  const isValidAddress = (addr: string): boolean => {
    if (!addr) return false;
    // Basic Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };
  
  // Auto-switch to wallet mode when wallet connects
  useEffect(() => {
    if (isConnected && isManualMode) {
      setIsManualMode(false);
      setManualAddress('');
    }
  }, [isConnected, isManualMode]);
  
  const setManualMode = (enabled: boolean) => {
    setIsManualMode(enabled);
    if (!enabled) {
      setManualAddress('');
    }
  };
  
  const contextValue: WalletContextType = {
    isConnected,
    address,
    isManualMode,
    manualAddress,
    setManualMode,
    setManualAddress,
    activeAddress,
    isValidAddress,
  };
  
  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
