import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeroProps {
  openWalletModal?: () => void;
}

export default function Hero({ openWalletModal }: HeroProps) {
  const router = useRouter();
  
  const handleGetStarted = () => {
    router.push('/dashboard');
  };
  return (
    <div className="w-auto mt-4 md:mt-7 mb-4 md:mb-7 mx-4 md:mx-[30px] bg-gray-900 rounded-xl md:rounded-[2rem] overflow-hidden relative">
      {/* Green Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-green-500 to-green-600">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Vertical Lines Pattern */}
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/20 transform -translate-x-1/2" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/10 transform -translate-x-8" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/10 transform translate-x-8" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/5 transform -translate-x-16" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/5 transform translate-x-16" />
        </div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[50vh] md:min-h-[60vh] text-center px-4 md:px-8 pb-8 md:pb-16 pt-5">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="mb-8">
            <Badge className="bg-black/20 rounded-full text-white border-white/30 hover:bg-black/30 px-4 py-2">
              Unlock Intelligent Growth
              <ArrowRight className="w-4 h-4 ml-2" />
            </Badge>
          </div>
          
          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Cross-Chain Portfolio 
            <br className="md:block hidden" />
            <span className="md:inline">Autopilot</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-base md:text-lg text-white/90 mb-8 md:mb-12 max-w-2xl mx-auto px-2">
            Intelligent DeFi portfolio management across multiple chains using 1inch infrastructure
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button 
              className="bg-transparent rounded-full border border-white/30 text-white hover:bg-white/10 px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto"
              onClick={handleGetStarted}
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Get Started
            </Button>
            
            <Button 
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium text-sm md:text-base px-6 md:px-8 py-2 md:py-3 rounded-full w-full sm:w-auto"
              onClick={openWalletModal}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
