import { SUPPORTED_CHAINS } from '../utils/constants';
import coinGeckoLogoService from './coinGeckoLogoService';
import portfolioUtilsService from './portfolioUtilsService';

interface TokenDetail {
  chain_id: number;
  contract_address?: string;
  symbol?: string;
  name?: string;
  amount?: number;
  price_to_usd?: number;
  value_usd?: number;
  abs_profit_usd?: number;
  roi?: number;
}

interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  address: string;
}

interface ProcessedToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: number;
  price: number;
  value: number;
  logo: string;
  protocol: string;
  profitLoss: number;
  profitLossPercent: number;
  roi: number;
  balanceFormatted: string;
  lastUpdated: string;
}

interface PortfolioResult {
  totalValue: number;
  tokens: ProcessedToken[];
}

interface ChainPortfolio {
  chainId: number;
  chainName: string;
  totalValue: number;
  tokens: ProcessedToken[];
}

interface MultiChainPortfolio {
  totalValue: number;
  chains: ChainPortfolio[];
}

class PortfolioProcessingService {

  async processTokenDetails(
    tokenDetailsData: any,
    tokenListData: any,
    chainId: number
  ): Promise<PortfolioResult> {
    const tokens: ProcessedToken[] = [];
    let totalValue = 0;

    const tokenMetadataMap = this.createTokenMetadataMap(tokenListData);

    if (tokenDetailsData?.result && Array.isArray(tokenDetailsData.result)) {
      const tokenPromises = tokenDetailsData.result
        .filter((tokenDetail: TokenDetail) => tokenDetail.chain_id === chainId)
        .map(async (tokenDetail: TokenDetail) => {
          const tokenAddress = tokenDetail.contract_address?.toLowerCase();
          const tokenMetadata = tokenAddress ? tokenMetadataMap.get(tokenAddress) : null;
          
          const logoUrl = await coinGeckoLogoService.getTokenLogo(
            tokenAddress || '',
            chainId,
            tokenDetail.symbol || 'UNKNOWN'
          );
          
          const token: ProcessedToken = {
            address: tokenDetail.contract_address || `unknown_${chainId}`,
            symbol: tokenDetail.symbol || tokenMetadata?.symbol || 'UNKNOWN',
            name: tokenDetail.name || tokenMetadata?.name || 'Unknown Token',
            decimals: tokenMetadata?.decimals || 18,
            balance: tokenDetail.amount || 0,
            price: tokenDetail.price_to_usd || 0,
            value: tokenDetail.value_usd || 0,
            logo: logoUrl,
            protocol: 'ERC20',
            profitLoss: tokenDetail.abs_profit_usd || 0,
            profitLossPercent: tokenDetail.roi ? (tokenDetail.roi * 100) : 0,
            roi: tokenDetail.roi || 0,
            balanceFormatted: portfolioUtilsService.formatTokenBalance(
              tokenDetail.amount || 0,
              tokenMetadata?.decimals || 18
            ),
            lastUpdated: new Date().toISOString(),
          };
          
          return token.value > 0 ? token : null;
        });
      
      const processedTokens = await Promise.all(tokenPromises);
      
      processedTokens.forEach(token => {
        if (token) {
          tokens.push(token);
          totalValue += token.value;
        }
      });
    }

    return { totalValue, tokens };
  }

  private createTokenMetadataMap(tokenListData: any): Map<string, TokenMetadata> {
    const tokenMetadataMap = new Map<string, TokenMetadata>();
    
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
    
    return tokenMetadataMap;
  }

  async processMultiChainPortfolio(
    walletAddress: string,
    getPortfolioValueFn: (chainId: number, walletAddress: string) => Promise<PortfolioResult>
  ): Promise<MultiChainPortfolio> {
    const portfolios = await Promise.all(
      Object.entries(SUPPORTED_CHAINS).map(async ([chainKey, chain]) => {
        try {
          const portfolio = await getPortfolioValueFn(chain.id, walletAddress);
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

  isChainSupported(chainId: number): boolean {
    const supportedChainIds = Object.keys(SUPPORTED_CHAINS).map(Number);
    return supportedChainIds.includes(chainId);
  }

  createEmptyPortfolio(): PortfolioResult {
    return { totalValue: 0, tokens: [] };
  }

  filterTokensByValue(tokens: ProcessedToken[], minValue: number = 0.01): ProcessedToken[] {
    return tokens.filter(token => token.value >= minValue);
  }

  sortTokensByValue(tokens: ProcessedToken[]): ProcessedToken[] {
    return [...tokens].sort((a, b) => b.value - a.value);
  }

  calculatePortfolioSummary(portfolio: MultiChainPortfolio): {
    totalTokens: number;
    totalChains: number;
    averageTokenValue: number;
    largestHolding: ProcessedToken | null;
    chainDistribution: Record<string, number>;
  } {
    const allTokens = portfolio.chains.flatMap(chain => chain.tokens);
    const totalTokens = allTokens.length;
    const totalChains = portfolio.chains.filter(chain => chain.tokens.length > 0).length;
    const averageTokenValue = totalTokens > 0 ? portfolio.totalValue / totalTokens : 0;
    
    const largestHolding = allTokens.reduce((max, token) => 
      token.value > (max?.value || 0) ? token : max, null as ProcessedToken | null
    );

    const chainDistribution: Record<string, number> = {};
    portfolio.chains.forEach(chain => {
      if (chain.totalValue > 0) {
        chainDistribution[chain.chainName] = (chain.totalValue / portfolio.totalValue) * 100;
      }
    });

    return {
      totalTokens,
      totalChains,
      averageTokenValue,
      largestHolding,
      chainDistribution
    };
  }
}

export const portfolioProcessingService = new PortfolioProcessingService();
export default portfolioProcessingService;

export type { 
  ProcessedToken, 
  PortfolioResult, 
  ChainPortfolio, 
  MultiChainPortfolio,
  TokenDetail,
  TokenMetadata
};
