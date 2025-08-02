'use client';

import React from 'react';
import { CHAIN_LOGOS } from '@/utils/constants';
import { formatCurrency, formatProfitLossPercentage, getPercentageColor } from '@/utils/portfolioUtils';
import { useTokenMetrics } from '@/hooks/useTokenMetrics';

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
  walletAddress: string;
}

export default function ChainSummary({
  chainId,
  chainName,
  totalValue,
  tokenCount,
  percentageOfPortfolio,
  totalPortfolioValue,
  profitLoss = 0,
  profitLossPercent = 0,
  isLoading = false,
  walletAddress
}: ChainSummaryProps) {

  const chainLogo = CHAIN_LOGOS[chainId] || '⚪';
  
  // Fetch real metrics data for this chain
  const { metrics, loading: metricsLoading, error } = useTokenMetrics(chainId, walletAddress);
  const metricsData = metrics?.[0]; // Get first metric if available
  
  // Use real profit data or fallback to 0
  const profitAbsUsd = metricsData?.profit_abs_usd ?? 0;
  const roi = metricsData?.roi ?? 0;
  
  // Format the profit values
  const isPositive = profitAbsUsd >= 0;
  const profitFormatted = `${isPositive ? '+' : ''}$${Math.abs(profitAbsUsd).toLocaleString()}`;
  const roiFormatted = `${roi > 0 ? '+' : ''}${(roi * 100).toFixed(2)}%`;

  if (isLoading) {
    return (
      <div>
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="rounded-full bg-white/20 h-10 w-10"></div>
            <div className="space-y-2">
              <div className="h-6 bg-white/20 rounded w-32"></div>
              <div className="h-4 bg-white/20 rounded w-24"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-white/20 rounded w-16"></div>
              <div className="h-6 bg-white/20 rounded w-20"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-white/20 rounded w-20"></div>
              <div className="h-6 bg-white/20 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Chain Header */}
      <div className="flex items-center space-x-2 mb-4">
        <img 
          src={chainLogo} 
          alt={`${chainName} logo`}
          className="w-6 h-6 rounded-full"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTggMTJDMTAuMjA5MSAxMiAxMiAxMC4yMDkxIDEyIDhDMTIgNS43OTA5IDEwLjIwOTEgNCA4IDRDNS43OTA5IDQgNCA1Ljc5MDkgNCA4QzQgMTAuMjA5MSA1Ljc5MDkgMTIgOCAxMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cjwvc3ZnPgo=';
          }}
        />
        <div>
          <h2 className="text-lg font-bold text-white">{chainName}</h2>
          <p className="text-xs text-white/50">Chain ID: {chainId}</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs font-medium text-white/70 mb-1">Total Value</p>
          <p className="text-xl font-bold text-white">{formatCurrency(totalValue)}</p>
        </div>
        
        <div>
          <p className="text-xs font-medium text-white/70 mb-1">Portfolio Allocation %</p>
          <p className="text-xl font-bold text-[#559779]">
            {percentageOfPortfolio.toFixed(1)}%
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-white/70 mb-1">Assets</p>
          <p className="text-xl font-bold text-white">
            {tokenCount}
          </p>
          <p className="text-xs text-white/50">
            {tokenCount === 1 ? 'token' : 'tokens'}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-white/70 mb-1">P&L</p>
          <p className={`text-xl font-bold ${
            metricsLoading ? 'text-white/50' : isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {metricsLoading ? '...' : roiFormatted}
          </p>
          <p className={`text-xs ${
            metricsLoading ? 'text-white/50' : isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {metricsLoading ? '...' : profitFormatted}
          </p>
        </div>
      </div>

      {/* Portfolio Allocation Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-white/70">Portfolio Allocation</span>
          <span className="text-xs text-white/50">
            {formatCurrency(totalValue)} of {formatCurrency(totalPortfolioValue)}
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#559779] to-[#559779]/80 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(percentageOfPortfolio, 100)}%` }}
          />
        </div>
      </div>

      {/* Additional Stats */}
      <div className="pt-3 border-t border-white/10">
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/50">Average token value</span>
          <span className="font-medium text-white">
            {tokenCount > 0 ? formatCurrency(totalValue / tokenCount) : '$0.00'}
          </span>
        </div>
      </div>
    </div>
  );
}
