import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';
import { NavigationLoader } from '@/components/ui/NavigationLoader';
import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';

interface NavBarProps {
  openWalletModal?: () => void;
}

export default function NavBar({ openWalletModal }: NavBarProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
        
        {/* Right Side - Desktop */}
        <div className="hidden md:flex items-center mr-3">
          <WalletConnectButton />
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center mr-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-[#559779] transition-colors p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#181818] border-t border-white/10 mx-3 rounded-b-lg">
          <div className="px-4 py-3 space-y-2">
            <Button 
              variant="ghost" 
              className="w-full text-left text-white hover:bg-white/10 justify-start" 
              onClick={() => {
                handleHomeClick();
                setIsMobileMenuOpen(false);
              }}
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-left text-white hover:bg-white/10 justify-start" 
              onClick={() => {
                handleDashboardClick();
                setIsMobileMenuOpen(false);
              }}
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-left text-white hover:bg-white/10 justify-start" 
              onClick={() => {
                handleDocsClick();
                setIsMobileMenuOpen(false);
              }}
            >
              Docs
            </Button>
            <div className="pt-2 border-t border-white/10">
              <WalletConnectButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
