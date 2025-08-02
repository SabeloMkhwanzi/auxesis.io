import { ONEINCH_API_CONFIG } from '../utils/constants';
import transactionAnalyticsService, { type TransactionAnalytics } from './transactionAnalyticsService';
import portfolioUtilsService from './portfolioUtilsService';
import apiRequestService from './apiRequestService';
import portfolioProcessingService from './portfolioProcessingService';

interface OneInchApiConfig {
  apiKey: string;
  baseUrl?: string;
}

class OneInchService {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: OneInchApiConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || ONEINCH_API_CONFIG.BASE_URL;
  }

  async getTokenPrices(chainId: number, tokenAddresses: string[]) {
    return apiRequestService.makeRequest(`${ONEINCH_API_CONFIG.VERSIONS.SWAP}/${chainId}/tokens/prices`, {
      addresses: tokenAddresses.join(','),
    });
  }

  async getTokenDetails(chainId: number, walletAddress: string) {
    const { endpoint } = apiRequestService.buildPortfolioEndpoint(
      'portfolio/portfolio/v4/overview/erc20/details',
      walletAddress,
      chainId
    );
    return apiRequestService.makeRequest(endpoint);
  }

  async getProfitAndLoss(chainId: number, walletAddress: string, fromTimestamp?: string, toTimestamp?: string) {
    const params: any = {
      addresses: walletAddress,
      chain_id: chainId,
    };
    
    if (fromTimestamp) params.from_timestamp = fromTimestamp;
    if (toTimestamp) params.to_timestamp = toTimestamp;
    
    return apiRequestService.makeRequest(`${ONEINCH_API_CONFIG.VERSIONS.PORTFOLIO}/overview/erc20/profit_and_loss`, params);
  }

  async searchTokens(chainId: number, query: string, limit: number = 10) {
    return apiRequestService.makeRequest(`${ONEINCH_API_CONFIG.VERSIONS.TOKEN}/${chainId}/search`, {
      query,
      limit,
      ignore_listed: 'false'
    });
  }

  async getTokensInfo(chainId: number, addresses: string[]) {
    return apiRequestService.makeRequest(`${ONEINCH_API_CONFIG.VERSIONS.TOKEN}/${chainId}/custom/${addresses.join(',')}`);
  }

  async get1inchTokenList(chainId: number, provider: string = '1inch') {
    return apiRequestService.makeRequest(`${ONEINCH_API_CONFIG.VERSIONS.TOKEN}/${chainId}/token-list`, { provider });
  }

  async getSwapQuote(chainId: number, fromToken: string, toToken: string, amount: string, slippage: number = 1) {
    return apiRequestService.makeRequest(`${ONEINCH_API_CONFIG.VERSIONS.SWAP}/${chainId}/quote`, {
      src: fromToken, dst: toToken, amount, slippage
    });
  }

  async getSwapTransaction(chainId: number, fromToken: string, toToken: string, amount: string, fromAddress: string, slippage: number = 1) {
    return apiRequestService.makeRequest(`${ONEINCH_API_CONFIG.VERSIONS.SWAP}/${chainId}/swap`, {
      src: fromToken, dst: toToken, amount, from: fromAddress, slippage
    });
  }

  async getGeneralPortfolioValue(walletAddress: string) {
    return apiRequestService.makeRequest(`${ONEINCH_API_CONFIG.VERSIONS.PORTFOLIO}/general/current_value`, {
      addresses: walletAddress,
    });
  }

  async getPortfolioValue(chainId: number, walletAddress: string) {
    try {
      if (!portfolioProcessingService.isChainSupported(chainId)) {
        console.log(`Chain ${chainId} not supported, skipping`);
        return portfolioProcessingService.createEmptyPortfolio();
      }

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
        return portfolioProcessingService.createEmptyPortfolio();
      }

      return await portfolioProcessingService.processTokenDetails(
        tokenDetailsData,
        tokenListData,
        chainId
      );
    } catch (error) {
      console.error(`Error fetching portfolio for chain ${chainId}:`, error);
      return portfolioProcessingService.createEmptyPortfolio();
    }
  }

  async getMultiChainPortfolio(walletAddress: string) {
    return await portfolioProcessingService.processMultiChainPortfolio(
      walletAddress,
      (chainId, address) => this.getPortfolioValue(chainId, address)
    );
  }

  async generateRebalancingSuggestions(
    walletAddress: string,
    targetAllocations: Record<string, number>,
    driftThreshold: number = 5
  ) {
    const portfolio = await this.getMultiChainPortfolio(walletAddress);
    
    const currentAllocations = portfolioUtilsService.calculateCurrentAllocations(
      portfolio.chains,
      portfolio.totalValue
    );

    return portfolioUtilsService.generateRebalancingSuggestions(
      currentAllocations,
      targetAllocations,
      portfolio.totalValue,
      driftThreshold
    );
  }

  async getTokenMetrics(chainId: number, walletAddress: string, timerange: string = '1year', useCache: boolean = true) {
    const params = {
      addresses: walletAddress,
      chain_id: chainId.toString(),
      timerange,
      use_cache: useCache.toString()
    };
    
    return apiRequestService.makeRequest('portfolio/portfolio/v5.0/tokens/metrics', params);
  }

  async getTransactionAnalytics(chainId: number, walletAddress: string, tokenAddress?: string) {
    try {
      const params: any = { chainId, limit: 50 };
      // Include tokenAddress filter if specified (for any token including ETH)
      if (tokenAddress) {
        params.tokenAddress = tokenAddress;
      }

      const response = await fetch(`/api/history/${walletAddress}/events?${new URLSearchParams(params)}`);
      if (!response.ok) throw new Error(`History API error: ${response.status}`);

      const data = await response.json();
      const transactions = data.result || data.items || [];
      
      return transactionAnalyticsService.processTransactionAnalytics(transactions);
    } catch (error) {
      console.error('Error fetching transaction analytics:', error);
      return {
        recentTransactions: [],
        totalTransactions: 0,
        totalVolume: 0,
        activityBreakdown: { swaps: 0, transfers: 0, approvals: 0, other: 0 },
        timelineData: []
      };
    }
  }

  async getHistoryMetrics(chainId: number, walletAddress: string, tokenAddress: string) {
    try {
      const params = {
        chainId: chainId.toString(),
        tokenAddress
      };

      const response = await fetch(`/api/history/${walletAddress}/metrics?${new URLSearchParams(params)}`);
      if (!response.ok) {
        throw new Error(`History Metrics API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Return the first metrics entry if available
      if (data.result && data.result.length > 0) {
        return data.result[0];
      }
      
      // Return null if no data available
      return null;
    } catch (error) {
      console.error('Error fetching history metrics:', error);
      return null;
    }
  }

  async getPortfolioChart(chainId: number, walletAddress: string, timerange: string = '1day') {
    try {
      const params = {
        addresses: [walletAddress],
        chain_id: chainId.toString(),
        timerange,
        use_cache: 'true'
      };

      const response = await fetch(`/api/portfolio/v5.0/general/chart?${new URLSearchParams({
        addresses: walletAddress,
        chain_id: chainId.toString(),
        timerange,
        use_cache: 'true'
      })}`);
      
      if (!response.ok) {
        throw new Error(`Portfolio Chart API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform the data for chart consumption
      if (data.result && Array.isArray(data.result)) {
        return data.result.map((point: any) => ({
          timestamp: point.timestamp * 1000, // Convert to milliseconds
          value: point.value_usd,
          date: new Date(point.timestamp * 1000).toISOString()
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching portfolio chart:', error);
      return [];
    }
  }
}

export default OneInchService;

export const clearCache = () => apiRequestService.clearCache();
export const getCacheStats = () => apiRequestService.getCacheStats();
