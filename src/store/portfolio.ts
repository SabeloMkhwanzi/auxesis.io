import { create } from 'zustand';
import OneInchService from '@/services/oneinch';
import type { MultiChainPortfolio, ChainPortfolio as ServiceChainPortfolio, ProcessedToken } from '@/services/portfolioProcessingService';

// Use the ProcessedToken from the service as our Token type
type Token = ProcessedToken;

// Use the ChainPortfolio from the service
type ChainPortfolio = ServiceChainPortfolio;

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
  lastUpdated: number | null; // Timestamp when data was last fetched
  rebalancingSuggestions: RebalancingSuggestion[];
  needsRebalancing: boolean;
  maxDrift: number;

  // Target allocations and drift settings
  targetAllocations: Record<string, number>;
  driftThreshold: number;

  // Chain display settings
  showAllChains: boolean;
  sortChainsByValue: boolean;

  // Actions
  setWalletAddress: (address: string) => void;
  clearPortfolio: () => void;
  fetchPortfolio: () => Promise<void>;
  setTargetAllocations: (allocations: Record<string, number>) => void;
  setDriftThreshold: (threshold: number) => void;
  generateRebalancingSuggestions: () => Promise<void>;
  clearError: () => void;
  toggleShowAllChains: () => void;
  toggleSortChainsByValue: () => void;
  
  // Data freshness utilities
  getDataAge: () => number | null; // Returns age in minutes
  isDataStale: (thresholdMinutes?: number) => boolean;
  refreshIfStale: (thresholdMinutes?: number) => Promise<void>;
}

// Initialize 1inch service (will be updated when API key is available)
let oneInchService: OneInchService | null = null;

const initializeService = () => {
  const apiKey = process.env.NEXT_PUBLIC_ONEINCH_API_KEY;
  if (apiKey && apiKey !== 'your_hackathon_api_key_here') {
    oneInchService = new OneInchService({ apiKey });
    // Service is now self-contained with no global state
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

  clearPortfolio: () => {
    set({
      walletAddress: null,
      totalValue: 0,
      chains: [],
      isLoading: false,
      error: null,
      lastUpdated: null,
      rebalancingSuggestions: [],
      needsRebalancing: false,
      maxDrift: 0,
    });
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
        lastUpdated: Date.now(), // Use timestamp instead of Date object
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

  // Data freshness utilities
  getDataAge: () => {
    const { lastUpdated } = get();
    if (!lastUpdated) return null;
    return Math.floor((Date.now() - lastUpdated) / (1000 * 60)); // Age in minutes
  },

  isDataStale: (thresholdMinutes = 5) => {
    const { getDataAge } = get();
    const age = getDataAge();
    return age === null || age >= thresholdMinutes;
  },

  refreshIfStale: async (thresholdMinutes = 5) => {
    const { isDataStale, fetchPortfolio } = get();
    if (isDataStale(thresholdMinutes)) {
      await fetchPortfolio();
    }
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
