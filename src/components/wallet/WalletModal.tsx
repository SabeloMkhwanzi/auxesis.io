'use client';

import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import { useWallet } from '@/components/wallet/WalletProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const router = useRouter();
  const { isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect to dashboard when connected
  useEffect(() => {
    if (isConnected && !isLoading) {
      setIsLoading(true); // Set loading state
      
      // Keep modal open but show loading state
      setTimeout(() => {
        router.push('/dashboard'); // Redirect to dashboard after showing loading state
      }, 1500); // Give enough time to see the loading state
    }
  }, [isConnected, router, isLoading]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full relative">
        {!isLoading && (
          <button 
            className="absolute top-4 right-4 text-white/60 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
        )}
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-10 w-10 text-yellow-400 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Wallet Connected!</h2>
            <p className="text-gray-400 text-center">Redirecting to your portfolio dashboard...</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white mb-6">Connect Your Wallet</h2>
            <WalletConnectButton />
          </>
        )}
      </div>
    </div>
  );
}
