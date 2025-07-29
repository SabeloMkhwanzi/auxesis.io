import React from 'react';
import { formatValue, getPriceChangeColor } from '@/utils/tokenUtils';
import type { Token, TokenDetails } from '@/types/token';

interface TokenStatsProps {
  token: Token;
  tokenDetails?: TokenDetails | null;
}

export const TokenStats: React.FC<TokenStatsProps> = ({
  token,
  tokenDetails
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Your Balance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-2">Your Balance</p>
          <p className="text-2xl font-bold text-gray-900">{token.balance}</p>
          <p className="text-sm text-gray-500">{token.symbol}</p>
        </div>

        {/* Total Value */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-2">Total Value</p>
          <p className="text-2xl font-bold text-gray-900">{formatValue(token.value)}</p>
        </div>

        {/* 24h P&L */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-2">24h P&L</p>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-medium ${getPriceChangeColor(token.priceChange24h || 0)}`}>
            {(token.priceChange24h || 0) > 0 ? '+' : ''}{(token.priceChange24h || 0).toFixed(2)}%
          </span>
        </div>

        {/* Market Cap */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-2">Market Cap</p>
          <p className="text-2xl font-bold text-gray-900">
            {tokenDetails?.market_cap ? formatValue(tokenDetails.market_cap) : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};
