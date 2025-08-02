import React from 'react';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';
import type { TokenDetailTab } from '@/types/token';

interface TokenTabsProps {
  activeTab: TokenDetailTab;
  onTabChange: (tab: TokenDetailTab) => void;
}

const tabs = [
  { id: 'chart' as const, label: 'Price Chart', icon: TrendingUp },
  { id: 'transactions' as const, label: 'Transaction History', icon: Activity },
  { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 }
];

export const TokenTabs: React.FC<TokenTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#181818] rounded-xl border border-white/10 mb-8">
        <div className="border-b border-white/10">
          <nav className="flex space-x-8 px-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-[#559779] text-[#559779]'
                      : 'border-transparent text-white/60 hover:text-white hover:border-white/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
