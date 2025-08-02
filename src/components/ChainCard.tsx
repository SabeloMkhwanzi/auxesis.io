'use client';

import React from 'react';
import { CHAIN_NAMES, CHAIN_LOGOS } from '@/utils/constants';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { useTokenMetrics } from '@/hooks/useTokenMetrics';

interface Chain {
  chainId: number;
  totalValue: number;
  tokenCount: number;
  tokens: any[];
}

interface ChainCardProps {
  chain: Chain;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  totalPortfolioValue: number;
  walletAddress: string;
}

// Mini chart component for visual appeal
const MiniChart = ({ isPositive, percentage }: { isPositive: boolean; percentage: string }) => {
  const points = isPositive 
    ? "M2,12 Q6,8 10,6 T18,4 L18,14 L2,14 Z" 
    : "M2,4 Q6,8 10,10 T18,12 L18,14 L2,14 Z";
  
  return (
    <div className="w-12 h-6 flex items-center">
      <svg width="48" height="24" viewBox="0 0 20 16" className="overflow-visible">
        <defs>
          <linearGradient id={`gradient-${isPositive ? 'up' : 'down'}-${Math.random()}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d={points}
          fill={`url(#gradient-${isPositive ? 'up' : 'down'}-${Math.random()})`}
          stroke={isPositive ? '#10b981' : '#ef4444'}
          strokeWidth="1.5"
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
};

export default function ChainCard({ chain, index, isSelected, onClick, totalPortfolioValue, walletAddress }: ChainCardProps) {
  const chainName = CHAIN_NAMES[chain.chainId] || `Chain ${chain.chainId}`;
  const chainLogo = CHAIN_LOGOS[chain.chainId] || '⚪';
  
  // Fetch real metrics data for this chain
  const { metrics, loading, error } = useTokenMetrics(chain.chainId, walletAddress);
  const metricsData = metrics?.[0]; // Get first metric if available
  
  // Use only real data from API - no fallbacks
  const profitUsd = metricsData?.profit_abs_usd ?? null;
  const roi = metricsData?.roi ?? null;
  const weightedApr = metricsData?.weighted_apr ?? null;
  
  // Format the values with professional fallbacks
  const isPositive = profitUsd !== null ? profitUsd >= 0 : true;
  const roiPercentage = roi !== null ? `${roi > 0 ? '+' : ''}${(roi * 100).toFixed(2)}%` : '0.00%';
  const aprPercentage = weightedApr !== null ? `${(weightedApr * 100).toFixed(2)}%` : '0.00%';
  const profitFormatted = profitUsd !== null ? `${profitUsd > 0 ? '+' : ''}$${Math.abs(profitUsd).toLocaleString()}` : '$0.00';

  return (
    <div
      onClick={onClick}
      className={`
        relative p-3 rounded-xl border cursor-pointer transition-all duration-300 group h-full
        bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] backdrop-blur-sm
        ${isSelected 
          ? 'border-[#559779]/60 shadow-xl shadow-[#559779]/20 scale-[1.02]' 
          : 'border-white/10 hover:border-[#559779]/40 hover:shadow-lg hover:shadow-white/5 hover:scale-[1.01]'
        }
      `}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-[#559779] rounded-full shadow-lg shadow-[#559779]/50"></div>
      )}
      
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
              {chainLogo && chainLogo.startsWith('http') ? (
                <img 
                  src={chainLogo} 
                  alt={`${chainName} logo`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextSibling) {
                      nextSibling.style.display = 'block';
                    }
                  }}
                />
              ) : null}
              <span 
                className="text-sm font-bold text-white" 
                style={{ display: chainLogo && chainLogo.startsWith('http') ? 'none' : 'block' }}
              >
                {chainName.charAt(0)}
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-white">{chainName}</div>
              <div className="text-xs text-white/50">Proof of Stake</div>
            </div>
          </div>
          <div className={`flex items-center space-x-1 text-xs font-medium ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? (
              <ArrowTrendingUpIcon className="w-2.5 h-2.5" />
            ) : (
              <ArrowTrendingDownIcon className="w-2.5 h-2.5" />
            )}
            <span>{loading ? '...' : roiPercentage}</span>
          </div>
        </div>
        
        {/* Weighted APR section */}
        <div className="mb-2">
          <div className="text-xs text-white/50 mb-1">Weighted APR</div>
          <div className="text-xl font-bold text-white">
            {loading ? '...' : aprPercentage}
          </div>
        </div>
        
        {/* Mini chart */}
        <div className="mb-2">
          <MiniChart isPositive={isPositive} percentage={roiPercentage} />
        </div>
        
        {/* Profit and percentage */}
        <div className="flex items-center justify-between">
          <div className={`text-sm font-semibold ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {loading ? '...' : profitFormatted}
          </div>
          <div className="text-sm text-white/70">
            {((chain.totalValue / totalPortfolioValue) * 100).toFixed(1)}%
          </div>
        </div>
        
        {/* Error state */}
        {error && (
          <div className="text-xs text-red-400 mt-2">
            Failed to load metrics
          </div>
        )}
      </div>
    </div>
  );
}
