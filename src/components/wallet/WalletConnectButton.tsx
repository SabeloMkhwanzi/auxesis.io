'use client';

import React from 'react';
import { ConnectButton } from 'thirdweb/react';
import { client, supportedChains } from '@/config/thirdweb';
import { useWallet } from './WalletProvider';

interface WalletConnectButtonProps {
  className?: string;
}

export const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({ 
  className = '' 
}) => {
  const { setManualMode } = useWallet();
  
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <ConnectButton
        client={client}
        chains={supportedChains}
        connectButton={{
          label: "Connect to Portfolio Autopilot",
          className: "!bg-blue-600 !text-white !font-semibold !px-6 !py-3 !rounded-lg hover:!bg-blue-700 transition-colors",
        }}
        connectModal={{
          title: "Connect Your Wallet",
          titleIcon: "/logo.png",
          size: "wide",
        }}
        detailsButton={{
          displayBalanceToken: {
            [1]: "0x0000000000000000000000000000000000000000", // ETH on Ethereum
            [42161]: "0x0000000000000000000000000000000000000000", // ETH on Arbitrum
            [137]: "0x0000000000000000000000000000000000000000", // MATIC on Polygon
            [8453]: "0x0000000000000000000000000000000000000000", // ETH on Base
          },
          className: "!bg-gray-100 !text-gray-900 !font-medium !px-4 !py-2 !rounded-lg hover:!bg-gray-200 transition-colors",
        }}
        supportedTokens={{
          [1]: [
            {
              address: "0xA0b86a33E6441b8dB4C6b5b2e2e3c3e4e5f6g7h8",
              name: "USD Coin",
              symbol: "USDC",
              icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
            },
            {
              address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
              name: "Tether USD",
              symbol: "USDT",
              icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
            },
          ],
          [42161]: [
            {
              address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
              name: "USD Coin",
              symbol: "USDC",
              icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
            },
          ],
        }}
        theme="light"
        autoConnect={true}
        onConnect={(wallet) => {
          console.log("Wallet connected:", wallet);
          // Auto-switch to wallet mode when connected
          setManualMode(false);
        }}
        onDisconnect={(info) => {
          console.log("Wallet disconnected:", info);
        }}
      />
    </div>
  );
};
