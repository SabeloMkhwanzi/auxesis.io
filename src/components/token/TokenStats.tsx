import React from 'react';
import { formatValue, getPriceChangeColor } from '@/utils/tokenUtils';
import { Info } from 'lucide-react';
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
      {/* Content */}
      <div className="bg-[#181818] rounded-xl border border-white/10 mb-4">
        <div className="p-6">
          <div className="space-y-2">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                {/* Your Balance */}
                <div className="bg-[#1F1F1F] rounded-lg p-4 border border-white/5">
                  <p className="text-sm text-white/60 mb-2">Your Balance</p>
                  <p className="text-xl font-bold text-white">{token.balance}</p>
                  <p className="text-xs text-white/50">{token.symbol}</p>
                </div>

                {/* Total Value */}
                <div className="bg-[#1F1F1F] rounded-lg p-4 border border-white/5">
                  <p className="text-sm text-white/60 mb-2">Total Value</p>
                  <p className="text-xl font-bold text-white">{formatValue(token.value)}</p>
                </div>

                {/* 24h P&L */}
                <div className="bg-[#1F1F1F] rounded-lg p-4 border border-white/5">
                  <p className="text-sm text-white/60 mb-2">24h P&L</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${
                    (token.priceChange24h || 0) >= 0 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {(token.priceChange24h || 0) > 0 ? '+' : ''}{(token.priceChange24h || 0).toFixed(2)}%
                  </span>
                </div>

                {/* Market Cap */}
                <div className="bg-[#1F1F1F] rounded-lg p-4 border border-white/5">
                  <p className="text-sm text-white/60 mb-2">Market Cap</p>
                  <p className="text-xl font-bold text-white">
                    {tokenDetails?.market_cap ? formatValue(tokenDetails.market_cap) : 'N/A'}
                  </p>
                </div>
              </div>
              
              {/* Total Borrow Section */}
              <div className="bg-[#1F1F1F] rounded-lg p-6 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Total Borrow ({token.symbol})</h3>
                  <Info className="w-4 h-4 text-white/40" />
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <span className="text-2xl font-bold text-white">{formatValue(token.value)}</span>
                    <div className="flex flex-wrap gap-2">
                      <button className="bg-[#559779] hover:bg-[#559779]/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Borrow
                      </button>
                      <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Supply
                      </button>
                      <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Liquidity
                      </button>
                      <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Supply
                      </button>
                      <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Borrow
                      </button>
                      <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        3 Months
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-white/50">{token.balance} {token.symbol}</p>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
