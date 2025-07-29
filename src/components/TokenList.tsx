'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PortfolioToken } from '@/types/token';
import { 
  formatCurrency, 
  formatPrice, 
  formatProfitLossPercentage, 
  getPercentageColor,
  handleTokenImageError 
} from '@/utils/portfolioUtils';

interface TokenListProps {
  tokens: PortfolioToken[];
  chainName: string;
  chainId: number;
  isLoading?: boolean;
}

export default function TokenList({ tokens, chainName, chainId, isLoading }: TokenListProps) {
  const [showAllTokens, setShowAllTokens] = useState(false);
  const router = useRouter();

  // Show top 5 tokens by default, or all if toggled
  const displayedTokens = showAllTokens ? tokens : tokens.slice(0, 5);
  const hasMoreTokens = tokens.length > 5;

  const handleTokenClick = (token: PortfolioToken) => {
    router.push(`/token/${chainId}/${token.address}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {chainName} Tokens
          </h3>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3 p-3">
                <div className="rounded-full bg-gray-300 h-8 w-8"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/6"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                  <div className="h-3 bg-gray-300 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {chainName} Tokens
          </h3>
          <span className="text-sm text-gray-500">
            {tokens.length} token{tokens.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {tokens.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>No tokens found on {chainName}</p>
          <p className="text-sm mt-1">This chain may not have any assets or may not be supported</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <div className={`${showAllTokens && tokens.length > 5 ? 'max-h-96 overflow-y-auto' : ''}`}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      24h Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedTokens.map((token, index) => (
                    <tr 
                      key={token.address} 
                      className="hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={() => handleTokenClick(token)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <img
                              className="h-8 w-8 rounded-full"
                              src={token.logo}
                              alt={token.symbol}
                              onError={(e) => handleTokenImageError(e, token.symbol)}
                            />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {token.symbol}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-32">
                              {token.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900">
                          {token.balanceFormatted}
                        </div>
                        <div className="text-sm text-gray-500">
                          {token.symbol}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900">
                          {formatPrice(token.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(token.value)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`
                          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${getPercentageColor(token.profitLossPercent)}
                        `}>
                          {formatProfitLossPercentage(token.profitLossPercent)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Show More/Less Button */}
          {hasMoreTokens && (
            <div className="mt-4 text-center border-t border-gray-200 pt-4">
              <button
                onClick={() => setShowAllTokens(!showAllTokens)}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200 border border-blue-200 hover:border-blue-300"
              >
                {showAllTokens ? (
                  <>
                    <span>Show Less</span>
                    <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Show {tokens.length - 5} More Tokens</span>
                    <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
      

    </div>
  );
}
