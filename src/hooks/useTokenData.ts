import { useState, useEffect } from 'react';
import { usePortfolioStore } from '@/store/portfolio';
import { tokenService } from '@/services/tokenService';
import { Token, TokenDetails, ChartDataPoint, ChartInterval } from '@/types/token';
import { CHART_INTERVALS } from '@/utils/constants';

export interface UseTokenDataReturn {
  token: Token | null;
  tokenDetails: TokenDetails | null;
  chartData: ChartDataPoint[];
  selectedInterval: ChartInterval;
  isLoadingChart: boolean;
  percentage: number;
  setSelectedInterval: (interval: ChartInterval) => void;
}

export const useTokenData = (chainId: number, tokenAddress: string): UseTokenDataReturn => {
  const { chains } = usePortfolioStore();
  
  const [token, setToken] = useState<Token | null>(null);
  const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<ChartInterval>(CHART_INTERVALS[2].value); // Default to 1D
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  const percentage = chartData.length > 1 
    ? ((chartData[chartData.length - 1].price - chartData[0].price) / chartData[0].price) * 100
    : 0;

  useEffect(() => {
    console.log('🔍 Looking for token:', { chainId, tokenAddress });
    
    const chainData = chains.find((chain: any) => chain.chainId === chainId);
    if (!chainData) {
      console.log('❌ Chain not found:', chainId);
      return;
    }

    const foundToken = chainData.tokens.find((t: any) => 
      t.address.toLowerCase() === tokenAddress.toLowerCase()
    );

    if (foundToken) {
      console.log('✅ Token found:', foundToken);
      setToken(foundToken); 
    } else {
      console.log('❌ Token not found in chain data');
    }
  }, [chains, chainId, tokenAddress]);

  const fetchTokenChart = async () => {
    if (!token) return;
    
    setIsLoadingChart(true);
    try {
      const data = await tokenService.fetchTokenChart(chainId, tokenAddress, selectedInterval);
      setChartData(data);
    } catch (error) {
      console.error('Error fetching token chart:', error);
    } finally {
      setIsLoadingChart(false);
    }
  };

  const fetchTokenDetails = async () => {
    if (!token) return;
    
    try {
      const details = await tokenService.fetchTokenDetails(chainId, tokenAddress);
      setTokenDetails(details);
    } catch (error) {
      console.error('Error fetching token details:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTokenChart();
      fetchTokenDetails();
    }
  }, [token, selectedInterval]);

  return {
    token,
    tokenDetails,
    chartData,
    selectedInterval,
    isLoadingChart,
    percentage,
    setSelectedInterval,
  };
};
