import { useState, useEffect } from 'react';
import OneInchService from '@/services/oneinch';

interface TokenMetrics {
  index: string;
  profit_abs_usd: number | null;
  roi: number | null;
  weighted_apr: number | null;
  holding_time_days: number | null;
  rewards_usd: number | null;
  claimed_fees_usd: number | null;
  unclaimed_fees_usd: number | null;
  impermanent_loss_usd: number | null;
}

interface UseTokenMetricsResult {
  metrics: TokenMetrics[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTokenMetrics = (chainId: number, walletAddress: string, timerange: string = '1year'): UseTokenMetricsResult => {
  const [metrics, setMetrics] = useState<TokenMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiKey = process.env.NEXT_PUBLIC_ONEINCH_API_KEY;
      if (!apiKey) {
        throw new Error('1inch API key not found');
      }

      const oneInchService = new OneInchService({ apiKey });
      const response = await oneInchService.getTokenMetrics(chainId, walletAddress, timerange);
      
      if (response?.result) {
        setMetrics(response.result);
      } else {
        setMetrics([]);
      }
    } catch (err) {
      console.error('Error fetching token metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch token metrics');
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chainId) {
      fetchMetrics();
    }
  }, [chainId, timerange]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics
  };
};

export default useTokenMetrics;
