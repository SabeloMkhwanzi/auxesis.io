import OneInchService, { clearCache, getCacheStats } from './oneinch';
import type { ChartDataPoint, TokenDetails, TransactionAnalytics, ApiResponse } from '@/types/token';
import { API_CONFIG } from '@/utils/constants';

/**
 * Token Service - Handles all token-related API calls
 * Provides clean, focused methods for token data fetching
 */
export class TokenService {
  private oneInchService: OneInchService | null = null;

  constructor() {
    this.initializeService();
  }

  private async initializeService() {
    const apiKey = process.env.NEXT_PUBLIC_ONEINCH_API_KEY;
    if (apiKey) {
      this.oneInchService = new OneInchService({ apiKey });
    }
  }

  /**
   * Fetch transaction analytics for a specific token
   */
  async fetchTransactionAnalytics(
    chainId: number,
    walletAddress: string,
    tokenAddress: string
  ): Promise<TransactionAnalytics | null> {
    try {


      if (!walletAddress) {
        console.warn('❌ No wallet address provided');
        return null;
      }

      if (!this.oneInchService) {
        const apiKey = process.env.NEXT_PUBLIC_ONEINCH_API_KEY;
        if (!apiKey) {
          console.error('❌ 1inch API key not found');
          return null;
        }
        this.oneInchService = new OneInchService({ apiKey });
      }


      const analytics = await this.oneInchService.getTransactionAnalytics(
        chainId,
        walletAddress,
        tokenAddress
      );


      return analytics;
    } catch (error) {
      console.error('Error fetching transaction analytics:', error);
      return null;
    }
  }

  /**
   * Fetch token chart data for price visualization
   * Note: 1inch doesn't provide chart data API, so we'll generate mock data for demo
   */
  async fetchTokenChart(
    chainId: number,
    tokenAddress: string,
    interval: string = '7d'
  ): Promise<ChartDataPoint[]> {
    try {


      // Generate mock chart data for demo purposes
      const now = Date.now();
      const points = 30; // 30 data points
      const basePrice = 100 + Math.random() * 1000; // Random base price
      
      const mockData: ChartDataPoint[] = [];
      
      for (let i = 0; i < points; i++) {
        const timestamp = now - (points - i) * 3600000; // 1 hour intervals
        const priceVariation = (Math.random() - 0.5) * 0.1; // ±5% variation
        const price = basePrice * (1 + priceVariation);
        
        mockData.push({
          timestamp,
          date: new Date(timestamp),
          price,
          value: price
        });
      }


      return mockData;
    } catch (error) {
      console.error('Error generating chart data:', error);
      return [];
    }
  }

  /**
   * Fetch detailed token information and metadata
   * Note: 1inch doesn't provide token details API, returning null for now
   */
  async fetchTokenDetails(
    chainId: number,
    tokenAddress: string
  ): Promise<TokenDetails | null> {
    try {

      
      // 1inch doesn't provide a token details API endpoint
      // Token information is already available from the portfolio data

      return null;
    } catch (error) {
      console.error('Error in token details:', error);
      return null;
    }
  }

  /**
   * Fetch token metadata using 1inch service
   */
  async fetchTokenMetadata(
    chainId: number,
    tokenAddress: string
  ): Promise<any> {
    try {
      if (!this.oneInchService) {
        await this.initializeService();
      }

      if (!this.oneInchService) {
        throw new Error('OneInch service not initialized');
      }


      const metadata = await this.oneInchService.getTokensInfo(chainId, [tokenAddress]);

      return metadata;
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      return null;
    }
  }

  /**
   * Fetch token price data
   */
  async fetchTokenPrice(
    chainId: number,
    tokenAddress: string
  ): Promise<number | null> {
    try {
      if (!this.oneInchService) {
        await this.initializeService();
      }

      if (!this.oneInchService) {
        throw new Error('OneInch service not initialized');
      }


      const prices = await this.oneInchService.getTokenPrices(chainId, [tokenAddress]);
      
      if (prices && prices[tokenAddress]) {
        const price = parseFloat(prices[tokenAddress]);

        return price;
      }

      return null;
    } catch (error) {
      console.error('Error fetching token price:', error);
      return null;
    }
  }

  /**
   * Fetch comprehensive token data (combines multiple API calls)
   */
  async fetchComprehensiveTokenData(
    chainId: number,
    tokenAddress: string,
    walletAddress: string,
    interval: string = '7d'
  ): Promise<{
    chartData: ChartDataPoint[];
    tokenDetails: TokenDetails | null;
    transactionAnalytics: TransactionAnalytics | null;
    price: number | null;
  }> {


    // Execute all API calls in parallel for better performance
    const [chartData, tokenDetails, transactionAnalytics, price] = await Promise.allSettled([
      this.fetchTokenChart(chainId, tokenAddress, interval),
      this.fetchTokenDetails(chainId, tokenAddress),
      this.fetchTransactionAnalytics(chainId, walletAddress, tokenAddress),
      this.fetchTokenPrice(chainId, tokenAddress)
    ]);

    return {
      chartData: chartData.status === 'fulfilled' ? chartData.value : [],
      tokenDetails: tokenDetails.status === 'fulfilled' ? tokenDetails.value : null,
      transactionAnalytics: transactionAnalytics.status === 'fulfilled' ? transactionAnalytics.value : null,
      price: price.status === 'fulfilled' ? price.value : null
    };
  }

  /**
   * Clear service cache
   */
  clearCache(): void {
    clearCache();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { totalEntries: number; validEntries: number; expiredEntries: number } {
    return getCacheStats();
  }
}

// Create and export a singleton instance
export const tokenService = new TokenService();

// Export default for backward compatibility
export default TokenService;
