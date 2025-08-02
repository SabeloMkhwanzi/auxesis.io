// Chain configuration constants
export const CHAIN_NAMES: { [key: number]: string } = {
  1: 'Ethereum',
  42161: 'Arbitrum',
  43114: 'Avalanche',
  56: 'BNB Chain',
  100: 'Gnosis',
  146: 'Sonic',
  10: 'Optimism',
  137: 'Polygon',
  8453: 'Base',
  130: 'Unichain',
  324: 'ZKsync Era',
  59144: 'Linea',
};

export const CHAIN_EXPLORERS: { [key: number]: string } = {
  1: 'https://etherscan.io',
  42161: 'https://arbiscan.io',
  43114: 'https://snowtrace.io',
  56: 'https://bscscan.com',
  100: 'https://gnosisscan.io',
  146: 'https://explorer.soniclabs.com',
  10: 'https://optimistic.etherscan.io',
  137: 'https://polygonscan.com',
  8453: 'https://basescan.org',
  130: 'https://unichain.blockscout.com', 
  324: 'https://explorer.zksync.io',
  59144: 'https://lineascan.build'
};

// Chain logos from CoinGecko
export const CHAIN_LOGOS: Record<number, string> = {
  1: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', // Ethereum
  10: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png', // Optimism
  56: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png', // BSC
  100: 'https://assets.coingecko.com/coins/images/662/small/logo_square_simple_300px.png', // Gnosis
  137: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png', // Polygon
  324: 'https://coin-images.coingecko.com/asset_platforms/images/121/small/zksync.jpeg?1706606814', // zkSync
  8453: 'https://coin-images.coingecko.com/asset_platforms/images/131/small/base-network.png?1720533039', // Base (uses ETH logo)
  42161: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg', // Arbitrum
  43114: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png', // Avalanche
  59144: 'https://coin-images.coingecko.com/asset_platforms/images/135/small/linea.jpeg?1706606705', // Linea (uses ETH logo)
  130: 'https://coin-images.coingecko.com/asset_platforms/images/22206/small/unichain.png?1739323630', // Unichain (uses ETH logo)
  146: 'https://coin-images.coingecko.com/asset_platforms/images/22192/small/128xS_token_Black-BG_2x.png?1735963719g', // Sonic (uses ETH logo)
};

// 1inch API Configuration
export const ONEINCH_API_CONFIG = {
  BASE_URL: '/api/proxy',
  VERSIONS: {
    PORTFOLIO: 'portfolio/portfolio/v4',
    SWAP: 'swap/v6.0',
    SPOT_PRICE: 'price/v1.1',
    BALANCE: 'balance/v1.2',
    TOKEN: 'token/v1.2',
    TOKEN_DETAILS: 'token-details/v1.0',
    HISTORY: 'history/v2.0',
  },
  CACHE_TIMEOUT: 5 * 60 * 1000, // 5 minutes
} as const;

// CoinGecko API Configuration
export const COINGECKO_API_CONFIG = {
  BASE_URL: 'https://api.coingecko.com/api/v3',
  API_KEY: process.env.NEXT_PUBLIC_COINGECKO_API_KEY, // Set in .env.local
  ENDPOINTS: {
    COIN_BY_CONTRACT: '/coins/{id}/contract/{contract_address}',
    COIN_INFO: '/coins/{id}',
  },
  CACHE_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours for token logos
  // Fallback to free tier without API key if not provided
  USE_FREE_TIER: !process.env.NEXT_PUBLIC_COINGECKO_API_KEY,
} as const;

// Chain ID to CoinGecko platform mapping
export const CHAIN_TO_COINGECKO_PLATFORM: Record<number, string> = {
  1: 'ethereum',
  56: 'binance-smart-chain',
  137: 'polygon-pos',
  42161: 'arbitrum-one',
  10: 'optimistic-ethereum',
  43114: 'avalanche',
  8453: 'base',
  324: 'zksync',
  100: 'xdai',
  59144: 'linea',
  146: 'sonic',
  130: 'unichain'
};

// Supported chains configuration
export const SUPPORTED_CHAINS = {
  1: { id: 1, name: 'Ethereum', rpc: 'https://eth.llamarpc.com' },
  42161: { id: 42161, name: 'Arbitrum', rpc: 'https://arb1.arbitrum.io/rpc' },
  56: { id: 56, name: 'BNB Chain', rpc: 'https://bsc-dataseed.binance.org/' },
  100: { id: 100, name: 'Gnosis', rpc: 'https://rpc.gnosischain.com/' },
  10: { id: 10, name: 'Optimism', rpc: 'https://mainnet.optimism.io' },
  146: { id: 146, name: 'Sonic', rpc: 'https://rpc.soniclabs.com' },
  137: { id: 137, name: 'Polygon', rpc: 'https://polygon-rpc.com' },
  8453: { id: 8453, name: 'Base', rpc: 'https://mainnet.base.org' },
  324: { id: 324, name: 'ZKsync Era', rpc: 'https://mainnet.era.zksync.io' },
  59144: { id: 59144, name: 'Linea', rpc: 'https://mainnet.linea.build' },
  43114: { id: 43114, name: 'Avalanche', rpc: 'https://api.avax.network/ext/bc/C/rpc' },
  130: { id: 130, name: 'Unichain', rpc: 'https://mainnet.unichain.world' },
} as const;

export type ChainId = keyof typeof SUPPORTED_CHAINS;

// Chart interval options
export const CHART_INTERVALS = [
  { value: '1h' as const, label: '1H' },
  { value: '4h' as const, label: '4H' },
  { value: '1d' as const, label: '1D' },
  { value: '7d' as const, label: '7D' },
  { value: '30d' as const, label: '30D' },
];

// Tab options for token detail page
export const TOKEN_DETAIL_TABS = [
  { value: 'chart' as const, label: 'Chart', icon: 'TrendingUp' },
  { value: 'transactions' as const, label: 'Transactions', icon: 'Activity' },
  { value: 'analytics' as const, label: 'Analytics', icon: 'BarChart3' },
];

// Demo wallet address fallback
export const DEMO_WALLET_ADDRESS = (process.env.NEXT_PUBLIC_DEMO_WALLET_ADDRESS || '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72') as string;

// API endpoints and configuration
export const API_CONFIG = {
  HISTORY_ENDPOINT: '/api/history',
  CHART_ENDPOINT: '/api/chart',
  TOKEN_DETAILS_ENDPOINT: '/api/token-details',
  DEFAULT_LIMIT: 50,
  REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutes
};

// Chart colors for different data series
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  GRAY: '#6B7280',
};

// Transaction type colors
export const TRANSACTION_COLORS = {
  BUY: '#10B981',
  SELL: '#EF4444',
  TRANSFER_IN: '#3B82F6',
  TRANSFER_OUT: '#F59E0B',
  SWAP: '#8B5CF6',
};
