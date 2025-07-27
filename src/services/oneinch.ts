import axios from 'axios';

// 1inch API Configuration - use our proxy to avoid CORS
const ONEINCH_API_BASE = '/api/proxy';
const PORTFOLIO_API_VERSION = 'portfolio/portfolio/v4';
const SWAP_API_VERSION = 'swap/v6.0';
const SPOT_PRICE_API_VERSION = 'price/v1.1';
const BALANCE_API_VERSION = 'balance/v1.2';
const TOKEN_API_VERSION = 'token/v1.2';

// All supported chains from 1inch Portfolio API
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
  1301: { id: 1301, name: 'Unichain', rpc: 'https://mainnet.unichain.world' },
} as const;

export type ChainId = keyof typeof SUPPORTED_CHAINS;

interface OneInchApiConfig {
  apiKey: string;
  baseUrl?: string;
}

class OneInchService {
  private apiKey: string;
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes cache

  constructor(config: OneInchApiConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || ONEINCH_API_BASE;
  }

  // Clear cache when needed (e.g., manual refresh)
  clearCache() {
    this.cache.clear();
    console.log('🧹 API cache cleared');
  }

  // Get cache stats for monitoring
  getCacheStats() {
    const now = Date.now();
    const validEntries = Array.from(this.cache.values()).filter(
      entry => now - entry.timestamp < this.cacheTimeout
    ).length;
    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries: this.cache.size - validEntries
    };
  }

  private async makeRequest(endpoint: string, params?: Record<string, any>) {
    try {
      // Create cache key from endpoint and params
      const cacheKey = `${endpoint}:${JSON.stringify(params || {})}`;
      
      // Check cache first
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log(`🚀 Cache hit for ${endpoint}`);
        return cached.data;
      }

      const url = new URL(`/api/proxy/${endpoint}`, window.location.origin);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      console.log(`📡 API request to ${endpoint}`);
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error('1inch API Error:', error);
      throw error;
    }
  }

  // Token Prices API
  async getTokenPrices(chainId: number, tokenAddresses: string[]) {
    const addresses = tokenAddresses.join(',');
    return this.makeRequest(`${SWAP_API_VERSION}/${chainId}/tokens/prices`, {
      addresses,
    });
  }

  // Balance API for individual token holdings
  async getWalletBalances(chainId: number, walletAddress: string) {
    return this.makeRequest(`${BALANCE_API_VERSION}/${chainId}/balances/${walletAddress}`);
  }

  // Alternative: Get aggregated balances with allowances
  async getAggregatedBalances(chainId: number, walletAddress: string) {
    return this.makeRequest(`${BALANCE_API_VERSION}/${chainId}/aggregatedBalancesAndAllowances/${walletAddress}`);
  }

  // Get token details using Portfolio API v4 - this gives us individual tokens with proper names
  async getTokenDetails(chainId: number, walletAddress: string) {
    const endpoint = `portfolio/portfolio/v4/overview/erc20/details`;
    const params = new URLSearchParams({
      addresses: walletAddress,
      chain_id: chainId.toString(),
      timerange: '1week',
      closed: 'true',
      closed_threshold: '1',
      use_cache: 'true'
    });
    return this.makeRequest(`${endpoint}?${params}`);
  }

  async getProfitAndLoss(chainId: number, walletAddress: string, fromTimestamp?: string, toTimestamp?: string) {
    const params: any = {
      addresses: walletAddress,
      chain_id: chainId,
    };
    
    // Add timestamps if provided (for historical PnL)
    if (fromTimestamp) params.from_timestamp = fromTimestamp;
    if (toTimestamp) params.to_timestamp = toTimestamp;
    
    return this.makeRequest(`${PORTFOLIO_API_VERSION}/overview/erc20/profit_and_loss`, params);
  }

  // 1inch Token API for comprehensive token metadata
  async searchTokens(chainId: number, query: string, limit: number = 10) {
    return this.makeRequest(`${TOKEN_API_VERSION}/${chainId}/search`, {
      query,
      limit,
      ignore_listed: 'false'
    });
  }

  async getTokensInfo(chainId: number, addresses: string[]) {
    const addressList = addresses.join(',');
    return this.makeRequest(`${TOKEN_API_VERSION}/${chainId}/custom/${addressList}`);
  }

  async getAllTokensInfo(chainId: number, provider: string = '1inch') {
    return this.makeRequest(`${TOKEN_API_VERSION}/${chainId}`, {
      provider
    });
  }

  async get1inchTokenList(chainId: number, provider: string = '1inch') {
    return this.makeRequest(`${TOKEN_API_VERSION}/${chainId}/token-list`, {
      provider
    });
  }

  // Classic Swap API - Get Quote
  async getSwapQuote(
    chainId: number,
    fromToken: string,
    toToken: string,
    amount: string,
    slippage: number = 1
  ) {
    return this.makeRequest(`${SWAP_API_VERSION}/${chainId}/quote`, {
      src: fromToken,
      dst: toToken,
      amount,
      slippage,
    });
  }

  // Classic Swap API - Execute Swap
  async getSwapTransaction(
    chainId: number,
    fromToken: string,
    toToken: string,
    amount: string,
    fromAddress: string,
    slippage: number = 1
  ) {
    return this.makeRequest(`${SWAP_API_VERSION}/${chainId}/swap`, {
      src: fromToken,
      dst: toToken,
      amount,
      from: fromAddress,
      slippage,
    });
  }

  // General Portfolio Overview API
  async getGeneralPortfolioValue(walletAddress: string) {
    return this.makeRequest(`${PORTFOLIO_API_VERSION}/general/current_value`, {
      addresses: walletAddress,
    });
  }

  // Get real individual token holdings using Portfolio API v4
  async getPortfolioValue(chainId: number, walletAddress: string) {
    try {
      // Check if this chain is supported by Portfolio API
      const supportedChains = [1, 10, 56, 100, 137, 324, 8453, 42161, 43114, 59144, 1101, 1329]; // Known supported chains
      
      if (!supportedChains.includes(chainId)) {
        console.log(`Chain ${chainId} not supported, skipping`);
        return { totalValue: 0, tokens: [] };
      }

      // Use Portfolio API v4 for token details - this gives us individual tokens with proper names
      const [tokenDetailsData, tokenListData] = await Promise.all([
        this.getTokenDetails(chainId, walletAddress).catch((error) => {
          console.warn(`Portfolio API failed for chain ${chainId}:`, error.message);
          return null;
        }),
        this.get1inchTokenList(chainId).catch((error) => {
          console.warn(`Token list API failed for chain ${chainId}:`, error.message);
          return null;
        })
      ]);
      
      if (!tokenDetailsData) {
        return { totalValue: 0, tokens: [] };
      }

      // Process Portfolio API v4 response to get individual token holdings
      const tokens: any[] = [];
      let totalValue = 0;

      // Create token metadata map from 1inch token list
      const tokenMetadataMap = new Map();
      if (tokenListData?.tokens) {
        Object.entries(tokenListData.tokens).forEach(([address, tokenInfo]: [string, any]) => {
          tokenMetadataMap.set(address.toLowerCase(), {
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            decimals: tokenInfo.decimals,
            logoURI: tokenInfo.logoURI,
            address: address
          });
        });
      }

      // Process Portfolio API v4 token details response
      if (tokenDetailsData?.result && Array.isArray(tokenDetailsData.result)) {
        tokenDetailsData.result.forEach((tokenDetail: any) => {
          if (tokenDetail.chain_id === chainId) {
            // Get token metadata from 1inch token list
            const tokenAddress = tokenDetail.contract_address?.toLowerCase();
            const tokenMetadata = tokenAddress ? tokenMetadataMap.get(tokenAddress) : null;
            
            // Create proper token entry with real names like USDC, DAI, WETH
            const token = {
              address: tokenDetail.contract_address || `unknown_${chainId}`,
              symbol: tokenDetail.symbol || tokenMetadata?.symbol || 'UNKNOWN',
              name: tokenDetail.name || tokenMetadata?.name || 'Unknown Token',
              decimals: tokenMetadata?.decimals || 18,
              balance: tokenDetail.amount || 0,
              price: tokenDetail.price_to_usd || 0,
              value: tokenDetail.value_usd || 0,
              
              // Enhanced metadata from Token API
              logo: tokenMetadata?.logoURI || this.getDefaultTokenLogo(tokenDetail.symbol || 'UNKNOWN'),
              protocol: 'ERC20',
              
              // Portfolio performance data from API
              profitLoss: tokenDetail.abs_profit_usd || 0,
              profitLossPercent: tokenDetail.roi ? (tokenDetail.roi * 100) : 0,
              roi: tokenDetail.roi || 0,
              
              // Additional metadata
              balanceFormatted: this.formatTokenBalance(tokenDetail.amount || 0, tokenMetadata?.decimals || 18),
              lastUpdated: new Date().toISOString(),
            };
            
            // Only add tokens with positive value
            if (token.value > 0) {
              tokens.push(token);
              totalValue += token.value;
            }
          }
        });
      }

      return { totalValue, tokens };
    } catch (error) {
      console.error(`Error fetching portfolio for chain ${chainId}:`, error);
      return { totalValue: 0, tokens: [] };
    }
  }

  // Multi-chain portfolio aggregation
  async getMultiChainPortfolio(walletAddress: string) {
    const portfolios = await Promise.all(
      Object.entries(SUPPORTED_CHAINS).map(async ([chainKey, chain]) => {
        try {
          const portfolio = await this.getPortfolioValue(chain.id, walletAddress);
          return {
            chainId: chain.id,
            chainName: chain.name,
            ...portfolio,
          };
        } catch (error) {
          console.error(`Error fetching portfolio for ${chain.name}:`, error);
          return {
            chainId: chain.id,
            chainName: chain.name,
            totalValue: 0,
            tokens: [],
          };
        }
      })
    );

    const totalValue = portfolios.reduce((sum, p) => sum + p.totalValue, 0);
    
    return {
      totalValue,
      chains: portfolios,
    };
  }

  // Rebalancing calculations
  calculatePortfolioDrift(
    currentAllocations: Record<string, number>,
    targetAllocations: Record<string, number>
  ) {
    const drifts: Record<string, number> = {};
    let maxDrift = 0;

    Object.keys(targetAllocations).forEach(token => {
      const current = currentAllocations[token] || 0;
      const target = targetAllocations[token];
      const drift = Math.abs(current - target);
      drifts[token] = drift;
      maxDrift = Math.max(maxDrift, drift);
    });

    return { drifts, maxDrift };
  }

  // Generate rebalancing suggestions
  async generateRebalancingSuggestions(
    walletAddress: string,
    targetAllocations: Record<string, number>,
    driftThreshold: number = 5 // 5% drift threshold
  ) {
    const portfolio = await this.getMultiChainPortfolio(walletAddress);
    
    // Calculate current allocations
    const currentAllocations: Record<string, number> = {};
    portfolio.chains.forEach(chain => {
      chain.tokens.forEach(token => {
        const allocation = (token.value / portfolio.totalValue) * 100;
        currentAllocations[token.symbol] = (currentAllocations[token.symbol] || 0) + allocation;
      });
    });

    const { drifts, maxDrift } = this.calculatePortfolioDrift(currentAllocations, targetAllocations);

    if (maxDrift < driftThreshold) {
      return { needsRebalancing: false, suggestions: [] };
    }

    // Generate rebalancing suggestions
    const suggestions = Object.entries(drifts)
      .filter(([_, drift]) => drift >= driftThreshold)
      .map(([token, drift]) => {
        const current = currentAllocations[token] || 0;
        const target = targetAllocations[token];
        const action: 'sell' | 'buy' = current > target ? 'sell' : 'buy';
        const amount = Math.abs(current - target);

        return {
          token,
          action,
          currentAllocation: current,
          targetAllocation: target,
          drift,
          suggestedAmount: (amount / 100) * portfolio.totalValue,
        };
      });

    return {
      needsRebalancing: true,
      maxDrift,
      suggestions,
      portfolioValue: portfolio.totalValue,
    };
  }

  // Helper method to process individual token balance data
  private processTokenBalance(
    tokenBalance: any,
    tokenMetadataMap: Map<string, any>,
    tokens: any[],
    chainId: number
  ) {
    if (!tokenBalance || !tokenBalance.address) return;
    
    const tokenAddress = tokenBalance.address.toLowerCase();
    const balance = parseFloat(tokenBalance.balance || tokenBalance.amount || '0');
    
    // Skip tokens with zero balance
    if (balance <= 0) return;
    
    // Get token metadata from 1inch token list
    const tokenMetadata = tokenMetadataMap.get(tokenAddress) || {};
    
    // Calculate token value (balance * price)
    const price = parseFloat(tokenBalance.price_usd || tokenBalance.price || '0');
    const value = balance * price;
    
    // Create proper token entry with real names like USDC, DAI, WETH
    tokens.push({
      address: tokenBalance.address,
      symbol: tokenMetadata.symbol || tokenBalance.symbol || 'UNKNOWN',
      name: tokenMetadata.name || tokenBalance.name || tokenMetadata.symbol || 'Unknown Token',
      decimals: tokenMetadata.decimals || tokenBalance.decimals || 18,
      balance: balance,
      price: price,
      value: value,
      
      // Enhanced metadata from Token API
      logo: tokenMetadata.logoURI || this.getDefaultTokenLogo(tokenMetadata.symbol || tokenBalance.symbol || 'UNKNOWN'),
      protocol: 'ERC20', // Individual tokens are ERC20
      
      // Price and performance data (if available)
      priceChange24h: parseFloat(tokenBalance.price_change_24h || '0'),
      priceChangePercent24h: parseFloat(tokenBalance.price_change_percent_24h || '0'),
      
      // Portfolio performance (if available)
      profitLoss: parseFloat(tokenBalance.profit_loss_usd || '0'),
      profitLossPercent: parseFloat(tokenBalance.profit_loss_percent || '0'),
      roi: parseFloat(tokenBalance.roi || '0'),
      
      // Additional metadata
      balanceFormatted: this.formatTokenBalance(balance, tokenMetadata.decimals || 18),
      lastUpdated: new Date().toISOString(),
    });
  }

  // Helper method to format token balance
  private formatTokenBalance(balance: number, decimals: number): string {
    if (balance === 0) return '0';
    if (balance < 0.0001) return balance.toExponential(2);
    if (balance < 1) return balance.toFixed(6);
    if (balance < 1000) return balance.toFixed(4);
    return balance.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }

  // Helper method for default token logos
  private getDefaultTokenLogo(tokenSymbol: string): string {
    // Return a default logo URL based on token symbol
    const symbol = tokenSymbol.toLowerCase();
    
    // Common token logos mapping
    const logoMap: { [key: string]: string } = {
      'eth': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      'ethereum': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      'btc': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
      'bitcoin': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
      'usdc': 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
      'usdt': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
      'dai': 'https://assets.coingecko.com/coins/images/9956/small/4943.png',
      'weth': 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
      'uni': 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
      'link': 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
      'aave': 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png',
    };
    
    return logoMap[symbol] || `https://via.placeholder.com/32x32/6366f1/ffffff?text=${tokenSymbol.charAt(0).toUpperCase()}`;
  }
}

export default OneInchService;

// Global service instance for cache management
let globalService: OneInchService | null = null;

export const setGlobalService = (service: OneInchService) => {
  globalService = service;
};

// Export cache management functions
export const clearCache = () => {
  if (globalService) {
    globalService.clearCache();
  }
};

export const getCacheStats = () => {
  if (globalService) {
    return globalService.getCacheStats();
  }
  return { totalEntries: 0, validEntries: 0, expiredEntries: 0 };
};
