import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { formatPrice, getPriceChangeColor } from '@/utils/tokenUtils';
import { CHAIN_NAMES } from '@/utils/constants';
import type { Token } from '@/types/token';

interface TokenHeaderProps {
  token: Token;
  chainId: number;
  priceChangePercentage?: number;
  onBack: () => void;
}

export const TokenHeader: React.FC<TokenHeaderProps> = ({
  token,
  chainId,
  priceChangePercentage,
  onBack
}) => {
  const chainName = CHAIN_NAMES[chainId] || `Chain ${chainId}`;

  return (
    <>
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <button 
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Token Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-6">
            <img
              src={token.logoURI}
              alt={token.symbol}
              className="w-20 h-20 rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/80x80/6366f1/ffffff?text=${token.symbol.charAt(0)}`;
              }}
            />
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{token.symbol}</h2>
              <p className="text-xl text-gray-600 mb-2">{token.name}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{chainName}</span>
                <span>•</span>
                <span>{token.address.slice(0, 8)}...{token.address.slice(-6)}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-gray-900">{formatPrice(token.price)}</p>
              {priceChangePercentage !== undefined && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriceChangeColor(priceChangePercentage)}`}>
                  {priceChangePercentage > 0 ? '+' : ''}{priceChangePercentage.toFixed(2)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
