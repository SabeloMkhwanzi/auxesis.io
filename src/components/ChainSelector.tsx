'use client';

import React, { useState } from 'react';
import { CHAIN_NAMES, CHAIN_LOGOS } from '@/utils/constants';
import { formatCurrency } from '@/utils/portfolioUtils';
import { ChevronDownIcon, ChevronUpIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface Chain {
  chainId: number;
  totalValue: number;
  tokenCount: number;
  tokens: any[];
}

interface ChainSelectorProps {
  chains: Chain[];
  selectedChainId: number;
  onChainSelect: (chainId: number) => void;
  totalPortfolioValue: number;
}

// Mini chart component for visual appeal
const MiniChart = ({ isPositive, percentage }: { isPositive: boolean; percentage: string }) => {
  const points = isPositive 
    ? "M2,12 Q6,8 10,6 T18,4 L18,14 L2,14 Z" 
    : "M2,4 Q6,8 10,10 T18,12 L18,14 L2,14 Z";
  
  return (
    <div className="w-16 h-8 flex items-center">
      <svg width="64" height="32" viewBox="0 0 20 16" className="overflow-visible">
        <defs>
          <linearGradient id={`gradient-${isPositive ? 'up' : 'down'}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d={points}
          fill={`url(#gradient-${isPositive ? 'up' : 'down'})`}
          stroke={isPositive ? '#10b981' : '#ef4444'}
          strokeWidth="1.5"
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
};

export default function ChainSelector({ 
  chains, 
  selectedChainId, 
  onChainSelect, 
  totalPortfolioValue
}: ChainSelectorProps) {
  const [showAllChains, setShowAllChains] = useState(false);

  // Sort chains by total value (descending)
  const sortedChains = [...chains].sort((a, b) => b.totalValue - a.totalValue);
  
  // Show top 3 by default, or all if toggled
  const displayedChains = showAllChains ? sortedChains : sortedChains.slice(0, 3);
  const hasMoreChains = sortedChains.length > 3;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-lg font-semibold text-white">My Top Chains</h4>
          <span className="text-sm text-white/50">
            {chains.length} chains
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-white/40">Sort</span>
          <div className="text-sm text-white/60">by Value ↓</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedChains.map((chain, index) => {
          const isSelected = selectedChainId === chain.chainId;
          const chainName = CHAIN_NAMES[chain.chainId] || `Chain ${chain.chainId}`;
          const chainLogo = CHAIN_LOGOS[chain.chainId] || '⚪';
          const percentageChange = index === 0 ? '+4.82%' : index === 1 ? '+2.74%' : index === 2 ? '+1.23%' : '-0.45%';
          const isPositive = !percentageChange.startsWith('-');
          const rewardRate = index === 0 ? '34.82%' : index === 1 ? '27.45%' : index === 2 ? '10.23%' : '8.91%';
          const rewardValue = index === 0 ? '+$2,436' : index === 1 ? '+$1,649' : index === 2 ? '+$1,267' : '+$892';

          return (
            <div
              key={chain.chainId}
              onClick={() => onChainSelect(chain.chainId)}
              className={`
                relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 group h-full
                bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] backdrop-blur-sm
                ${isSelected 
                  ? 'border-[#559779]/60 shadow-xl shadow-[#559779]/20 scale-[1.02]' 
                  : 'border-white/10 hover:border-[#559779]/40 hover:shadow-lg hover:shadow-white/5 hover:scale-[1.01]'
                }
              `}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#559779] rounded-full shadow-lg shadow-[#559779]/50"></div>
              )}
              
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
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
                        className="text-lg font-bold text-white" 
                        style={{ display: chainLogo && chainLogo.startsWith('http') ? 'none' : 'block' }}
                      >
                        {chainName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{chainName}</div>
                      <div className="text-xs text-white/50">Proof of Stake</div>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 text-xs font-semibold ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositive ? (
                      <ArrowTrendingUpIcon className="w-3 h-3" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-3 h-3" />
                    )}
                    <span>{percentageChange}</span>
                  </div>
                </div>
                
                {/* Reward rate section */}
                <div className="mb-3">
                  <div className="text-xs text-white/50 mb-1">Reward rate</div>
                  <div className="text-2xl font-bold text-white">{rewardRate}</div>
                </div>
                
                {/* Mini chart */}
                <div className="mb-3">
                  <MiniChart isPositive={isPositive} percentage={percentageChange} />
                </div>
                
                {/* Portfolio value and percentage */}
                <div className="flex items-center justify-between">
                  <div className={`text-sm font-semibold ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {rewardValue}
                  </div>
                  <div className="text-sm text-white/70">
                    {((chain.totalValue / totalPortfolioValue) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {hasMoreChains && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAllChains(!showAllChains)}
            className="px-4 py-2 text-sm font-medium text-[#559779] hover:text-[#559779]/80 hover:bg-[#559779]/10 rounded-lg transition-colors duration-200 border border-[#559779]/30 hover:border-[#559779]/50"
          >
            {showAllChains ? (
              <>
                <span>Show Less</span>
                <ChevronUpIcon className="w-4 h-4 ml-1 inline-block" />
              </>
            ) : (
              <>
                <span>Show {sortedChains.length - 3} More Chains</span>
                <ChevronDownIcon className="w-4 h-4 ml-1 inline-block" />
              </>
            )}
          </button>
        </div>
      )}

      {chains.length === 0 && (
        <div className="text-center py-8 text-white/50">
          <p>No chains with assets found</p>
          <p className="text-sm mt-1">Connect a wallet to view your portfolio</p>
        </div>
      )}
    </div>
  );
}
