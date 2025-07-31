'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface NavigationLoaderProps {
  isLoading: boolean;
  message?: string;
}

export const NavigationLoader: React.FC<NavigationLoaderProps> = ({ 
  isLoading, 
  message = "Loading..." 
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
      <div className="bg-[#181818] rounded-xl p-8 max-w-sm w-full mx-4 border border-white/10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/Auxesis-logo-persona.svg" 
              alt="Auxesis.io" 
              className="w-30 h-30"
            />
          </div>
        </div>
        
        {/* Loading Animation */}
        <div className="flex flex-col items-center justify-center py-4">
          <Loader2 className="h-10 w-10 text-[#559779] animate-spin mb-4" />
          <p className="text-white font-medium mb-1">{message}</p>
          <p className="text-white/60 text-sm text-center">
            Preparing your cross-chain portfolio...
          </p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-1 mt-4">
          <div className="bg-[#559779] h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default NavigationLoader;
