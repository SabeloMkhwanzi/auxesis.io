'use client';

import React, { useState } from 'react';

interface Chain {
  chainId: number;
  name: string;
  totalValue: number;
  tokenCount: number;
  percentageOfPortfolio: number;
  logo?: string;
}

interface ChainSelectorProps {
  chains: Chain[];
  selectedChainId: number | null;
  onChainSelect: (chainId: number) => void;
  totalPortfolioValue: number;
}

const CHAIN_LOGOS: Record<number, string> = {
  1: '🔷', // Ethereum
  10: '🔴', // Optimism
  56: '🟡', // BSC
  100: '🟢', // Gnosis
  137: '🟣', // Polygon
  324: '⚡', // zkSync
  8453: '🔵', // Base
  42161: '🔷', // Arbitrum
  43114: '🔺', // Avalanche
  59144: '📏', // Linea
};

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  10: 'Optimism',
  56: 'BNB Chain',
  100: 'Gnosis',
  137: 'Polygon',
  324: 'zkSync Era',
  8453: 'Base',
  42161: 'Arbitrum',
  43114: 'Avalanche',
  59144: 'Linea',
};

export default function ChainSelector({ 
  chains, 
  selectedChainId, 
  onChainSelect, 
  totalPortfolioValue 
}: ChainSelectorProps) {
  const [showAllChains, setShowAllChains] = useState(false);
  
  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Sort chains by total value (descending)
  const sortedChains = [...chains].sort((a, b) => b.totalValue - a.totalValue);
  
  // Show top 3 by default, or all if toggled
  const displayedChains = showAllChains ? sortedChains : sortedChains.slice(0, 3);
  const hasMoreChains = sortedChains.length > 3;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Chain Breakdown</h3>
        <span className="text-sm text-gray-500">
          {chains.length} of 12 supported chains
        </span>
      </div>

      <div className="space-y-3">
        {displayedChains.map((chain) => {
          const isSelected = selectedChainId === chain.chainId;
          const chainName = CHAIN_NAMES[chain.chainId] || `Chain ${chain.chainId}`;
          const chainLogo = CHAIN_LOGOS[chain.chainId] || '⚪';
          
          return (
            <div
              key={chain.chainId}
              onClick={() => onChainSelect(chain.chainId)}
              className={`
                p-4 rounded-lg border cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{chainLogo}</span>
                  <div>
                    <h4 className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {chainName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {chain.tokenCount} token{chain.tokenCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                    {formatValue(chain.totalValue)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatPercentage(chain.percentageOfPortfolio)}
                  </p>
                </div>
              </div>
              
              {/* Progress bar showing percentage of portfolio */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isSelected ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${Math.min(chain.percentageOfPortfolio, 100)}%` }}
                  />
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
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200 border border-blue-200 hover:border-blue-300"
          >
            {showAllChains ? (
              <>
                <span>Show Less</span>
                <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                <span>Show {sortedChains.length - 3} More Chains</span>
                <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {chains.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No chains with assets found</p>
          <p className="text-sm mt-1">Connect a wallet to view your portfolio</p>
        </div>
      )}
    </div>
  );
}
