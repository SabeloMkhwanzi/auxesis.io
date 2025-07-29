/**
 * Portfolio utility functions for formatting and calculations
 */

/**
 * Format currency values with proper locale formatting
 */
export const formatCurrency = (value: number): string => {
  if (value === 0) return '$0.00';
  if (value < 0.01) return '<$0.01';
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

/**
 * Format price values with appropriate precision for token prices
 */
export const formatPrice = (price: number): string => {
  if (price >= 1000) return `$${price.toFixed(0)}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(8)}`;
};

/**
 * Format countdown timer display
 */
export const formatCountdown = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format percentage values
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Format percentage values with sign for P&L display
 */
export const formatProfitLossPercentage = (percent: number): string => {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
};

/**
 * Get CSS color class for percentage values (P&L styling)
 */
export const getPercentageColor = (percent: number): string => {
  if (percent > 0) return 'text-green-600';
  if (percent < 0) return 'text-red-600';
  return 'text-gray-600';
};

/**
 * Get chain name from chain ID
 */
export const getChainName = (chainId: number): string => {
  const SUPPORTED_CHAINS = [
    { id: 1, name: 'Ethereum', symbol: 'ETH' },
    { id: 10, name: 'Optimism', symbol: 'OP' },
    { id: 56, name: 'BNB Chain', symbol: 'BNB' },
    { id: 100, name: 'Gnosis', symbol: 'xDAI' },
    { id: 137, name: 'Polygon', symbol: 'MATIC' },
    { id: 324, name: 'ZKsync Era', symbol: 'ETH' },
    { id: 8453, name: 'Base', symbol: 'ETH' },
    { id: 42161, name: 'Arbitrum', symbol: 'ETH' },
    { id: 43114, name: 'Avalanche', symbol: 'AVAX' },
    { id: 59144, name: 'Linea', symbol: 'ETH' },
    { id: 1101, name: 'Polygon zkEVM', symbol: 'ETH' },
    { id: 1329, name: 'Sei', symbol: 'SEI' },
  ];

  const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
  return chain ? chain.name : `Chain ${chainId}`;
};

/**
 * Get explorer URL for a given chain and transaction hash
 */
export const getExplorerUrl = (chainId: number, txHash: string): string => {
  // Import from constants to avoid duplication
  const { CHAIN_EXPLORERS } = require('@/utils/constants');
  
  const explorerBaseUrl = CHAIN_EXPLORERS[chainId] || 'https://etherscan.io';
  return `${explorerBaseUrl}/tx/${txHash}`;
};

/**
 * Generate fallback logo for tokens
 */
export const generateTokenLogo = (symbol: string): string => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#E5E7EB"/>
      <text x="16" y="20" text-anchor="middle" fill="#6B7280" font-family="Arial" font-size="12" font-weight="bold">
        ${symbol?.slice(0, 2) || '??'}
      </text>
    </svg>
  `)}`;
};

/**
 * Handle token image loading errors with fallback
 */
export const handleTokenImageError = (e: React.SyntheticEvent<HTMLImageElement>, symbol?: string): void => {
  const target = e.target as HTMLImageElement;
  target.src = generateTokenLogo(symbol || target.alt || 'TOKEN');
};

/**
 * Normalize token data with required properties
 */
export const normalizeTokenData = (token: any) => ({
  address: token.address,
  symbol: token.symbol,
  name: token.name,
  decimals: token.decimals || 18,
  balance: token.balance,
  price: token.price,
  value: token.value,
  logo: token.logo || generateTokenLogo(token.symbol),
  protocol: token.protocol || 'ERC20',
  profitLoss: token.profitLoss || 0,
  profitLossPercent: token.profitLossPercent || 0,
  roi: token.roi || 0,
  balanceFormatted: token.balanceFormatted || token.balance.toString(),
  lastUpdated: token.lastUpdated || new Date().toISOString()
});
