import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/components/wallet/WalletProvider';
import { useEffect, useState } from 'react';

interface HeroProps {
  openWalletModal?: () => void;
}

export default function Hero({ openWalletModal }: HeroProps) {
  const router = useRouter();
  const { isConnected } = useWallet();
  const [shouldRedirectAfterConnection, setShouldRedirectAfterConnection] = useState(false);
  
  const handleGetStarted = () => {
    router.push('/dashboard');
  };
  
  const handleConnectWallet = () => {
    setShouldRedirectAfterConnection(true);
    if (openWalletModal) {
      openWalletModal();
    }
  };
  
  // Redirect to dashboard when wallet connects from landing page
  useEffect(() => {
    if (isConnected && shouldRedirectAfterConnection) {
      router.push('/dashboard');
      setShouldRedirectAfterConnection(false);
    }
  }, [isConnected, shouldRedirectAfterConnection, router]);

  return (
    <div className="w-auto mt-4 md:mt-7 mb-4 md:mb-7 mx-4 md:mx-[30px] bg-[#181818] rounded-xl md:rounded-[2rem] overflow-hidden relative">
        {/* Gradient Balls */}
        <div
          className="absolute -top-50 -right-32 w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle, rgba(200,255,220,0.7) 0%, rgba(36,102,71,0.9) 18%, rgba(36,102,71,0.5) 45%, rgba(36,102,71,0.0) 100%)`,
            filter: 'blur(70px)',
            opacity: 0.55,
            mixBlendMode: 'screen'
          }}
        ></div>
        
        {/* 1inch Logo with Powered by text */}
        <div className="absolute bottom-2 right-4 sm:bottom-3 sm:right-6 md:bottom-4 md:right-8 lg:bottom-5 lg:right-10 flex flex-row items-center justify-end gap-2 sm:gap-3 z-10">
          <p className="text-white/80 text-xs sm:text-sm md:text-base font-medium tracking-wide whitespace-nowrap">Powered by</p>
          <img 
            src="/images/1inch-logo.svg" 
            alt="1inch" 
            className="w-[60px] sm:w-[80px] md:w-[100px] lg:w-[120px] h-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
        <div
          className="absolute -bottom-50 -left-32 w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle, rgba(200,255,220,0.7) 0%, rgba(36,102,71,0.9) 18%, rgba(36,102,71,0.5) 45%, rgba(36,102,71,0.0) 100%)`,
            filter: 'blur(70px)',
            opacity: 0.55,
            mixBlendMode: 'screen'
          }}
        ></div>
        
        {/* Animated Lines Background */}
        <div className="animated-lines absolute inset-0">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[50vh] md:min-h-[60vh] text-center px-4 md:px-8 pb-12 md:pb-20 pt-2">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="mb-8">
              <Badge className="bg-[#000000] rounded-full text-white border-white/30 hover:bg-[#181818] px-4 py-2">
                Unlock Intelligent Growth
                <ArrowRight className="w-4 h-4 ml-2" />
              </Badge>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Cross-Chain <span className="text-[#559779]">Portfolio</span> 
              <br className="md:block hidden" />
              <span className="md:inline">Autopilot</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-3xl md:text-2xl text-white/90 mb-8 md:mb-12 max-w-2xl mx-auto px-2">
              Intelligent DeFi portfolio management across multiple chains using 1inch infrastructure
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 max-w-[280px] sm:max-w-none mx-auto">
              <Button 
                className="bg-[#000000] rounded-full border border-white/30 text-white hover:bg-[#181818] px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto text-sm sm:text-base"
                onClick={handleGetStarted}
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Get Started
              </Button>
              
              <Button 
                className="bg-[#243029] hover:text-[#559779] text-[#FFFFFF] font-medium text-sm sm:text-base px-5 sm:px-6 md:px-8 py-2 md:py-3 rounded-[1rem] border border-white/10 hover:border-[#559779] w-full sm:w-auto"
                onClick={handleConnectWallet}
              >
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </div>
    
  );
}
