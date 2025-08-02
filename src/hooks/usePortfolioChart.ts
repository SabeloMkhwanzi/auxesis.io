import { useState, useEffect } from 'react';
import OneInchService from '@/services/oneinch';

interface ChartDataPoint {
  timestamp: number;
  value: number;
  date: string;
}

// Map chart intervals to API timerange format
const mapIntervalToTimerange = (interval: string): string => {
  const mapping: Record<string, string> = {
    '1d': '1day',
    '7d': '7day', 
    '30d': '30day',
    '1day': '1day',
    '7day': '7day',
    '30day': '30day'
  };
  return mapping[interval] || '1day';
};

export const usePortfolioChart = (
  chainId: number,
  walletAddress: string,
  interval: string = '1d'
) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map UI intervals to API timerange format
  const getTimerange = (interval: string): string => {
    const mapping: Record<string, string> = {
      '1d': '1day',
      '7d': '1week',
      '30d': '1month',
      '90d': '3months',
      '1y': '1year'
    };
    return mapping[interval] || '1day';
  };

  useEffect(() => {
    if (!walletAddress || !chainId) {
      setChartData([]);
      return;
    }

    const fetchChartData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const oneInchService = new OneInchService({
          apiKey: process.env.NEXT_PUBLIC_ONEINCH_API_KEY || ''
        });
        const timerange = getTimerange(interval);
        const data = await oneInchService.getPortfolioChart(chainId, walletAddress, timerange);
        setChartData(data);
      } catch (err) {
        console.error('Error fetching portfolio chart:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch chart data');
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [chainId, walletAddress, interval]);

  return {
    chartData,
    isLoading,
    error
  };
};
