import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatPrice } from '@/utils/tokenUtils';
import { CHART_INTERVALS } from '@/utils/constants';
import type { ChartDataPoint, ChartInterval } from '@/types/token';

interface TokenChartProps {
  chartData: ChartDataPoint[];
  selectedInterval: ChartInterval;
  onIntervalChange: (interval: ChartInterval) => void;
  isLoading: boolean;
}

export const TokenChart: React.FC<TokenChartProps> = ({
  chartData,
  selectedInterval,
  onIntervalChange,
  isLoading
}) => {
  const formatDateForChart = (value: any) => {
    const date = new Date(value as number);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: selectedInterval === '1h' || selectedInterval === '4h' ? 'numeric' : undefined,
      minute: selectedInterval === '1h' ? 'numeric' : undefined
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">Price Chart</h3>
          <div className="flex space-x-2">
            {CHART_INTERVALS.map((interval) => (
              <button
                key={interval.value}
                onClick={() => onIntervalChange(interval.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedInterval === interval.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {interval.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : chartData.length > 0 ? (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="timestamp"
                  tickFormatter={formatDateForChart}
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={formatPrice}
                  stroke="#666"
                  fontSize={12}
                />
                <Tooltip 
                  labelFormatter={(value: any) => formatDateForChart(value)}
                  formatter={(value: any) => [formatPrice(value as number), 'Price']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-lg">No chart data available</p>
              <p className="text-sm">Try a different time interval</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
