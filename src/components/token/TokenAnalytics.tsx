import React from 'react';
import { BarChart3, DollarSign, TrendingUp, Activity } from 'lucide-react';
import type { TransactionAnalytics } from '@/types/token';

interface TokenAnalyticsProps {
  analytics: TransactionAnalytics | null;
  isLoading: boolean;
}

export const TokenAnalytics: React.FC<TokenAnalyticsProps> = ({
  analytics,
  isLoading
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Token Analytics</h3>
        
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : analytics ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Transaction Type Breakdown */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Transaction Types</h4>
              {analytics.activityBreakdown && Object.keys(analytics.activityBreakdown).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(analytics.activityBreakdown)
                    .filter(([_, count]) => count > 0) // Only show types with transactions
                    .map(([type, count]: [string, any]) => {
                    const percentage = analytics.totalTransactions > 0 
                      ? (count / analytics.totalTransactions * 100).toFixed(1)
                      : '0';
                    
                    // Color coding for different transaction types
                    const getTypeColor = (type: string) => {
                      switch(type.toLowerCase()) {
                        case 'swaps': return 'bg-blue-600';
                        case 'transfers': return 'bg-green-600';
                        case 'approvals': return 'bg-purple-600';
                        default: return 'bg-gray-600';
                      }
                    };
                    
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${getTypeColor(type)} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No transaction activity found</p>
                  <p className="text-xs text-gray-400 mt-1">Transaction types will appear here when data is available</p>
                </div>
              )}
            </div>

            {/* Volume Analytics */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Volume Analytics</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Total Volume</span>
                  </div>
                  <span className="text-sm text-gray-900 font-semibold">
                    {analytics.totalVolume ? analytics.totalVolume.toFixed(4) : '0.0000'} ETH
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Recent Transactions</span>
                  </div>
                  <span className="text-sm text-gray-900 font-semibold">
                    {analytics.recentTransactions ? analytics.recentTransactions.length : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Timeline Data Points</span>
                  </div>
                  <span className="text-sm text-gray-900 font-semibold">
                    {analytics.timelineData ? analytics.timelineData.length : 0}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Transactions</span>
                    <span className="text-lg font-bold text-gray-900">
                      {analytics.totalTransactions || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No analytics data available</p>
              <p className="text-sm">Analytics will appear here when transaction data is loaded</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
