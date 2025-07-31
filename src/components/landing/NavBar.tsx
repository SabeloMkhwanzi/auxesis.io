import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import { NavigationLoader } from '@/components/ui/NavigationLoader';
import React, { useState } from 'react';

interface NavBarProps {
  openWalletModal?: () => void;
}

export default function NavBar({ openWalletModal }: NavBarProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  const handleHomeClick = () => {
    setIsLoading(true);
    setLoadingMessage('Loading Home');
    setTimeout(() => {
      router.push('/');
      // Loading will be cleared when page loads
    }, 100);
  };
  
  const handleDashboardClick = () => {
    setIsLoading(true);
    setLoadingMessage('Loading Dashboard');
    setTimeout(() => {
      router.push('/dashboard');
      // Loading will be cleared when page loads
    }, 100);
  };
  
  const handleDocsClick = () => {
    window.open('https://github.com/SabeloMkhwanzi/auxesis.io', '_blank');
  };
  
  // Clear loading state when component unmounts or after navigation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Clear loading after 2 seconds max
    
    return () => clearTimeout(timer);
  }, [isLoading]);
  
  return (
    <>
      <NavigationLoader isLoading={isLoading} message={loadingMessage} />
      <nav className="relative z-10 flex items-center justify-between p-3 md:p-4 max-w-full mx-auto mb-2 md:mb-4">
        {/* Logo */}
        <div className="flex items-center ml-3 cursor-pointer" onClick={handleHomeClick}>
          <img 
            src="/Auxesis-logo.svg" 
            alt="Auxesis.io" 
            className="h-20 w-auto mr-2 relative scale-150 z-10"
          />
        </div>
        
        {/* Center Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-1 bg-[#181818] rounded-full px-1 py-1 border-1 border-white/10">
          <Button variant="ghost" className="text-white hover:bg-white/10 text-sm px-4 py-2 rounded-full" onClick={handleHomeClick}>Home</Button>
          <Button variant="ghost" className="text-white hover:bg-white/10 text-sm px-4 py-2 rounded-full" onClick={handleDashboardClick}>Dashboard</Button>
          <Button variant="ghost" className="text-white hover:bg-white/10 text-sm px-4 py-2 rounded-full" onClick={handleDocsClick}>Docs</Button>
        </div>
        
        {/* Right Side Button */}
        <div className="flex items-center mr-3">
          <WalletConnectButton />
        </div>
      </nav>
    </>
  );
}
