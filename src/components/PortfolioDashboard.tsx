'use client';

import React, { useState, useEffect } from 'react';
import { usePortfolioStore } from '@/store/portfolio';
import { formatCurrency, formatCountdown, getChainName, normalizeTokenData } from '@/utils/portfolioUtils';
import { DEMO_WALLET_ADDRESS } from '@/utils/constants';
import { PortfolioToken, Chain } from '@/types/token';
import { WalletConnection } from '@/components/wallet';
import { useWallet } from '@/components/wallet/WalletProvider';
import ChainSelector from './ChainSelector';
import TokenList from './TokenList';
import ChainSummary from './ChainSummary';
import { NavigationLoader } from '@/components/ui/NavigationLoader';
import { DataFreshnessIndicator } from '@/components/ui/DataFreshnessIndicator';

export default function PortfolioDashboard() {
  const [countdown, setCountdown] = useState(600);
  const [customAddress, setCustomAddress] = useState('');
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
  
  // Use wallet connection hook
  const { activeAddress, isConnected, isManualMode, setManualMode, setManualAddress } = useWallet();
  
  const {
    walletAddress,
    totalValue,
    chains,
    isLoading,
    error,
    rebalancingSuggestions,
    lastUpdated,
    needsRebalancing,
    maxDrift,
    setWalletAddress,
    clearPortfolio,
    fetchPortfolio,
    generateRebalancingSuggestions,
    clearError,
    getDataAge,
    isDataStale,
    refreshIfStale,
  } = usePortfolioStore();
  
  // Sync wallet address from wallet provider
  useEffect(() => {
    if (activeAddress && activeAddress !== walletAddress) {
      setWalletAddress(activeAddress);
    }
  }, [activeAddress, walletAddress, setWalletAddress]);
  
  // Helper functions (using shared utilities)
  const prepareChainData = (): Chain[] => {
    return chains.map(chainData => ({
      chainId: chainData.chainId,
      name: getChainName(chainData.chainId),
      totalValue: chainData.totalValue,
      tokenCount: chainData.tokens.length,
      percentageOfPortfolio: totalValue > 0 ? (chainData.totalValue / totalValue) * 100 : 0
    }));
  };
  
  const getSelectedChainData = () => {
    if (!selectedChainId) return null;
    return chains.find(chain => chain.chainId === selectedChainId);
  };
  
  const getSelectedChainTokens = (): PortfolioToken[] => {
    const chainData = getSelectedChainData();
    if (!chainData) return [];
    
    return chainData.tokens.map(token => normalizeTokenData(token));
  };

  // Sync activeAddress with portfolio store
  useEffect(() => {
    if (activeAddress && activeAddress !== walletAddress) {
      setWalletAddress(activeAddress);
    }
  }, [activeAddress, walletAddress, setWalletAddress]);

  // Auto-fetch portfolio data when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      fetchPortfolio();
    }
  }, [walletAddress, fetchPortfolio]);
  
  // Smart auto-refresh: only refresh if data is stale (every 10 minutes check)
  useEffect(() => {
    if (!walletAddress) return;
    
    // Reset countdown when starting
    setCountdown(600);
    
    const refreshInterval = setInterval(() => {
      // Only refresh if data is actually stale (older than 5 minutes)
      if (isDataStale(5)) {
        fetchPortfolio();
      }
      setCountdown(600); // Reset countdown regardless
    }, 600000); // 10 minutes
    
    return () => clearInterval(refreshInterval);
  }, [walletAddress, fetchPortfolio, isDataStale]);
  
  // Auto-refresh when page becomes visible if data is stale
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && walletAddress && isDataStale(5)) {
        // Page became visible and data is older than 5 minutes
        refreshIfStale(5);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [walletAddress, isDataStale, refreshIfStale]);
  
  // Set default selected chain when chains load
  useEffect(() => {
    if (chains.length > 0 && !selectedChainId) {
      // Select the chain with the highest value as default
      const sortedChains = [...chains].sort((a, b) => b.totalValue - a.totalValue);
      setSelectedChainId(sortedChains[0].chainId);
    }
  }, [chains, selectedChainId]);
  
  // Clear portfolio data when wallet is disconnected
  useEffect(() => {
    if (!isConnected && !isManualMode && walletAddress && walletAddress !== DEMO_WALLET_ADDRESS) {
      // Wallet was disconnected (but not demo wallet), clear all portfolio data
      clearPortfolio();
      setSelectedChainId(null);
      setCustomAddress('');
      setShowAddressInput(false);
    }
  }, [isConnected, isManualMode, walletAddress, clearPortfolio]);
  
  // Event handlers
  const handleConnectDemo = () => {
    // Set manual mode and demo address in wallet provider
    setManualMode(true);
    setManualAddress(DEMO_WALLET_ADDRESS);
    // This will trigger the wallet address sync via activeAddress
  };

  const handleCustomAddress = () => {
    if (customAddress.trim()) {
      // Set manual mode and custom address in wallet provider
      setManualMode(true);
      setManualAddress(customAddress.trim());
      setCustomAddress('');
      setShowAddressInput(false);
      // This will trigger the wallet address sync via activeAddress
    }
  };
  
  const handleFetchPortfolio = async () => {
    if (!walletAddress) {
      console.warn('No wallet address set');
      return;
    }
    // Clear cache for fresh data on manual refresh
    const { clearCache } = await import('@/services/oneinch');
    if (clearCache) clearCache();

    await fetchPortfolio();
    setCountdown(600); // Reset countdown after manual refresh
  };
  
  const handleChainSelect = (chainId: number) => {
    setSelectedChainId(chainId);
  };

  const handleGenerateRebalancing = async () => {
    await generateRebalancingSuggestions();
  };

  // Countdown timer - updates every second
  useEffect(() => {
    if (!walletAddress || countdown <= 0) return;
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(countdownInterval);
  }, [walletAddress, countdown]);

  // Prepare data for components
  const chainData = prepareChainData();
  const selectedChainData = getSelectedChainData();
  const selectedChainTokens = getSelectedChainTokens();
  const selectedChainName = selectedChainId ? getChainName(selectedChainId) : '';

  return (
    <>
      {/* Show NavigationLoader when loading portfolio data */}
      <NavigationLoader 
        isLoading={isLoading && !!walletAddress} 
        message={isLoading ? "Fetching your cross-chain portfolio..." : "Loading..."}
      />
      
      <div className="min-h-screen bg-[#243029] p-6 rounded-xl" >
        <div className="max-w-7xl mx-auto">
      
        {/* Demo Wallet Option for Non-Connected Users */}
        {!walletAddress && (
          <div className="bg-[#181818] rounded-xl p-6 mb-6 border border-white/10">
            <div className="text-center">
              <p className="text-white/70 mb-4">Connect your wallet via the navigation bar, or explore with a demo:</p>
              
              <div className="space-y-4">
                {/* Demo Wallet Button */}
                <button
                  onClick={handleConnectDemo}
                  className="bg-[#559779] text-white px-6 py-2 rounded-lg hover:bg-[#559779]/80 transition-colors mr-4"
                >
                  Use Vitalik's Wallet (Demo)
                </button>
                
                {/* Toggle Address Input Button */}
                <button
                  onClick={() => setShowAddressInput(!showAddressInput)}
                  className="bg-[#243029] text-white px-6 py-2 rounded-lg hover:bg-[#243029]/80 transition-colors border border-white/10"
                >
                  {showAddressInput ? 'Cancel' : 'Enter Custom Address'}
                </button>
              </div>
              
              {/* Custom Address Input */}
              {showAddressInput && (
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder="Enter wallet address (0x...)"
                    className="w-full px-4 py-2 bg-[#243029] border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#559779] transition-colors"
                  />
                  <button
                    onClick={handleCustomAddress}
                    disabled={!customAddress.trim()}
                    className="bg-[#559779] text-white px-6 py-2 rounded-lg hover:bg-[#559779]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Load Portfolio
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Portfolio Content */}
        {walletAddress && (
          <div className="space-y-6">
            {/* Top Row: Chain Breakdown - Full Width */}
            <div className="bg-[#181818] rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Chain Breakdown</h3>
                <DataFreshnessIndicator
                  lastUpdated={lastUpdated}
                  dataAge={getDataAge()}
                  isStale={isDataStale(5)}
                  onRefresh={fetchPortfolio}
                  isLoading={isLoading}
                />
              </div>
              <ChainSelector
                chains={chains.map(chain => ({
                  chainId: chain.chainId,
                  totalValue: chain.totalValue,
                  tokenCount: chain.tokens.length,
                  tokens: chain.tokens
                }))}
                selectedChainId={selectedChainId || 1}
                onChainSelect={handleChainSelect}
                totalPortfolioValue={totalValue}
                walletAddress={activeAddress || DEMO_WALLET_ADDRESS}
              />
            </div>
            
            {/* Middle Row: Two Columns Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* Left Column: Selected Chain Details */}
              <div className="flex">
                {selectedChainData && (
                  <div className="bg-[#181818] rounded-xl p-4 border border-white/10 w-full">
                    <h3 className="text-base font-semibold text-white mb-3">Selected Chain Details</h3>
                    <ChainSummary
                      chainId={selectedChainId!}
                      chainName={selectedChainName}
                      totalValue={selectedChainData.totalValue}
                      tokenCount={selectedChainData.tokens.length}
                      percentageOfPortfolio={totalValue > 0 ? (selectedChainData.totalValue / totalValue) * 100 : 0}
                      totalPortfolioValue={totalValue}
                      isLoading={isLoading}
                      walletAddress={activeAddress || DEMO_WALLET_ADDRESS}
                    />
                  </div>
                )}
              </div>
              
              {/* Right Column: Portfolio Overview */}
              <div className="flex">
                <div className="bg-[#181818] rounded-xl p-4 border border-white/10 w-full">
                  <h3 className="text-base font-semibold text-white mb-3">Portfolio Overview</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-white/70">Total Portfolio Value</p>
                      <p className="text-xl font-bold text-white">{formatCurrency(totalValue)}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-white/70">Active Chains</p>
                      <p className="text-lg font-semibold text-[#559779]">
                        {chains.filter(chain => chain.totalValue > 0).length}
                      </p>
                      <p className="text-xs text-white/50">out of {chains.length} supported</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-white/70">Rebalancing Status</p>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        needsRebalancing ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {needsRebalancing ? 'Needs Rebalancing' : 'Balanced'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <button
                        onClick={handleGenerateRebalancing}
                        disabled={isLoading || totalValue === 0}
                        className="w-full bg-[#559779] text-white px-4 py-2 rounded-lg hover:bg-[#559779]/80 transition-colors disabled:opacity-50"
                      >
                        Check Rebalancing
                        {walletAddress && countdown > 0 && (
                          <span className="ml-2 text-xs opacity-75">
                            Auto-refresh in: {formatCountdown(countdown)}
                          </span>
                        )}
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Row: Token List - Full Width */}
            {selectedChainId && (
              <div className="bg-[#181818] rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">{selectedChainName} Tokens</h3>
                <TokenList
                  tokens={selectedChainTokens}
                  chainName={selectedChainName}
                  chainId={selectedChainId}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        )}
        
        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-400 mr-2">⚠️</div>
                <div>
                  <h3 className="text-sm font-medium text-red-400">Error</h3>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
