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
      <div className="bg-[#181818] rounded-xl border border-white/10 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-white">Transaction History</h3>
          <div className="flex items-center space-x-2 text-sm text-white/60">
            <Clock className="w-4 h-4" />
            <span>Last {transactions.length} transactions</span>
          </div>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#559779]"></div>
          </div>
        ) : transactions.length > 0 ? (
          <div className={`overflow-x-auto rounded-lg ${
            transactions.length > 10 ? 'max-h-96 overflow-y-auto' : ''
          }`}>
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-[#559779]/20 rounded-t-lg border-b border-[#559779]/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Direction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Transaction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-white/10">
                {transactions.map((tx: any, index: number) => {
                  const direction = getTransactionDirectionWithWallet(tx);
                  const amount = formatTransactionAmount(tx);
                  
                  return (
                    <tr key={tx.id || index} className="hover:bg-white/5 transition-colors">
                      {/* Direction column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {direction === 'In' && (
                          <span className="text-green-400 font-bold text-lg">↓</span>
                        )}
                        {direction === 'Out' && (
                          <span className="text-red-400 font-bold text-lg">↑</span>
                        )}
                        {direction === 'Self' && (
                          <span className="text-blue-400 font-bold text-lg">⟲</span>
                        )}
                        {direction === 'On' && (
                          <span className="text-purple-400 font-bold text-lg">⟳</span>
                        )}
                      </td>
                      
                      {/* Transaction hash column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                        {tx.details?.txHash ? (
                          <a 
                            href={getExplorerUrl(chainId, tx.details.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#559779] hover:text-green-300 flex items-center space-x-1 transition-colors"
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
                          tx.details?.type === 'Swap' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          tx.details?.type === 'Transfer' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                          tx.details?.type === 'Approve' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                          'bg-white/10 text-white/70 border border-white/20'
                        }`}>
                          {tx.details?.type || 'Unknown'}
                        </span>
                      </td>
                      
                      {/* Date column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                        {formatTransactionDate(tx.timeAt || tx.timeMs || tx.timestamp)}
                      </td>
                      
                      {/* Amount column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <span className={
                          direction === 'In' ? 'text-green-400' : 
                          direction === 'Out' ? 'text-red-400' : 
                          direction === 'Self' ? 'text-blue-400' : 
                          'text-purple-400'
                        }>
                          {direction === 'In' && '+'}
                          {direction === 'Out' && '-'}
                          {amount} {token?.symbol || 'ETH'}
                        </span>
                      </td>
                      
                      {/* Rating column */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        <span className={
                          tx.rating === 'Reliable' ? 'text-green-400 font-medium' : 
                          tx.rating === 'Scam' ? 'text-red-400 font-medium' : 
                          'text-white/60'
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
          <div className="h-64 flex items-center justify-center text-white/60">
            <div className="text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-white/30" />
              <p className="text-lg text-white/80">No transactions found</p>
              <p className="text-sm text-white/60">Transaction history will appear here when available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
