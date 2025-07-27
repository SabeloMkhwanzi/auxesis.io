'use client';

import React from 'react';

interface ChainSummaryProps {
  chainId: number;
  chainName: string;
  totalValue: number;
  tokenCount: number;
  percentageOfPortfolio: number;
  totalPortfolioValue: number;
  profitLoss?: number;
  profitLossPercent?: number;
  isLoading?: boolean;
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

export default function ChainSummary({
  chainId,
  chainName,
  totalValue,
  tokenCount,
  percentageOfPortfolio,
  totalPortfolioValue,
  profitLoss = 0,
  profitLossPercent = 0,
  isLoading = false
}: ChainSummaryProps) {
  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatPercentage = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const getPercentageColor = (percent: number) => {
    if (percent > 0) return 'text-green-600';
    if (percent < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const chainLogo = CHAIN_LOGOS[chainId] || '⚪';

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="rounded-full bg-gray-300 h-10 w-10"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-300 rounded w-32"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="h-6 bg-gray-300 rounded w-20"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-6 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Chain Header */}
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-3xl">{chainLogo}</span>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{chainName}</h2>
          <p className="text-sm text-gray-500">Chain ID: {chainId}</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Total Value</p>
          <p className="text-2xl font-bold text-gray-900">{formatValue(totalValue)}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Portfolio %</p>
          <p className="text-2xl font-bold text-blue-600">
            {percentageOfPortfolio.toFixed(1)}%
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Assets</p>
          <p className="text-2xl font-bold text-gray-900">
            {tokenCount}
          </p>
          <p className="text-xs text-gray-500">
            {tokenCount === 1 ? 'token' : 'tokens'}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">24h P&L</p>
          <p className={`text-2xl font-bold ${getPercentageColor(profitLossPercent)}`}>
            {formatPercentage(profitLossPercent)}
          </p>
          <p className={`text-xs ${getPercentageColor(profitLoss)}`}>
            {profitLoss >= 0 ? '+' : ''}{formatValue(profitLoss)}
          </p>
        </div>
      </div>

      {/* Portfolio Allocation Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Portfolio Allocation</span>
          <span className="text-sm text-gray-500">
            {formatValue(totalValue)} of {formatValue(totalPortfolioValue)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(percentageOfPortfolio, 100)}%` }}
          />
        </div>
      </div>

      {/* Additional Stats */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Average token value</span>
          <span className="font-medium text-gray-900">
            {tokenCount > 0 ? formatValue(totalValue / tokenCount) : '$0.00'}
          </span>
        </div>
      </div>
    </div>
  );
}
