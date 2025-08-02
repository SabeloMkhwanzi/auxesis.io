import React from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { formatPrice, getPriceChangeColor } from '@/utils/tokenUtils';
import { CHAIN_NAMES, CHAIN_LOGOS } from '@/utils/constants';
import type { Token, HistoryMetrics } from '@/types/token';

interface TokenHeaderProps {
  token: Token;
  chainId: number;
  priceChangePercentage?: number;
  historyMetrics?: HistoryMetrics | null;
  onBack: () => void;
}

export const TokenHeader: React.FC<TokenHeaderProps> = ({
  token,
  chainId,
  priceChangePercentage,
  historyMetrics,
  onBack
}) => {

  // Format profit/loss value with proper sign and color
  const formatProfitLoss = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    const sign = value >= 0 ? '+' : '';
    return `${sign}$${value.toFixed(2)}`;
  };

  // Format ROI as percentage
  const formatROI = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${(value * 100).toFixed(2)}%`;
  };

  // Get color for profit/loss values
  const getProfitLossColor = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'text-white/50';
    return value >= 0 ? 'text-green-400' : 'text-red-400';
  };
  const chainName = CHAIN_NAMES[chainId] || `Chain ${chainId}`;
  
  const getChainLogo = (chainId: number): string => {
    return CHAIN_LOGOS[chainId] || CHAIN_LOGOS[1]; // Fallback to Ethereum
  };
  
  const getTokenLogo = (symbol: string, address: string): string => {
    // Common token logos
    const tokenLogos: { [key: string]: string } = {
      'USDT': 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
      'USDC': 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
      'ETH': 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      'WETH': 'https://assets.coingecko.com/coins/images/2518/large/weth.png',
      'BTC': 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      'WBTC': 'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png',
      'DAI': 'https://assets.coingecko.com/coins/images/9956/large/Badge_Dai.png',
      'UNI': 'https://assets.coingecko.com/coins/images/12504/large/uni.jpg'
    };
    
    return tokenLogos[symbol.toUpperCase()] || `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
  };

  // Mock data for demonstration - you can replace with real API data later
  const mockMetrics = {
    totalMarketSize: 65680000, // $65.68M
    totalLiquidity: 32760000,  // $32.76M  
    borrowRate: 6.19,          // 6.19%
    exchangeRate: 0.98         // 98%
  };

  return (
    <>
      {/* Navigation Header */}
      <div className="bg-[#1F1F1F] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button 
            onClick={onBack}
            className="flex items-center text-white/70 hover:text-[#559779] transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Back to Portfolio
          </button>
        </div>
      </div>

      {/* Morpho-Inspired Token Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-[#181818] rounded-xl border border-white/10 p-4 mb-4">
          {/* Token Pair Display */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={token.logoURI || getTokenLogo(token.symbol, token.address)}
                  alt={token.symbol}
                  className="w-16 h-16 rounded-full ring-2 ring-[#559779]/50 bg-white/10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('coingecko')) {
                      target.src = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token.address}/logo.png`;
                    } else {
                      target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="32" cy="32" r="32" fill="#559779"/>
                          <text x="32" y="40" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">${token.symbol.charAt(0)}</text>
                        </svg>
                      `)}`;
                    }
                  }}
                />
                {/* Chain logo overlay */}
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-[#181818] rounded-full p-0.5 border border-white/30">
                  <img
                    src={getChainLogo(chainId)}
                    alt={chainName}
                    className="w-full h-full rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{token.symbol} / USD</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-white/60 text-sm">{(mockMetrics.exchangeRate * 100).toFixed(0)}%</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/60 text-sm">Exchange rate</span>
                  <Info className="w-4 h-4 text-white/40" />
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white mb-1">{formatPrice(token.price)}</p>
              {priceChangePercentage !== undefined && (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium ${
                  priceChangePercentage >= 0 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {priceChangePercentage > 0 ? '+' : ''}{priceChangePercentage.toFixed(2)}%
                </span>
              )}
            </div>
          </div>

          {/* Portfolio Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
            {/* Your Balance */}
            <div className="bg-[#1F1F1F] rounded-md p-3 border border-white/5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/60 text-xs font-medium">Your Balance</span>
                <Info className="w-3 h-3 text-white/40" />
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-bold text-white">{Number(token.balance).toFixed(6)}</p>
                <p className="text-xs text-white/50">{token.symbol}</p>
                <p className="text-xs text-white/60">${(token.balance * token.price).toFixed(2)} USD</p>
              </div>
            </div>

            {/* Profit/Loss (from 1inch Portfolio API) */}
            <div className="bg-[#1F1F1F] rounded-md p-3 border border-white/5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/60 text-xs font-medium">Profit/Loss</span>
                <Info className="w-3 h-3 text-white/40" />
              </div>
              <div className="space-y-0.5">
                <p className={`text-lg font-bold ${getProfitLossColor(historyMetrics?.profit_abs_usd)}`}>
                  {formatProfitLoss(historyMetrics?.profit_abs_usd)}
                </p>
                <p className="text-xs text-white/50">Total P&L USD</p>
              </div>
            </div>

            {/* ROI (from 1inch Portfolio API) */}
            <div className="bg-[#1F1F1F] rounded-md p-3 border border-white/5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/60 text-xs font-medium">ROI</span>
                <Info className="w-3 h-3 text-white/40" />
              </div>
              <div className="space-y-0.5">
                <p className={`text-lg font-bold ${getProfitLossColor(historyMetrics?.roi)}`}>
                  {formatROI(historyMetrics?.roi)}
                </p>
                <p className="text-xs text-white/50">Return on Investment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
