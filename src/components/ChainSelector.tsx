'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import ChainCard from './ChainCard';

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
  walletAddress: string;
}



export default function ChainSelector({ 
  chains, 
  selectedChainId, 
  onChainSelect, 
  totalPortfolioValue,
  walletAddress
}: ChainSelectorProps) {
  const [showAllChains, setShowAllChains] = useState(false);

  // Sort chains by total value (descending)
  const sortedChains = [...chains].sort((a, b) => b.totalValue - a.totalValue);
  
  // Show top 3 by default, or all if toggled
  const displayedChains = showAllChains ? sortedChains : sortedChains.slice(0, 3);
  const hasMoreChains = sortedChains.length > 3;

  // For now, let's use mock data until we fix the hook issue
  // TODO: Implement proper data fetching without violating hooks rules

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
        {displayedChains.map((chain, index) => (
          <ChainCard
            key={chain.chainId}
            chain={chain}
            index={index}
            isSelected={selectedChainId === chain.chainId}
            onClick={() => onChainSelect(chain.chainId)}
            totalPortfolioValue={totalPortfolioValue}
            walletAddress={walletAddress}
          />
        ))}
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
