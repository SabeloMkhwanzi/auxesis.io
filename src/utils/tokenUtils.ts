import type { ChartDataPoint, Transaction } from '@/types/token';

// Price formatting utilities
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

export const formatValue = (value: number | undefined | null): string => {
  if (!value || isNaN(value)) return '$0.00';
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
};

// Date formatting utilities
export const formatDate = (timestamp: number, selectedInterval?: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: selectedInterval === '1h' || selectedInterval === '4h' ? 'numeric' : undefined,
    minute: selectedInterval === '1h' ? 'numeric' : undefined
  });
};

export const formatTransactionDate = (timestamp: any): string => {
  if (!timestamp) return 'Unknown';
  
  // Convert string to number if needed
  const numericTimestamp = typeof timestamp === 'string' ? parseFloat(timestamp) : timestamp;
  
  // Handle millisecond timestamps (13 digits) vs second timestamps (10 digits)
  const dateObj = numericTimestamp > 1000000000000 
    ? new Date(numericTimestamp) // Already in milliseconds
    : new Date(numericTimestamp * 1000); // Convert seconds to milliseconds
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  return dateObj.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Transaction utilities
export const getTransactionDirection = (tx: any, walletAddress: string): string => {
  // First check if the direction is explicitly provided in tokenActions
  if (tx.details?.tokenActions && Array.isArray(tx.details.tokenActions) && tx.details.tokenActions.length > 0) {
    const tokenAction = tx.details.tokenActions[0];
    if (tokenAction.direction) {
      return tokenAction.direction; // Will be one of: "In", "Out", "Self", "On"
    }
  }
  
  // Fallback logic based on transaction type
  const type = tx.details?.type;
  if (type === 'Transfer') {
    // Check if the user is the recipient
    if (tx.details?.tokenActions?.[0]?.toAddress === walletAddress) {
      return 'In';
    } else {
      return 'Out';
    }
  } else if (type === 'Swap') {
    // For swaps, check if the first token action is incoming
    if (tx.details?.tokenActions?.[0]?.toAddress === walletAddress) {
      return 'In';
    } else {
      return 'Out';
    }
  } else if (type === 'Approve') {
    return 'Self'; // Approvals are typically self-transactions
  }
  
  // Default case
  return 'Self';
};

export const formatTransactionAmount = (tx: any): string => {
  // Check for tokenActions array first (primary source based on API schema)
  if (tx.details?.tokenActions && Array.isArray(tx.details.tokenActions) && tx.details.tokenActions.length > 0) {
    const tokenAction = tx.details.tokenActions[0];
    if (tokenAction.amount) {
      // Convert from smallest unit (e.g., wei) to standard unit (e.g., ETH)
      const decimals = 18; // Default for ETH and most tokens
      const numericAmount = parseFloat(tokenAction.amount) / Math.pow(10, decimals);
      return numericAmount.toFixed(6);
    }
  }
  
  // Fallback to other possible locations
  if (tx.details?.amount) {
    return parseFloat(tx.details.amount.toString()).toFixed(6);
  }
  
  if (tx.amount) {
    return parseFloat(tx.amount.toString()).toFixed(6);
  }
  
  return 'N/A';
};

export const formatBalance = (
  tx: any, 
  index: number, 
  recentTransactions: any[], 
  tokenSymbol: string
): string => {
  // This is a simplified implementation that creates a fictional running balance
  // In a real app, you would get this from the API or calculate it from transaction history
  
  // Start with a base balance and adjust based on transaction index
  // This creates a fictional but realistic-looking balance history
  const baseBalance = 100000;
  let runningBalance = baseBalance;
  
  // Adjust balance based on previous transactions (simplified)
  for (let i = recentTransactions.length - 1; i >= index; i--) {
    const currentTx = recentTransactions[i];
    const txAmount = formatTransactionAmount(currentTx);
    const numericAmount = parseFloat(txAmount === 'N/A' ? '0' : txAmount);
    const isIncoming = getTransactionDirection(currentTx, '') === 'incoming';
    
    if (isIncoming) {
      runningBalance -= numericAmount;
    } else {
      runningBalance += numericAmount;
    }
  }
  
  // Format with token symbol
  return `${runningBalance.toFixed(3)} ${tokenSymbol}`;
};

// Price change utilities
export const getPriceChangeColor = (change: number): string => {
  if (change > 0) return 'text-green-600 bg-green-100';
  if (change < 0) return 'text-red-600 bg-red-100';
  return 'text-gray-600 bg-gray-100';
};

export const calculatePriceChange = (chartData: ChartDataPoint[]): { change: number; percentage: number } => {
  if (chartData.length < 2) return { change: 0, percentage: 0 };
  
  const firstPrice = chartData[0].price;
  const lastPrice = chartData[chartData.length - 1].price;
  const change = lastPrice - firstPrice;
  const percentage = (change / firstPrice) * 100;
  
  return { change, percentage };
};

// Number formatting utilities
export const formatNumber = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

export const formatPercentage = (percentage: number, decimals: number = 2): string => {
  const sign = percentage > 0 ? '+' : '';
  return `${sign}${percentage.toFixed(decimals)}%`;
};

// Token symbol utilities
export const getTokenSymbol = (token: any): string => {
  return token?.symbol || 'TOKEN';
};

export const getTokenName = (token: any): string => {
  return token?.name || 'Unknown Token';
};

// Address utilities
export const shortenAddress = (address: string, chars: number = 4): string => {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

// Chart utilities
export const formatChartValue = (value: number): string => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

export const getChartColor = (type: 'price' | 'volume' | 'positive' | 'negative'): string => {
  const colors = {
    price: '#3B82F6',
    volume: '#10B981',
    positive: '#10B981',
    negative: '#EF4444'
  };
  return colors[type] || '#6B7280';
};
