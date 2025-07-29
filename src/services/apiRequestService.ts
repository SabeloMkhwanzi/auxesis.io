interface CacheEntry {
  data: any;
  timestamp: number;
}

interface ApiRequestOptions {
  cacheTimeout?: number;
  skipCache?: boolean;
}

class ApiRequestService {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultCacheTimeout = 5 * 60 * 1000;

  async makeRequest(
    endpoint: string, 
    params?: Record<string, any>, 
    options: ApiRequestOptions = {}
  ): Promise<any> {
    const { cacheTimeout = this.defaultCacheTimeout, skipCache = false } = options;
    
    const cacheKey = `${endpoint}:${JSON.stringify(params || {})}`;
    
    if (!skipCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cacheTimeout) {
        return cached.data;
      }
    }

    const url = new URL(`/api/proxy/${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!skipCache) {
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }
    
    return data;
  }

  buildPortfolioEndpoint(
    baseEndpoint: string, 
    walletAddress: string, 
    chainId: number, 
    additionalParams: Record<string, string> = {}
  ): { endpoint: string; params?: Record<string, any> } {
    const defaultParams = {
      addresses: walletAddress,
      chain_id: chainId.toString(),
      timerange: '1week',
      closed: 'true',
      closed_threshold: '1',
      use_cache: 'true',
      ...additionalParams
    };

    return {
      endpoint: `${baseEndpoint}?${new URLSearchParams(defaultParams)}`,
    };
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): {
    totalEntries: number;
    validEntries: number;
    expiredEntries: number;
  } {
    const now = Date.now();
    const validEntries = Array.from(this.cache.values()).filter(
      entry => now - entry.timestamp < this.defaultCacheTimeout
    ).length;
    
    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries: this.cache.size - validEntries
    };
  }
}

export const apiRequestService = new ApiRequestService();
export default apiRequestService;
