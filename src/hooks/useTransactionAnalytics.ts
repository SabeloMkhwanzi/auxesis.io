import { useState, useEffect } from 'react';
import { usePortfolioStore } from '@/store/portfolio';
import { tokenService } from '@/services/tokenService';
import { TransactionAnalytics } from '@/types/token';

export interface UseTransactionAnalyticsReturn {
  transactionAnalytics: TransactionAnalytics | null;
  recentTransactions: any[];
  isLoadingTransactions: boolean;
  walletAddress: string | null;
}

export const useTransactionAnalytics = (
  chainId: number, 
  tokenAddress: string,
  token: any
): UseTransactionAnalyticsReturn => {
  const [transactionAnalytics, setTransactionAnalytics] = useState<TransactionAnalytics | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Get wallet address from portfolio store
  useEffect(() => {
    const currentWalletAddress = usePortfolioStore.getState().walletAddress;
    setWalletAddress(currentWalletAddress);
  }, []);

  // Fetch transaction analytics
  const fetchTransactionAnalytics = async () => {
    if (!token || !walletAddress) {
      console.log('🔍 No token or wallet address found, skipping transaction analytics');
      return;
    }
    
    console.log('🚀 Starting transaction analytics fetch for:', {
      chainId,
      tokenAddress,
      tokenName: token.name,
      walletAddress
    });
    
    setIsLoadingTransactions(true);
    try {
      const analytics = await tokenService.fetchTransactionAnalytics(
        chainId,
        walletAddress,
        tokenAddress
      );
      
      console.log('✅ Transaction analytics received:', analytics);
      setTransactionAnalytics(analytics);
      setRecentTransactions(analytics?.recentTransactions || []); 
    } catch (error) {
      console.error('Error fetching transaction analytics:', error);
      setTransactionAnalytics(null);
      setRecentTransactions([]);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  useEffect(() => {
    if (token && walletAddress) {
      fetchTransactionAnalytics();
    }
  }, [token, walletAddress, chainId, tokenAddress]);

  return {
    transactionAnalytics,
    recentTransactions,
    isLoadingTransactions,
    walletAddress,
  };
};
