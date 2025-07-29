import React from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import { 
  formatTransactionDate, 
  getTransactionDirection, 
  formatTransactionAmount 
} from '@/utils/tokenUtils';
import { getExplorerUrl } from '@/utils/portfolioUtils';
import type { Token } from '@/types/token';

interface TokenTransactionsProps {
  transactions: any[];
  isLoading: boolean;
  walletAddress: string;
  token: Token;
  chainId: number;
}

export const TokenTransactions: React.FC<TokenTransactionsProps> = ({
  transactions,
  isLoading,
  walletAddress,
  token,
  chainId
}) => {
  const getTransactionDirectionWithWallet = (tx: any) => getTransactionDirection(tx, walletAddress || '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">Transaction History</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Last {transactions.length} transactions</span>
          </div>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Direction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx: any, index: number) => {
                  const direction = getTransactionDirectionWithWallet(tx);
                  const amount = formatTransactionAmount(tx);
                  
                  return (
                    <tr key={tx.id || index} className="hover:bg-gray-50">
                      {/* Direction column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {direction === 'In' && (
                          <span className="text-green-500 font-bold text-lg">↓</span>
                        )}
                        {direction === 'Out' && (
                          <span className="text-red-500 font-bold text-lg">↑</span>
                        )}
                        {direction === 'Self' && (
                          <span className="text-blue-500 font-bold text-lg">⟲</span>
                        )}
                        {direction === 'On' && (
                          <span className="text-purple-500 font-bold text-lg">⟳</span>
                        )}
                      </td>
                      
                      {/* Transaction hash column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tx.details?.txHash ? (
                          <a 
                            href={getExplorerUrl(chainId, tx.details.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                          >
                            <span>{tx.details.txHash.slice(0, 8)}...{tx.details.txHash.slice(-6)}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span>N/A</span>
                        )}
                      </td>
                      
                      {/* Type column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tx.details?.type === 'Swap' ? 'bg-blue-100 text-blue-800' :
                          tx.details?.type === 'Transfer' ? 'bg-green-100 text-green-800' :
                          tx.details?.type === 'Approve' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {tx.details?.type || 'Unknown'}
                        </span>
                      </td>
                      
                      {/* Date column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTransactionDate(tx.timeAt || tx.timeMs || tx.timestamp)}
                      </td>
                      
                      {/* Amount column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={
                          direction === 'In' ? 'text-green-500' : 
                          direction === 'Out' ? 'text-red-500' : 
                          direction === 'Self' ? 'text-blue-500' : 
                          'text-purple-500'
                        }>
                          {direction === 'In' && '+'}
                          {direction === 'Out' && '-'}
                          {amount} {token?.symbol || 'ETH'}
                        </span>
                      </td>
                      
                      {/* Rating column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={
                          tx.rating === 'Reliable' ? 'text-green-600 font-medium' : 
                          tx.rating === 'Scam' ? 'text-red-600 font-medium' : 
                          'text-gray-600'
                        }>
                          {tx.rating || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No transactions found</p>
              <p className="text-sm">Transaction history will appear here when available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
