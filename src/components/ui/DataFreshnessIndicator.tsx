'use client';

import React from 'react';
import { ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface DataFreshnessIndicatorProps {
  lastUpdated: number | null;
  dataAge: number | null; // Age in minutes
  isStale: boolean;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const DataFreshnessIndicator: React.FC<DataFreshnessIndicatorProps> = ({
  lastUpdated,
  dataAge,
  isStale,
  onRefresh,
  isLoading = false
}) => {
  const formatDataAge = (ageMinutes: number | null): string => {
    if (ageMinutes === null) return 'Never updated';
    
    if (ageMinutes < 1) return 'Just now';
    if (ageMinutes < 60) return `${ageMinutes}m ago`;
    
    const hours = Math.floor(ageMinutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatLastUpdated = (timestamp: number | null): string => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusColor = () => {
    if (dataAge === null) return 'text-gray-400';
    if (dataAge < 2) return 'text-green-400'; // Fresh (< 2 minutes)
    if (dataAge < 5) return 'text-yellow-400'; // Getting stale (2-5 minutes)
    return 'text-red-400'; // Stale (> 5 minutes)
  };

  const getStatusDot = () => {
    if (dataAge === null) return 'bg-gray-400';
    if (dataAge < 2) return 'bg-green-400'; // Fresh
    if (dataAge < 5) return 'bg-yellow-400'; // Getting stale
    return 'bg-red-400'; // Stale
  };

  const getButtonStyle = () => {
    if (dataAge === null) return 'bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30';
    if (dataAge < 2) return 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'; // Fresh
    if (dataAge < 5) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30'; // Getting stale
    return 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'; // Stale
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      {/* Status indicator dot */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getStatusDot()}`} />
        <div className="flex items-center gap-1 text-white/70">
          <ClockIcon className="w-4 h-4" />
          <span>
            Updated {formatDataAge(dataAge)}
            {lastUpdated && (
              <span className="text-white/50 ml-1">
                at {formatLastUpdated(lastUpdated)}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Refresh button */}
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className={`
          flex items-center gap-1 px-2 py-1 rounded-md text-xs border
          transition-all duration-200
          ${getButtonStyle()}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={
          dataAge === null ? 'No data - click to refresh' :
          dataAge < 2 ? 'Data is fresh - click to sync' :
          dataAge < 5 ? 'Data is getting stale - refresh recommended' :
          'Data is stale - refresh needed'
        }
      >
        <ArrowPathIcon 
          className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} 
        />
        <span>
          {dataAge === null ? 'Refresh' :
           dataAge < 2 ? 'Sync' :
           dataAge < 5 ? 'Refresh' :
           'Refresh'}
        </span>
      </button>
    </div>
  );
};
