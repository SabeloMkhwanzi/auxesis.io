interface PortfolioDrift {
  drifts: Record<string, number>;
  maxDrift: number;
}

interface RebalancingSuggestion {
  token: string;
  action: 'sell' | 'buy';
  currentAllocation: number;
  targetAllocation: number;
  drift: number;
  suggestedAmount: number;
}

interface RebalancingResult {
  needsRebalancing: boolean;
  maxDrift?: number;
  suggestions: RebalancingSuggestion[];
  portfolioValue?: number;
}

class PortfolioUtilsService {

  formatTokenBalance(balance: number, decimals: number = 18): string {
    if (balance === 0) return '0';
    if (balance < 0.0001) return balance.toExponential(2);
    if (balance < 1) return balance.toFixed(6);
    if (balance < 1000) return balance.toFixed(4);
    return balance.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }

  formatUSDValue(value: number): string {
    if (value === 0) return '$0.00';
    if (value < 0.01) return '<$0.01';
    if (value < 1000) return `$${value.toFixed(2)}`;
    if (value < 1000000) return `$${(value / 1000).toFixed(1)}K`;
    if (value < 1000000000) return `$${(value / 1000000).toFixed(1)}M`;
    return `$${(value / 1000000000).toFixed(1)}B`;
  }

  formatPercentage(value: number, decimals: number = 2): string {
    if (value === 0) return '0%';
    return `${value.toFixed(decimals)}%`;
  }

  calculatePortfolioDrift(
    currentAllocations: Record<string, number>,
    targetAllocations: Record<string, number>
  ): PortfolioDrift {
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

  generateRebalancingSuggestions(
    currentAllocations: Record<string, number>,
    targetAllocations: Record<string, number>,
    portfolioValue: number,
    driftThreshold: number = 5
  ): RebalancingResult {
    const { drifts, maxDrift } = this.calculatePortfolioDrift(currentAllocations, targetAllocations);

    if (maxDrift < driftThreshold) {
      return { needsRebalancing: false, suggestions: [] };
    }

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
          suggestedAmount: (amount / 100) * portfolioValue,
        };
      });

    return {
      needsRebalancing: true,
      maxDrift,
      suggestions,
      portfolioValue,
    };
  }

  calculateCurrentAllocations(
    chains: Array<{
      tokens: Array<{
        symbol: string;
        value: number;
      }>;
    }>,
    totalValue: number
  ): Record<string, number> {
    const currentAllocations: Record<string, number> = {};
    
    chains.forEach(chain => {
      chain.tokens.forEach(token => {
        const allocation = (token.value / totalValue) * 100;
        currentAllocations[token.symbol] = (currentAllocations[token.symbol] || 0) + allocation;
      });
    });

    return currentAllocations;
  }

  calculatePortfolioDiversity(allocations: Record<string, number>): {
    numberOfAssets: number;
    concentrationRisk: number; // Highest single allocation
    diversityScore: number; // 0-100, higher is more diverse
    herfindahlIndex: number; // Market concentration measure
  } {
    const values = Object.values(allocations);
    const numberOfAssets = values.length;
    
    if (numberOfAssets === 0) {
      return {
        numberOfAssets: 0,
        concentrationRisk: 0,
        diversityScore: 0,
        herfindahlIndex: 0
      };
    }

    const concentrationRisk = Math.max(...values);
    
    const herfindahlIndex = values.reduce((sum, allocation) => {
      const share = allocation / 100;
      return sum + (share * share);
    }, 0);

    const diversityScore = Math.max(0, 100 - concentrationRisk);

    return {
      numberOfAssets,
      concentrationRisk,
      diversityScore,
      herfindahlIndex
    };
  }

  calculateRiskMetrics(
    tokens: Array<{
      symbol: string;
      value: number;
      profitLoss: number;
      roi: number;
    }>
  ): {
    totalPnL: number;
    averageROI: number;
    volatilityScore: number;
    riskLevel: 'Low' | 'Medium' | 'High';
  } {
    if (tokens.length === 0) {
      return {
        totalPnL: 0,
        averageROI: 0,
        volatilityScore: 0,
        riskLevel: 'Low'
      };
    }

    const totalPnL = tokens.reduce((sum, token) => sum + token.profitLoss, 0);
    const averageROI = tokens.reduce((sum, token) => sum + token.roi, 0) / tokens.length;
    
    const roiVariance = tokens.reduce((sum, token) => {
      const diff = token.roi - averageROI;
      return sum + (diff * diff);
    }, 0) / tokens.length;
    
    const volatilityScore = Math.sqrt(roiVariance) * 100;
    
    let riskLevel: 'Low' | 'Medium' | 'High';
    if (volatilityScore < 10) {
      riskLevel = 'Low';
    } else if (volatilityScore < 25) {
      riskLevel = 'Medium';
    } else {
      riskLevel = 'High';
    }

    return {
      totalPnL,
      averageROI,
      volatilityScore,
      riskLevel
    };
  }

  getTopPerformers(
    tokens: Array<{
      symbol: string;
      value: number;
      profitLoss: number;
      roi: number;
    }>,
    limit: number = 5
  ): Array<{
    symbol: string;
    value: number;
    profitLoss: number;
    roi: number;
    rank: number;
  }> {
    return tokens
      .sort((a, b) => b.roi - a.roi)
      .slice(0, limit)
      .map((token, index) => ({
        ...token,
        rank: index + 1
      }));
  }

  getWorstPerformers(
    tokens: Array<{
      symbol: string;
      value: number;
      profitLoss: number;
      roi: number;
    }>,
    limit: number = 5
  ): Array<{
    symbol: string;
    value: number;
    profitLoss: number;
    roi: number;
    rank: number;
  }> {
    return tokens
      .sort((a, b) => a.roi - b.roi)
      .slice(0, limit)
      .map((token, index) => ({
        ...token,
        rank: index + 1
      }));
  }

  validateTargetAllocations(targetAllocations: Record<string, number>): {
    isValid: boolean;
    totalPercentage: number;
    errors: string[];
  } {
    const errors: string[] = [];
    const totalPercentage = Object.values(targetAllocations).reduce((sum, val) => sum + val, 0);
    
    if (Math.abs(totalPercentage - 100) > 0.01) {
      errors.push(`Total allocation is ${totalPercentage.toFixed(2)}%, should be 100%`);
    }

    Object.entries(targetAllocations).forEach(([token, allocation]) => {
      if (allocation < 0) {
        errors.push(`${token} has negative allocation: ${allocation}%`);
      }
      if (allocation > 100) {
        errors.push(`${token} allocation exceeds 100%: ${allocation}%`);
      }
    });

    return {
      isValid: errors.length === 0,
      totalPercentage,
      errors
    };
  }
}

export const portfolioUtilsService = new PortfolioUtilsService();
export default portfolioUtilsService;

export type { 
  PortfolioDrift, 
  RebalancingSuggestion, 
  RebalancingResult 
};
