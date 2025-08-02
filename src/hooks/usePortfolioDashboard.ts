import { useState, useEffect } from 'react';
import { usePortfolioStore } from '@/store/portfolio';
import { getChainName } from '@/utils/portfolioUtils';
import { DEMO_WALLET_ADDRESS } from '@/utils/constants';

interface ChainPortfolio {
  chainId: number;
  chainName: string;
  totalValue: number;
  tokens: any[];
}

interface Chain {
  chainId: number;
  name: string;
  totalValue: number;
  tokenCount: number;
  percentageOfPortfolio: number;
  logo?: string;
}

export interface UsePortfolioDashboardReturn {
  countdown: number;
  selectedChainId: number | null;
  manualWalletInput: string;
  selectedChainData: ChainPortfolio | null;
  selectedChainTokens: any[];
  selectedChainName: string;
  preparedChainData: Chain[];
  setSelectedChainId: (chainId: number | null) => void;
  setManualWalletInput: (input: string) => void;
  handleConnectDemo: () => void;
  handleManualWalletSubmit: () => void;
  handleFetchPortfolio: () => void;
  handleChainSelect: (chainId: number) => void;
  handleGenerateRebalancing: () => void;
}

export const usePortfolioDashboard = (): UsePortfolioDashboardReturn => {
  const [countdown, setCountdown] = useState(600);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
  const [manualWalletInput, setManualWalletInput] = useState('');
  
  const {
    walletAddress,
    totalValue,
    chains,
    isLoading,
    setWalletAddress,
    fetchPortfolio,
    generateRebalancingSuggestions,
    clearError,
  } = usePortfolioStore();
  
  const DEMO_WALLET = process.env.NEXT_PUBLIC_DEMO_WALLET_ADDRESS;

  useEffect(() => {
    if (!walletAddress) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          console.log('🔄 Auto-refreshing portfolio data...');
          fetchPortfolio();
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [walletAddress, fetchPortfolio]);

  useEffect(() => {
    if (chains.length > 0 && !selectedChainId) {
      const firstChainWithTokens = chains.find(chain => chain.tokens.length > 0);
      if (firstChainWithTokens) {
        setSelectedChainId(firstChainWithTokens.chainId);
      }
    }
  }, [chains, selectedChainId]);

  const getSelectedChainData = () => {
    if (!selectedChainId) return null;
    return chains.find(chain => chain.chainId === selectedChainId) || null;
  };

  const getSelectedChainTokens = () => {
    const chainData = getSelectedChainData();
    if (!chainData) return [];
    
    return chainData.tokens.map((token: any) => ({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals || 18,
      balance: token.balance,
      price: token.price,
      value: token.value,
      logo: token.logo || `data:image/svg+xml;base64,${btoa(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#E5E7EB"/>
          <text x="16" y="20" text-anchor="middle" fill="#6B7280" font-family="Arial" font-size="12" font-weight="bold">
            ${token.symbol?.slice(0, 2) || '??'}
          </text>
        </svg>
      `)}`,
      protocol: token.protocol || 'ERC20',
      profitLoss: token.profitLoss || 0,
      profitLossPercent: token.profitLossPercent || 0,
      roi: token.roi || 0,
      balanceFormatted: token.balanceFormatted || token.balance.toString(),
      lastUpdated: token.lastUpdated || new Date().toISOString()
    }));
  };

  const getPreparedChainData = () => {
    return chains.map(chainData => ({
      chainId: chainData.chainId,
      name: getChainName(chainData.chainId),
      totalValue: chainData.totalValue,
      tokenCount: chainData.tokens.length,
      percentageOfPortfolio: totalValue > 0 ? (chainData.totalValue / totalValue) * 100 : 0
    }));
  };

  const getSelectedChainName = () => {
    const chainData = getSelectedChainData();
    if (!chainData) return '';
    return getChainName(chainData.chainId);
  };

  const handleConnectDemo = () => {
    setWalletAddress(DEMO_WALLET_ADDRESS);
  };

  const handleManualWalletSubmit = () => {
    if (manualWalletInput.trim()) {
      setWalletAddress(manualWalletInput.trim());
      setManualWalletInput('');
    }
  };

  const handleFetchPortfolio = () => {
    if (walletAddress) {
      fetchPortfolio();
      setCountdown(600);
    }
  };

  const handleChainSelect = (chainId: number) => {
    setSelectedChainId(chainId);
  };

  const handleGenerateRebalancing = () => {
    generateRebalancingSuggestions();
  };

  return {
    countdown,
    selectedChainId,
    manualWalletInput,
    selectedChainData: getSelectedChainData(),
    selectedChainTokens: getSelectedChainTokens(),
    selectedChainName: getSelectedChainName(),
    preparedChainData: getPreparedChainData(),
    setSelectedChainId,
    setManualWalletInput,
    handleConnectDemo,
    handleManualWalletSubmit,
    handleFetchPortfolio,
    handleChainSelect,
    handleGenerateRebalancing,
  };
};
