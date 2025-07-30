'use client';

import React from 'react';
import { Wallet, User, ExternalLink } from 'lucide-react';
import { useWallet } from './WalletProvider';
import { useActiveAccount } from 'thirdweb/react';

interface WalletInfoProps {
  className?: string;
  showFullAddress?: boolean;
}

export const WalletInfo: React.FC<WalletInfoProps> = ({ 
  className = '',
  showFullAddress = false 
}) => {
  const { 
    isConnected, 
    address, 
    isManualMode, 
    manualAddress, 
    activeAddress,
    isValidAddress 
  } = useWallet();
  
  const account = useActiveAccount();
  
  // Format address for display
  const formatAddress = (addr: string | null, full: boolean = false): string => {
    if (!addr) return '';
    if (full) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };
  
  // Get explorer URL for the address
  const getExplorerUrl = (addr: string): string => {
    return `https://etherscan.io/address/${addr}`;
  };
  
  if (!activeAddress || !isValidAddress(activeAddress)) {
    return null;
  }
  
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isManualMode ? (
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Viewing Portfolio</p>
                <p className="text-xs text-gray-500">Manual address input</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Wallet Connected</p>
                <p className="text-xs text-gray-500">
                  {account?.address ? 'Ready for transactions' : 'View only'}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <p className="text-sm font-mono text-gray-900">
              {formatAddress(activeAddress, showFullAddress)}
            </p>
            {!showFullAddress && (
              <button
                onClick={() => navigator.clipboard.writeText(activeAddress)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Copy full address
              </button>
            )}
          </div>
          
          <a
            href={getExplorerUrl(activeAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="View on Etherscan"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
      
      {/* Connection status indicator */}
      <div className="mt-3 flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          isConnected && !isManualMode ? 'bg-green-500' : 'bg-blue-500'
        }`} />
        <span className="text-xs text-gray-600">
          {isConnected && !isManualMode 
            ? 'Connected - Can execute transactions' 
            : 'View only - Connect wallet to trade'
          }
        </span>
      </div>
      
      {/* Full address display when requested */}
      {showFullAddress && (
        <div className="mt-3 p-2 bg-gray-50 rounded border">
          <p className="text-xs font-mono text-gray-700 break-all">
            {activeAddress}
          </p>
        </div>
      )}
    </div>
  );
};
