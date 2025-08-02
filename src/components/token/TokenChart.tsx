import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { formatPrice } from '@/utils/tokenUtils';
import { CHART_INTERVALS } from '@/utils/constants';
import type { ChartDataPoint, ChartInterval } from '@/types/token';

interface TokenChartProps {
  chartData: ChartDataPoint[];
  selectedInterval: ChartInterval;
  onIntervalChange: (interval: ChartInterval) => void;
  isLoading: boolean;
}

const chartConfig = {
  price: {
    label: "Price",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

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
      <div className="bg-[#181818] rounded-xl border border-white/10 p-8 mb-8">
        {/* Chart Header - Similar to Total Borrow Style */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Price Chart</h3>
            <p className="text-2xl font-bold text-white">
              {chartData.length > 0 ? formatPrice(chartData[chartData.length - 1]?.price || 0) : '$0.00'}
            </p>
            <p className="text-sm text-white/50">
              {chartData.length > 0 ? new Date(chartData[chartData.length - 1]?.timestamp || Date.now()).toLocaleDateString() : ''}
            </p>
          </div>
          
          {/* Tabs and Dropdown on same line */}
          <div className="flex items-center space-x-4">
            {/* Chart Type Tabs */}
            <div className="flex space-x-1">
              <button className="px-4 py-2 text-sm font-medium text-[#559779] bg-[#559779]/10 rounded-lg border border-[#559779]/20">
                Price Chart
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white/80 hover:bg-white/5 rounded-lg">
                Transaction History
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white/80 hover:bg-white/5 rounded-lg">
                Analytics
              </button>
            </div>
            
            {/* Timeframe Dropdown */}
            <div className="relative">
              <select 
                value={selectedInterval}
                onChange={(e) => onIntervalChange(e.target.value as ChartInterval)}
                className="bg-[#1F1F1F] border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:border-[#559779] appearance-none cursor-pointer pr-8"
              >
                {CHART_INTERVALS.map((interval) => (
                  <option key={interval.value} value={interval.value} className="bg-[#1F1F1F]">
                    {interval.label}
                  </option>
                ))}
              </select>
              {/* Dropdown Arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#559779]"></div>
          </div>
        ) : chartData.length > 0 ? (
          <div className="h-96">
            <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <defs>
                  <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-price)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-price)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="timestamp"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={formatDateForChart}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value: any) => formatDateForChart(value)}
                      formatter={(value: any) => [formatPrice(value as number), 'Price']}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="price"
                  type="natural"
                  fill="url(#fillPrice)"
                  stroke="var(--color-price)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center text-white/60">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-lg text-white/80">No chart data available</p>
              <p className="text-sm text-white/60">Try a different time interval</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
