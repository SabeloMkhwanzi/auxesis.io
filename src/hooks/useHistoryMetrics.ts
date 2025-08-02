import { useState, useEffect } from 'react';
import { usePortfolioStore } from '@/store/portfolio';
import type { HistoryMetrics } from '@/types/token';

export const useHistoryMetrics = (chainId: number, tokenAddress: string) => {
  const [historyMetrics, setHistoryMetrics] = useState<HistoryMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { chains } = usePortfolioStore();

  useEffect(() => {
    const extractHistoryMetrics = () => {
      if (!tokenAddress || !chainId || !chains.length) {
        setHistoryMetrics(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Find the specific chain
        const targetChain = chains.find(chain => chain.chainId === chainId);
        if (!targetChain) {
          setHistoryMetrics(null);
          setIsLoading(false);
          return;
        }

        // Find the specific token in that chain
        const targetToken = targetChain.tokens.find(
          token => token.address.toLowerCase() === tokenAddress.toLowerCase()
        );

        if (!targetToken) {
          setHistoryMetrics(null);
          setIsLoading(false);
          return;
        }

        // Extract history metrics from the portfolio token data
        const metrics: HistoryMetrics = {
          index: `${chainId}_${tokenAddress}`,
          profit_abs_usd: targetToken.profitLoss ?? null,
          roi: targetToken.roi ?? null,
          weighted_apr: null, // Not available in portfolio API
          holding_time_days: null, // Not available in portfolio API
          rewards_tokens: null, // Not available in portfolio API
          rewards_usd: null, // Not available in portfolio API
          claimed_fees: null, // Not available in portfolio API
          unclaimed_fees: null, // Not available in portfolio API
          impermanent_loss: null, // Not available in portfolio API
          claimed_fees_usd: null, // Not available in portfolio API
          unclaimed_fees_usd: null, // Not available in portfolio API
          impermanent_loss_usd: null, // Not available in portfolio API
        };

        setHistoryMetrics(metrics);
      } catch (err) {
        console.error('Error extracting history metrics:', err);
        setError(err instanceof Error ? err.message : 'Failed to extract history metrics');
        setHistoryMetrics(null);
      } finally {
        setIsLoading(false);
      }
    };

    extractHistoryMetrics();
  }, [chains, chainId, tokenAddress]);

  return {
    historyMetrics,
    isLoading,
    error
  };
};
