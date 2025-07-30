import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface NavBarProps {
  openWalletModal: () => void;
}

export default function NavBar({ openWalletModal }: NavBarProps) {
  return (
    <nav className="relative z-10 flex items-center justify-between p-3 md:p-4 max-w-7xl mx-auto mb-2 md:mb-4">
      {/* Logo */}
      <div className="flex items-center">
        <span className="text-xl md:text-2xl font-bold text-white">Auxesis</span>
      </div>
      
      {/* Center Navigation - Hidden on mobile */}
      <div className="hidden md:flex items-center space-x-1 bg-[#181818] rounded-full px-1 py-1">
        <Button variant="ghost" className="text-white hover:bg-white/10 text-sm px-4 py-2 rounded-full">Home</Button>
        <Button variant="ghost" className="text-white hover:bg-white/10 text-sm px-4 py-2 rounded-full">Features</Button>
        <Button variant="ghost" className="text-white hover:bg-white/10 text-sm px-4 py-2 rounded-full">About</Button>
      </div>
      
      {/* Right Side Button */}
      <div className="flex items-center">
        <Button 
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium text-xs md:text-sm px-3 md:px-6 py-1.5 md:py-2 rounded-full"
          onClick={openWalletModal}
        >
          Connect Wallet
        </Button>
      </div>
    </nav>
  );
}
