import { create } from 'zustand';
import OneInchService from '@/services/oneinch';

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: number;
  price: number;
  value: number;
  
  // Enhanced metadata from Portfolio API
  logo?: string;
  protocol?: string;
  
  // Price and performance data
  priceChange24h?: number;
  priceChangePercent24h?: number;
  
  // Portfolio performance
  profitLoss?: number;
  profitLossPercent?: number;
  roi?: number;
  
  // Additional metadata
  balanceFormatted?: string;
  lastUpdated?: string;
}

interface ChainPortfolio {
  chainId: number;
  chainName: string;
  totalValue: number;
  tokens: Token[];
}

interface RebalancingSuggestion {
  token: string;
  action: 'buy' | 'sell';
  currentAllocation: number;
  targetAllocation: number;
  drift: number;
  suggestedAmount: number;
}

interface PortfolioState {
  // Portfolio data
  walletAddress: string | null;
  totalValue: number;
  chains: ChainPortfolio[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Target allocations
  targetAllocations: Record<string, number>;
  driftThreshold: number;

  // Rebalancing
  rebalancingSuggestions: RebalancingSuggestion[];
  needsRebalancing: boolean;
  maxDrift: number;

  // Chain display settings
  showAllChains: boolean;
  sortChainsByValue: boolean;

  // Actions
  setWalletAddress: (address: string) => void;
  fetchPortfolio: () => Promise<void>;
  setTargetAllocations: (allocations: Record<string, number>) => void;
  setDriftThreshold: (threshold: number) => void;
  generateRebalancingSuggestions: () => Promise<void>;
  clearError: () => void;
  toggleShowAllChains: () => void;
  toggleSortChainsByValue: () => void;
}

// Initialize 1inch service (will be updated when API key is available)
let oneInchService: OneInchService | null = null;

const initializeService = () => {
  const apiKey = process.env.NEXT_PUBLIC_ONEINCH_API_KEY;
  if (apiKey && apiKey !== 'your_hackathon_api_key_here') {
    oneInchService = new OneInchService({ apiKey });
    // Set global service for cache management
    const { setGlobalService } = require('@/services/oneinch');
    setGlobalService(oneInchService);
  }
};

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  // Initial state
  walletAddress: null,
  totalValue: 0,
  chains: [],
  isLoading: false,
  error: null,
  lastUpdated: null,

  // Chain display settings
  showAllChains: false,
  sortChainsByValue: true,

  // Target allocations (example: 50% ETH, 30% WBTC, 20% USDC)
  targetAllocations: {
    ETH: 50,
    WBTC: 30,
    USDC: 20,
  },
  driftThreshold: 5, // 5% drift threshold

  // Rebalancing state
  rebalancingSuggestions: [],
  needsRebalancing: false,
  maxDrift: 0,

  // Actions
  setWalletAddress: (address: string) => {
    set({ walletAddress: address });
  },

  fetchPortfolio: async () => {
    const { walletAddress } = get();
    if (!walletAddress) {
      set({ error: 'No wallet address provided' });
      return;
    }

    // Initialize service if not already done
    if (!oneInchService) {
      initializeService();
    }

    if (!oneInchService) {
      set({ error: '1inch API key not configured' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const portfolio = await oneInchService.getMultiChainPortfolio(walletAddress);
      
      set({
        totalValue: portfolio.totalValue,
        chains: portfolio.chains,
        isLoading: false,
        lastUpdated: new Date(),
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch portfolio',
        isLoading: false,
      });
    }
  },

  setTargetAllocations: (allocations: Record<string, number>) => {
    set({ targetAllocations: allocations });
  },

  setDriftThreshold: (threshold: number) => {
    set({ driftThreshold: threshold });
  },

  generateRebalancingSuggestions: async () => {
    const { walletAddress, targetAllocations, driftThreshold } = get();
    
    if (!walletAddress || !oneInchService) {
      set({ error: 'Wallet address or API service not available' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const result = await oneInchService.generateRebalancingSuggestions(
        walletAddress,
        targetAllocations,
        driftThreshold
      );

      set({
        rebalancingSuggestions: result.suggestions,
        needsRebalancing: result.needsRebalancing,
        maxDrift: result.maxDrift || 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to generate rebalancing suggestions',
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  toggleShowAllChains: () => {
    set((state) => ({ showAllChains: !state.showAllChains }));
  },

  toggleSortChainsByValue: () => {
    set((state) => ({ sortChainsByValue: !state.sortChainsByValue }));
  },
}));

// Auto-refresh portfolio every 30 seconds when wallet is connected
let refreshInterval: NodeJS.Timeout | null = null;

export const startPortfolioRefresh = () => {
  if (refreshInterval) clearInterval(refreshInterval);
  
  refreshInterval = setInterval(() => {
    const { walletAddress, fetchPortfolio } = usePortfolioStore.getState();
    if (walletAddress) {
      fetchPortfolio();
    }
  }, 30000); // 30 seconds
};

export const stopPortfolioRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};
