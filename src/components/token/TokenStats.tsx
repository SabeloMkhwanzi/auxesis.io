import React from 'react';
import { formatValue, getPriceChangeColor } from '@/utils/tokenUtils';
import { Info } from 'lucide-react';
import type { Token, TokenDetails, HistoryMetrics } from '@/types/token';

interface TokenStatsProps {
  token: Token;
  tokenDetails?: TokenDetails | null;
  historyMetrics?: HistoryMetrics | null;
}

export const TokenStats: React.FC<TokenStatsProps> = ({
  token,
  tokenDetails,
  historyMetrics
}) => {

  // Format profit/loss value with proper sign and color
  const formatProfitLoss = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    const sign = value >= 0 ? '+' : '';
    return `${sign}$${value.toFixed(2)}`;
  };

  // Format ROI as percentage
  const formatROI = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${(value * 100).toFixed(2)}%`;
  };

  // Format impermanent loss
  const formatImpermanentLoss = (impermanentLoss: any[] | null | undefined) => {
    if (!impermanentLoss || impermanentLoss.length === 0) return 'N/A';
    // Sum up the USD value of impermanent loss
    const totalLoss = impermanentLoss.reduce((sum, loss) => sum + (loss.amount_usd || 0), 0);
    return totalLoss === 0 ? 'N/A' : `$${totalLoss.toFixed(2)}`;
  };

  // Get color for profit/loss values
  const getProfitLossColor = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'text-white/50';
    return value >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Content */}
      <div className="bg-[#181818] rounded-xl border border-white/10 mb-4">
        <div className="p-6">
          <div className="space-y-2">
              
              {/* Total Borrow Section - Commented out for now */}
              {/*
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
              */}
          </div>
        </div>
      </div>
    </div>
  );
};
