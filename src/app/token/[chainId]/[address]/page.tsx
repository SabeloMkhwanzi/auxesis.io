'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTokenData, useTransactionAnalytics } from '@/hooks';
import { CHAIN_NAMES } from '@/utils/constants';
import NavBar from '@/components/landing/NavBar';
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

  if (!token) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#559779] mx-auto mb-4"></div>
          <p className="text-white/70">Loading token details...</p>
        </div>
      </div>
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
        onBack={() => router.back()}
      />

      {/* Main Content Container */}
      <div className="pb-16">
        {/* Token Stats */}
        <TokenStats
          token={token}
          tokenDetails={tokenDetails}
        />

        {/* Token Chart Section */}
        <TokenChart
          chartData={chartData}
          isLoading={isLoadingChart}
          selectedInterval={selectedInterval}
          onIntervalChange={setSelectedInterval}
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
