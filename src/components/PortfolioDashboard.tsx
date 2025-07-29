'use client';

import React, { useState, useEffect } from 'react';
import { usePortfolioStore } from '@/store/portfolio';
import { formatCurrency, formatCountdown, getChainName, normalizeTokenData } from '@/utils/portfolioUtils';
import { DEMO_WALLET_ADDRESS } from '@/utils/constants';
import { PortfolioToken, Chain } from '@/types/token';
import ChainSelector from './ChainSelector';
import TokenList from './TokenList';
import ChainSummary from './ChainSummary';

export default function PortfolioDashboard() {
  const [countdown, setCountdown] = useState(600);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
  const [manualWalletInput, setManualWalletInput] = useState('');
  
  const {
    walletAddress,
    totalValue,
    chains,
    isLoading,
    error,
    lastUpdated,
    needsRebalancing,
    maxDrift,
    setWalletAddress,
    fetchPortfolio,
    generateRebalancingSuggestions,
    clearError,
  } = usePortfolioStore();
  
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

  // Auto-refresh portfolio data every 10 minutes
  useEffect(() => {
    if (!walletAddress) return;
    
    // Reset countdown when starting
    setCountdown(600);
    
    const refreshInterval = setInterval(() => {
      fetchPortfolio();
      setCountdown(600); // Reset countdown after refresh
    }, 600000); // 10 minutes
    
    return () => clearInterval(refreshInterval);
  }, [walletAddress, fetchPortfolio]);
  
  // Set default selected chain when chains load
  useEffect(() => {
    if (chains.length > 0 && !selectedChainId) {
      // Select the chain with the highest value as default
      const sortedChains = [...chains].sort((a, b) => b.totalValue - a.totalValue);
      setSelectedChainId(sortedChains[0].chainId);
    }
  }, [chains, selectedChainId]);
  
  // Event handlers
  const handleConnectDemo = () => {
    setWalletAddress(DEMO_WALLET_ADDRESS);
  };
  
  const handleManualWalletSubmit = () => {
    if (manualWalletInput.trim()) {
      setWalletAddress(manualWalletInput.trim());
      setManualWalletInput('');
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 Cross-Chain Portfolio Autopilot
          </h1>
          <p className="text-lg text-gray-600">
            Automated DeFi portfolio rebalancing across multiple chains using 1inch
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
          
          {!walletAddress ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Connect a wallet to start tracking your portfolio</p>
                <button
                  onClick={handleConnectDemo}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Use Vitalik's Wallet (Demo)
                </button>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Or enter any wallet address:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualWalletInput}
                    onChange={(e) => setManualWalletInput(e.target.value)}
                    placeholder="0x..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleManualWalletSubmit();
                      }
                    }}
                  />
                  <button
                    onClick={handleManualWalletSubmit}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connected Wallet:</p>
                <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {walletAddress}
                </p>
              </div>
              <button
                onClick={handleFetchPortfolio}
                disabled={isLoading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Refresh Portfolio'}
              </button>
            </div>
          )}
        </div>

        {/* Portfolio Overview and Modular Components */}
        {walletAddress && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Chain Selector */}
            <div className="lg:col-span-1">
              <ChainSelector
                chains={chainData}
                selectedChainId={selectedChainId}
                onChainSelect={handleChainSelect}
                totalPortfolioValue={totalValue}
              />
            </div>
            
            {/* Middle Column: Chain Summary */}
            <div className="lg:col-span-1">
              {selectedChainId && selectedChainData && (
                <ChainSummary
                  chainId={selectedChainId}
                  chainName={selectedChainName}
                  totalValue={selectedChainData.totalValue}
                  tokenCount={selectedChainData.tokens.length}
                  percentageOfPortfolio={totalValue > 0 ? (selectedChainData.totalValue / totalValue) * 100 : 0}
                  totalPortfolioValue={totalValue}
                  isLoading={isLoading}
                />
              )}
            </div>
            
            {/* Right Column: Portfolio Stats */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Overview</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Portfolio Value</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
                    <p className="text-xs text-gray-500">
                      Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Active Chains</p>
                    <p className="text-xl font-semibold text-blue-600">
                      {chains.filter(chain => chain.totalValue > 0).length}
                    </p>
                    <p className="text-xs text-gray-500">out of {chains.length} supported</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Rebalancing Status</p>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      needsRebalancing ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {needsRebalancing ? `Needs Rebalancing (${maxDrift?.toFixed(1)}% drift)` : 'Balanced'}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleGenerateRebalancing}
                    disabled={isLoading || totalValue === 0}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
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
        )}
        
        {/* Full Width: Token List for Selected Chain */}
        {walletAddress && selectedChainId && (
          <div className="mt-6">
            <TokenList
              tokens={selectedChainTokens}
              chainName={selectedChainName}
              chainId={selectedChainId}
              isLoading={isLoading}
            />
          </div>
        )}
        
        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-400 mr-2">⚠️</div>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
