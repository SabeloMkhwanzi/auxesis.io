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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Token Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tokenDetails.description && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-2">Description</p>
              <p className="text-gray-900">{tokenDetails.description}</p>
            </div>
          )}
          {tokenDetails.website && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Website</p>
              <a href={tokenDetails.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                {tokenDetails.website}
              </a>
            </div>
          )}
          {tokenDetails.total_supply && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Total Supply</p>
              <p className="text-gray-900">{parseInt(tokenDetails.total_supply).toLocaleString()}</p>
            </div>
          )}
          {tokenDetails.twitter && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Twitter</p>
              <a href={tokenDetails.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                {tokenDetails.twitter}
              </a>
            </div>
          )}
          {tokenDetails.github && (
            <div>
              <p className="text-sm text-gray-500 mb-2">GitHub</p>
              <a href={tokenDetails.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                {tokenDetails.github}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
