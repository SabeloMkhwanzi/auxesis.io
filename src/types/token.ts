// Chart data interfaces
export interface ChartDataPoint {
  timestamp: number;
  date: Date;
  price: number;
  value: number;
}

// Chart interval types
export type ChartInterval = '1h' | '4h' | '1d' | '7d' | '30d';

// Tab types for token detail page
export type TokenDetailTab = 'chart' | 'transactions' | 'analytics';

// Token interfaces
export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  balance: number; // Changed from string to number to match portfolio data
  balanceFormatted?: string; // Optional formatted version
  balanceUSD?: number;
  value: number;
  price: number;
  priceChange24h?: number;
  marketCap?: number;
}

// Portfolio-specific interfaces
export interface PortfolioToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: number;
  price: number;
  value: number;
  logo: string;
  protocol: string;
  profitLoss: number | null;
  profitLossPercent: number | null;
  roi: number | null;
  balanceFormatted: string;
  lastUpdated: string;
}

export interface ChainData {
  chainId: number;
  name: string;
  totalValue: number;
  tokens: PortfolioToken[];
}

export interface Chain {
  chainId: number;
  name: string;
  totalValue: number;
  tokenCount: number;
  percentageOfPortfolio: number;
  logo?: string;
}

// Token details from API
export interface TokenDetails {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  description?: string;
  website?: string;
  twitter?: string;
  github?: string;
  total_supply?: string;
  market_cap?: number;
  price?: number;
  price_change_24h?: number;
}

// Transaction interfaces
export interface Transaction {
  hash: string;
  timestamp: number;
  blockNumber: number;
  from: string;
  to: string;
  value: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  type: 'transfer' | 'swap' | 'mint' | 'burn';
  direction: 'in' | 'out';
  amount: string;
  amountUSD?: number;
  gasUsed?: string;
  gasPrice?: string;
}

// Transaction analytics interfaces
export interface TransactionAnalytics {
  totalTransactions: number;
  totalVolume: number;
  activityBreakdown: {
    swaps: number;
    transfers: number;
    approvals: number;
    other: number;
  };
  timelineData: Array<{
    date: string;
    count: number;
    volume: number;
  }>;
  recentTransactions: any[];
}

// 1inch Portfolio API History Metrics interfaces
export interface TokenBalance {
  token_address: string;
  amount: string;
  amount_usd: number;
}

export interface HistoryMetrics {
  index: string;
  profit_abs_usd: number | null;
  roi: number | null;
  weighted_apr: number | null;
  holding_time_days: number | null;
  rewards_tokens: TokenBalance[] | null;
  rewards_usd: number | null;
  claimed_fees: TokenBalance[] | null;
  unclaimed_fees: TokenBalance[] | null;
  impermanent_loss: TokenBalance[] | null;
  claimed_fees_usd: number | null;
  unclaimed_fees_usd: number | null;
  impermanent_loss_usd: number | null;
}

// Chain data interface (removed duplicate - using the one defined above with PortfolioToken[])

// Portfolio store interface
export interface PortfolioStore {
  walletAddress: string;
  chains: ChainData[];
  totalValueUSD: number;
  isLoading: boolean;
  lastUpdated: Date | null;
  setWalletAddress: (address: string) => void;
  fetchPortfolio: () => Promise<void>;
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChartApiResponse {
  prices: Array<[number, number]>;
  market_caps?: Array<[number, number]>;
  total_volumes?: Array<[number, number]>;
}

export interface HistoryApiResponse {
  events: Transaction[];
  hasMore: boolean;
  nextCursor?: string;
}

// Component prop interfaces
export interface TokenHeaderProps {
  token: Token;
  chainId: number;
  onBack: () => void;
}

export interface TokenStatsProps {
  token: Token;
  tokenDetails?: TokenDetails;
  priceChange?: number;
}

export interface TokenChartProps {
  chartData: ChartDataPoint[];
  selectedInterval: ChartInterval;
  onIntervalChange: (interval: ChartInterval) => void;
  isLoading: boolean;
}

export interface TokenTransactionsProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export interface TokenAnalyticsProps {
  analytics: TransactionAnalytics | null;
  isLoading: boolean;
}

export interface TokenInfoProps {
  tokenDetails: TokenDetails | null;
}
