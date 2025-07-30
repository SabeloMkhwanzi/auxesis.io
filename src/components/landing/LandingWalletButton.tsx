'use client';

import { Button } from '@/components/ui/button';
import { useWallet } from '@/components/wallet/WalletProvider';
import { useState } from 'react';
import WalletModal from '@/components/wallet/WalletModal';

export default function LandingWalletButton() {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const { address, isConnected } = useWallet();
  
  // Format address for display (0x1234...5678)
  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <>
      {isConnected ? (
        // Show connected state
        <Button 
          className="bg-green-500 hover:bg-green-600 text-black font-medium text-xs md:text-sm px-3 md:px-6 py-1.5 md:py-2 rounded-full w-full md:w-auto"
        >
          {formatAddress(address)}
        </Button>
      ) : (
        // Show connect button
        <Button 
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium text-xs md:text-sm px-3 md:px-6 py-1.5 md:py-2 rounded-full w-full md:w-auto"
          onClick={() => setShowConnectModal(true)}
        >
          Connect Wallet
        </Button>
      )}
      
      {/* Use the centralized wallet modal component */}
      <WalletModal 
        isOpen={showConnectModal} 
        onClose={() => setShowConnectModal(false)} 
      />
    </>
  );
}
