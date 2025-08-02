'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTokenData, useTransactionAnalytics, useHistoryMetrics, usePortfolioChart } from '@/hooks';
import { CHAIN_NAMES } from '@/utils/constants';
import NavBar from '@/components/landing/NavBar';
import { NavigationLoader } from '@/components/ui/NavigationLoader';
import {
  TokenHeader,
  TokenStats,
  TokenChart,
  TokenTransactions,
  TokenAnalytics,
  TokenInfo
} from '@/components/token';

export default function TokenDetailPage() {
  const params = useParams();
  const router = useRouter();
  
 
  const chainIdParam = params?.chainId;
  const addressParam = params?.address;
  
 
  const chainId = chainIdParam && typeof chainIdParam === 'string' ? parseInt(chainIdParam) : 0;
  const tokenAddress = addressParam && typeof addressParam === 'string' ? addressParam : '';
  
 
  const {
    token,
    tokenDetails,
    chartData,
    selectedInterval,
    isLoadingChart,
    percentage,
    setSelectedInterval,
  } = useTokenData(chainId, tokenAddress);

  const {
    transactionAnalytics,
    recentTransactions,
    isLoadingTransactions,
    walletAddress,
  } = useTransactionAnalytics(chainId, tokenAddress, token);

  const {
    historyMetrics,
    isLoading: isLoadingHistoryMetrics,
    error: historyMetricsError
  } = useHistoryMetrics(chainId, tokenAddress);

  // Get portfolio chart data (wallet value over time) - this is real data
  const {
    chartData: portfolioChartData,
    isLoading: isLoadingPortfolioChart,
    error: portfolioChartError
  } = usePortfolioChart(chainId, walletAddress || '', selectedInterval);

  // Use real portfolio data with proper structure for chart
  const chartDataToUse = portfolioChartData.map(point => ({
    ...point,
    price: point.value, // Use value as price for portfolio data
    date: new Date(point.timestamp)
  }));
  
  // Log errors for debugging
  if (portfolioChartError) {
    console.warn('Portfolio chart API error:', portfolioChartError);
  }

  if (!token) {
    return (
      <>
        <div className="min-h-screen bg-[#1F1F1F] text-white">
          <NavBar />
        </div>
        <NavigationLoader 
          isLoading={true} 
          message="Loading token details..." 
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F] text-white">
      {/* Navigation Bar */}
      <NavBar />
      
      {/* Token Header */}
      <TokenHeader
        token={token}
        chainId={chainId}
        priceChangePercentage={percentage}
        historyMetrics={historyMetrics}
        onBack={() => router.back()}
      />

      {/* Main Content Container */}
      <div className="pb-16">
        {/* Token Stats - Commented out for now */}
        {/*
        <TokenStats
          token={token}
          tokenDetails={tokenDetails}
          historyMetrics={historyMetrics}
        />
        */}

        {/* Token Chart Section - Portfolio Value Over Time (Real Data) */}
        <TokenChart
          chartData={chartDataToUse}
          isLoading={isLoadingPortfolioChart}
          selectedInterval={selectedInterval}
          onIntervalChange={setSelectedInterval}
          token={token}
        />

        {/* Transaction History Section */}
        <TokenTransactions
          transactions={recentTransactions}
          isLoading={isLoadingTransactions}
          walletAddress={walletAddress || ''}
          token={token}
          chainId={chainId}
        />

        {/* Token Analytics Section */}
        <TokenAnalytics
          analytics={transactionAnalytics}
          isLoading={isLoadingTransactions}
        />

        {/* Token Info */}
        <TokenInfo
          tokenDetails={tokenDetails}
        />
      </div>
    </div>
  );
}
