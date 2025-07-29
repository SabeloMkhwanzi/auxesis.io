interface TransactionData {
  type?: string;
  method?: string;
  value?: string;
  amount?: string;
  timeStamp?: number;
  timestamp?: number;
  [key: string]: any;
}

interface ActivityBreakdown {
  swaps: number;
  transfers: number;
  approvals: number;
  other: number;
}

interface TimelineData {
  date: string;
  count: number;
  volume: number;
}

interface TransactionAnalytics {
  recentTransactions: TransactionData[];
  totalTransactions: number;
  totalVolume: number;
  activityBreakdown: ActivityBreakdown;
  timelineData: TimelineData[];
}

class TransactionAnalyticsService {
  
  processTransactionAnalytics(transactions: TransactionData[]): TransactionAnalytics {
    return {
      recentTransactions: transactions.slice(0, 10),
      totalTransactions: transactions.length,
      totalVolume: this.calculateTotalVolume(transactions),
      activityBreakdown: this.analyzeTransactionActivity(transactions),
      timelineData: this.generateTimelineData(transactions)
    };
  }

  private calculateTotalVolume(transactions: TransactionData[]): number {
    return transactions.reduce((sum: number, tx: TransactionData) => {
      const value = parseFloat(tx.value || tx.amount || '0');
      return sum + value;
    }, 0);
  }

  analyzeTransactionActivity(transactions: TransactionData[]): ActivityBreakdown {
    const breakdown: ActivityBreakdown = { 
      swaps: 0, 
      transfers: 0, 
      approvals: 0, 
      other: 0 
    };
    
    transactions.forEach(tx => {
      const type = tx.type || tx.method || 'other';
      const typeStr = type.toLowerCase();
      
      if (typeStr.includes('swap')) {
        breakdown.swaps++;
      } else if (typeStr.includes('transfer')) {
        breakdown.transfers++;
      } else if (typeStr.includes('approve')) {
        breakdown.approvals++;
      } else {
        breakdown.other++;
      }
    });
    
    return breakdown;
  }

  generateTimelineData(transactions: TransactionData[]): TimelineData[] {
    const timelineMap = new Map<string, TimelineData>();
    
    transactions.forEach(tx => {
      const timestamp = tx.timeStamp ? tx.timeStamp * 1000 : (tx.timestamp || Date.now());
      const date = new Date(timestamp);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!timelineMap.has(dateKey)) {
        timelineMap.set(dateKey, { 
          date: dateKey, 
          count: 0, 
          volume: 0 
        });
      }
      
      const dayData = timelineMap.get(dateKey)!;
      dayData.count++;
      dayData.volume += parseFloat(tx.value || tx.amount || '0');
    });
    
    return Array.from(timelineMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  getTransactionStats(transactions: TransactionData[]): {
    totalCount: number;
    totalVolume: number;
    averageVolume: number;
    dateRange: { start: string; end: string } | null;
    mostActiveDay: { date: string; count: number } | null;
  } {
    if (transactions.length === 0) {
      return {
        totalCount: 0,
        totalVolume: 0,
        averageVolume: 0,
        dateRange: null,
        mostActiveDay: null
      };
    }

    const totalVolume = this.calculateTotalVolume(transactions);
    const timelineData = this.generateTimelineData(transactions);
    
    const sortedDates = timelineData.map(d => d.date).sort();
    const dateRange = sortedDates.length > 0 ? {
      start: sortedDates[0],
      end: sortedDates[sortedDates.length - 1]
    } : null;

    const mostActiveDay = timelineData.reduce((max, current) => 
      current.count > (max?.count || 0) ? current : max, 
      null as TimelineData | null
    );

    return {
      totalCount: transactions.length,
      totalVolume,
      averageVolume: totalVolume / transactions.length,
      dateRange,
      mostActiveDay: mostActiveDay ? {
        date: mostActiveDay.date,
        count: mostActiveDay.count
      } : null
    };
  }

  filterTransactionsByType(transactions: TransactionData[], type: 'swaps' | 'transfers' | 'approvals' | 'other'): TransactionData[] {
    return transactions.filter(tx => {
      const txType = (tx.type || tx.method || 'other').toLowerCase();
      
      switch (type) {
        case 'swaps':
          return txType.includes('swap');
        case 'transfers':
          return txType.includes('transfer');
        case 'approvals':
          return txType.includes('approve');
        case 'other':
          return !txType.includes('swap') && !txType.includes('transfer') && !txType.includes('approve');
        default:
          return false;
      }
    });
  }

  filterTransactionsByDateRange(
    transactions: TransactionData[], 
    startDate: Date, 
    endDate: Date
  ): TransactionData[] {
    return transactions.filter(tx => {
      const timestamp = tx.timeStamp ? tx.timeStamp * 1000 : (tx.timestamp || Date.now());
      const txDate = new Date(timestamp);
      return txDate >= startDate && txDate <= endDate;
    });
  }

  getTransactionsForPeriod(
    transactions: TransactionData[], 
    period: '24h' | '7d' | '30d' | '90d'
  ): TransactionData[] {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        return transactions;
    }

    return this.filterTransactionsByDateRange(transactions, startDate, now);
  }
}

export const transactionAnalyticsService = new TransactionAnalyticsService();
export default transactionAnalyticsService;

export type { 
  TransactionData, 
  ActivityBreakdown, 
  TimelineData, 
  TransactionAnalytics 
};
