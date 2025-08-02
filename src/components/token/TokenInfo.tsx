import React from 'react';
import type { TokenDetails } from '@/types/token';

interface TokenInfoProps {
  tokenDetails: TokenDetails | null;
}

export const TokenInfo: React.FC<TokenInfoProps> = ({ tokenDetails }) => {
  if (!tokenDetails) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#181818] rounded-xl border border-white/10 p-8">
        <h3 className="text-2xl font-semibold text-white mb-6">Token Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tokenDetails.description && (
            <div className="md:col-span-2">
              <p className="text-sm text-white/60 mb-2">Description</p>
              <p className="text-white/90 leading-relaxed">{tokenDetails.description}</p>
            </div>
          )}
          {tokenDetails.website && (
            <div>
              <p className="text-sm text-white/60 mb-2">Website</p>
              <a 
                href={tokenDetails.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#559779] hover:text-[#6ba085] transition-colors duration-200 break-all"
              >
                {tokenDetails.website}
              </a>
            </div>
          )}
          {tokenDetails.total_supply && (
            <div>
              <p className="text-sm text-white/60 mb-2">Total Supply</p>
              <p className="text-white/90 font-mono">{parseInt(tokenDetails.total_supply).toLocaleString()}</p>
            </div>
          )}
          {tokenDetails.twitter && (
            <div>
              <p className="text-sm text-white/60 mb-2">Twitter</p>
              <a 
                href={tokenDetails.twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#559779] hover:text-[#6ba085] transition-colors duration-200 break-all"
              >
                {tokenDetails.twitter}
              </a>
            </div>
          )}
          {tokenDetails.github && (
            <div>
              <p className="text-sm text-white/60 mb-2">GitHub</p>
              <a 
                href={tokenDetails.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#559779] hover:text-[#6ba085] transition-colors duration-200 break-all"
              >
                {tokenDetails.github}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
