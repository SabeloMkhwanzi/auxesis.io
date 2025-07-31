import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { WalletConnectButton } from '@/components/wallet/WalletConnectButton';

interface NavBarProps {
  openWalletModal: () => void;
}

export default function NavBar({ openWalletModal }: NavBarProps) {
  const router = useRouter();
  
  const handleHomeClick = () => {
    router.push('/');
  };
  
  const handleDashboardClick = () => {
    router.push('/dashboard');
  };
  
  const handleDocsClick = () => {
    window.open('https://github.com/SabeloMkhwanzi/auxesis.io', '_blank');
  };
  
  return (
    <nav className="relative z-10 flex items-center justify-between p-3 md:p-4 max-w-full mx-auto mb-2 md:mb-4">
      {/* Logo */}
      <div className="flex items-center ml-3 cursor-pointer" onClick={handleHomeClick}>
        <span className="text-xl md:text-2xl font-bold text-white">Auxesis.io</span>
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
  );
}
