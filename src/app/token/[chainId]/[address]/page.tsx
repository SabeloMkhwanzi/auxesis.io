'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTokenData, useTransactionAnalytics } from '@/hooks';
import { CHAIN_NAMES } from '@/utils/constants';
import type { TokenDetailTab } from '@/types/token';
import {
  TokenHeader,
  TokenStats,
  TokenTabs,
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

 
  const [activeTab, setActiveTab] = useState<TokenDetailTab>('chart');

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading token details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Token Header */}
      <TokenHeader
        token={token}
        chainId={chainId}
        priceChangePercentage={percentage}
        onBack={() => router.back()}
      />

      {/* Token Stats */}
      <TokenStats
        token={token}
        tokenDetails={tokenDetails}
      />

      {/* Token Tabs */}
      <TokenTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      {activeTab === 'chart' && (
        <TokenChart
          chartData={chartData}
          isLoading={isLoadingChart}
          selectedInterval={selectedInterval}
          onIntervalChange={setSelectedInterval}
        />
      )}

      {activeTab === 'transactions' && (
        <TokenTransactions
          transactions={recentTransactions}
          isLoading={isLoadingTransactions}
          walletAddress={walletAddress || ''}
          token={token}
          chainId={chainId}
        />
      )}

      {activeTab === 'analytics' && (
        <TokenAnalytics
          analytics={transactionAnalytics}
          isLoading={isLoadingTransactions}
        />
      )}

      {/* Token Info */}
      <TokenInfo
        tokenDetails={tokenDetails}
      />
    </div>
  );
}
