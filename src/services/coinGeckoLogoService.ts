import { COINGECKO_API_CONFIG, CHAIN_TO_COINGECKO_PLATFORM } from '../utils/constants';

interface LogoCache {
  [key: string]: {
    url: string;
    timestamp: number;
  };
}

class CoinGeckoLogoService {
  private cache: Map<string, { data: string; timestamp: number }> = new Map();
  private preloadCache: LogoCache = {};
  private isPreloading = false;

  constructor() {
    this.loadPreloadedLogos();
  }

  async preloadCommonTokens(tokens: Array<{ address: string; chainId: number; symbol: string }>) {
    if (this.isPreloading) return;
    
    this.isPreloading = true;
    console.log('🚀 Preloading token logos...');

    try {
      const batchSize = 5;
      for (let i = 0; i < tokens.length; i += batchSize) {
        const batch = tokens.slice(i, i + batchSize);
        
        const promises = batch.map(async (token) => {
          const cacheKey = `token_logo:${token.chainId}:${token.address.toLowerCase()}`;
          
          if (this.cache.has(cacheKey) || this.preloadCache[cacheKey]) {
            return;
          }

          try {
            const logoUrl = await this.fetchTokenLogo(token.address, token.chainId, token.symbol);
            this.preloadCache[cacheKey] = {
              url: logoUrl,
              timestamp: Date.now()
            };
          } catch (error) {
            console.warn(`Failed to preload logo for ${token.symbol}:`, error);
          }
        });

        await Promise.all(promises);
        
        if (i + batchSize < tokens.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      this.savePreloadedLogos();
      console.log(`✅ Preloaded ${Object.keys(this.preloadCache).length} token logos`);
    } catch (error) {
      console.error('Error preloading token logos:', error);
    } finally {
      this.isPreloading = false;
    }
  }

  async getTokenLogo(tokenAddress: string, chainId: number, tokenSymbol: string): Promise<string> {
    const cacheKey = `token_logo:${chainId}:${tokenAddress.toLowerCase()}`;
    
    const preloaded = this.preloadCache[cacheKey];
    if (preloaded && Date.now() - preloaded.timestamp < COINGECKO_API_CONFIG.CACHE_TIMEOUT) {
      return preloaded.url;
    }

    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < COINGECKO_API_CONFIG.CACHE_TIMEOUT) {
      return cached.data;
    }

    try {
      const logoUrl = await this.fetchTokenLogo(tokenAddress, chainId, tokenSymbol);
      
      this.cache.set(cacheKey, {
        data: logoUrl,
        timestamp: Date.now()
      });
      
      return logoUrl;
    } catch (error) {
      console.warn(`Failed to fetch token logo for ${tokenAddress}:`, error);
      return await this.getFallbackTokenLogo(tokenSymbol);
    }
  }

  private async fetchTokenLogo(tokenAddress: string, chainId: number, tokenSymbol: string): Promise<string> {
    const platformId = CHAIN_TO_COINGECKO_PLATFORM[chainId];
    if (!platformId) {
      console.warn(`No CoinGecko platform mapping for chain ${chainId}`);
      return await this.getFallbackTokenLogo(tokenSymbol);
    }

    const url = `${COINGECKO_API_CONFIG.BASE_URL}/coins/${platformId}/contract/${tokenAddress.toLowerCase()}`;
    
    const headers: Record<string, string> = {
      'accept': 'application/json'
    };
    
    if (COINGECKO_API_CONFIG.API_KEY) {
      headers['x-cg-demo-api-key'] = COINGECKO_API_CONFIG.API_KEY;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (response.ok) {
      const data = await response.json();
      const logoUrl = data.image?.small || data.image?.thumb || data.image?.large;
      
      if (logoUrl) {
        return logoUrl;
      }
    }

    return await this.getFallbackTokenLogo(tokenSymbol);
  }

  private async getFallbackTokenLogo(tokenSymbol: string): Promise<string> {
    const cacheKey = `token_logo_search:${tokenSymbol.toLowerCase()}`;
    
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < COINGECKO_API_CONFIG.CACHE_TIMEOUT) {
      return cached.data;
    }

    try {
      const searchUrl = `${COINGECKO_API_CONFIG.BASE_URL}/search?query=${encodeURIComponent(tokenSymbol)}`;
      
      const headers: Record<string, string> = {
        'accept': 'application/json'
      };
      
      if (COINGECKO_API_CONFIG.API_KEY) {
        headers['x-cg-demo-api-key'] = COINGECKO_API_CONFIG.API_KEY;
      }
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers
      });

      if (response.ok) {
        const data = await response.json();
        const coin = data.coins?.find((c: any) => 
          c.symbol?.toLowerCase() === tokenSymbol.toLowerCase()
        );
        
        if (coin?.large || coin?.small || coin?.thumb) {
          const logoUrl = coin.small || coin.thumb || coin.large;
          
          this.cache.set(cacheKey, {
            data: logoUrl,
            timestamp: Date.now()
          });
          
          return logoUrl;
        }
      }
    } catch (error) {
      console.warn(`Failed to search token logo for ${tokenSymbol}:`, error);
    }

    return `https://via.placeholder.com/32x32/6366f1/ffffff?text=${tokenSymbol.charAt(0).toUpperCase()}`;
  }

  private loadPreloadedLogos() {
    try {
      const stored = localStorage.getItem('coinGeckoLogoCache');
      if (stored) {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        Object.entries(parsed).forEach(([key, value]: [string, any]) => {
          if (now - value.timestamp < COINGECKO_API_CONFIG.CACHE_TIMEOUT) {
            this.preloadCache[key] = value;
          }
        });
        console.log(`📦 Loaded ${Object.keys(this.preloadCache).length} preloaded logos from cache`);
      }
    } catch (error) {
      console.warn('Failed to load preloaded logos:', error);
    }
  }

  private savePreloadedLogos() {
    try {
      localStorage.setItem('coinGeckoLogoCache', JSON.stringify(this.preloadCache));
    } catch (error) {
      console.warn('Failed to save preloaded logos:', error);
    }
  }

  clearCache() {
    this.cache.clear();
    this.preloadCache = {};
    try {
      localStorage.removeItem('coinGeckoLogoCache');
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error);
    }
    console.log('🧹 CoinGecko logo cache cleared');
  }

  getCacheStats() {
    const now = Date.now();
    const runtimeValid = Array.from(this.cache.values()).filter(
      entry => now - entry.timestamp < COINGECKO_API_CONFIG.CACHE_TIMEOUT
    ).length;
    
    const preloadValid = Object.values(this.preloadCache).filter(
      entry => now - entry.timestamp < COINGECKO_API_CONFIG.CACHE_TIMEOUT
    ).length;

    return {
      runtimeCache: {
        total: this.cache.size,
        valid: runtimeValid,
        expired: this.cache.size - runtimeValid
      },
      preloadCache: {
        total: Object.keys(this.preloadCache).length,
        valid: preloadValid,
        expired: Object.keys(this.preloadCache).length - preloadValid
      }
    };
  }
}

export const coinGeckoLogoService = new CoinGeckoLogoService();
export default coinGeckoLogoService;
