'use client';

import React from 'react';
import { ConnectButton, darkTheme, useActiveWallet } from 'thirdweb/react';
import { client, supportedChains } from '@/config/thirdweb';
import { useWallet } from './WalletProvider';
import { coinGeckoLogoService } from '@/services/coinGeckoLogoService';
import { SUPPORTED_CHAINS, CHAIN_LOGOS } from '@/utils/constants';

interface WalletConnectButtonProps {
  className?: string;
}

// Custom theme matching our design system
const customTheme = darkTheme({
  colors: {
    modalBg: '#181818',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    separatorLine: 'rgba(255, 255, 255, 0.1)',
    primaryText: '#FFFFFF',
    secondaryText: 'rgba(255, 255, 255, 0.7)',
    accentText: '#559779',
    primaryButtonBg: '#243029',
    primaryButtonText: '#FFFFFF',
    connectedButtonBg: '#243029',
    connectedButtonBgHover: '#2d3532',
    secondaryButtonBg: '#2d3532',
    secondaryButtonText: '#FFFFFF',
    secondaryButtonHoverBg: '#559779',
  },
});

// Popular token addresses for each chain
const POPULAR_TOKENS: Record<number, Array<{ address: string; name: string; symbol: string }>> = {
  [1]: [ // Ethereum
    { address: "0xA0b86a33E6441b8dB4C6b5b2e2e3c3e4e5f6g7h8", name: "USD Coin", symbol: "USDC" },
    { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", name: "Tether USD", symbol: "USDT" },
  ],
  [42161]: [ // Arbitrum
    { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", name: "USD Coin", symbol: "USDC" },
    { address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", name: "Tether USD", symbol: "USDT" },
  ],
  [137]: [ // Polygon
    { address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", name: "USD Coin", symbol: "USDC" },
    { address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", name: "Tether USD", symbol: "USDT" },
  ],
  [56]: [ // BNB Chain
    { address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", name: "USD Coin", symbol: "USDC" },
    { address: "0x55d398326f99059fF775485246999027B3197955", name: "Tether USD", symbol: "USDT" },
  ],
  [10]: [ // Optimism
    { address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607", name: "USD Coin", symbol: "USDC" },
    { address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", name: "Tether USD", symbol: "USDT" },
  ],
  [8453]: [ // Base
    { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", name: "USD Coin", symbol: "USDC" },
  ],
};

// Create dynamic token configuration with CoinGecko logos
const createTokenConfig = async () => {
  const tokens: Record<number, Array<{ address: string; name: string; symbol: string; icon: string }>> = {};
  
  // Generate token configs for all supported chains
  for (const chainId of Object.keys(SUPPORTED_CHAINS).map(Number)) {
    const chainTokens = POPULAR_TOKENS[chainId];
    if (chainTokens && chainTokens.length > 0) {
      tokens[chainId] = await Promise.all(
        chainTokens.map(async (token) => ({
          ...token,
          icon: await coinGeckoLogoService.getTokenLogo(token.address, chainId, token.symbol)
        }))
      );
    }
  }
  
  return tokens;
};

export const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({ 
  className = '' 
}) => {
  const { setManualMode } = useWallet();
  const [supportedTokens, setSupportedTokens] = React.useState<any>({});
  const activeWallet = useActiveWallet();
  
  // Get current chain icon
  const getCurrentChainIcon = () => {
    const chainId = activeWallet?.getChain()?.id;
    return chainId ? CHAIN_LOGOS[chainId] : CHAIN_LOGOS[1]; // Default to Ethereum
  };
  
  // Update avatar with chain icon
  React.useEffect(() => {
    const updateAvatarIcon = () => {
      const avatarElement = document.querySelector('.tw-connected-wallet__account_avatar');
      if (avatarElement && activeWallet) {
        const chainIcon = getCurrentChainIcon();
        (avatarElement as HTMLElement).style.backgroundImage = `url('${chainIcon}')`;
        (avatarElement as HTMLElement).style.backgroundSize = 'cover';
        (avatarElement as HTMLElement).style.backgroundPosition = 'center';
        (avatarElement as HTMLElement).style.backgroundRepeat = 'no-repeat';
      }
    };
    
    // Update immediately and on wallet/chain changes
    updateAvatarIcon();
    
    // Set up observer to catch when the avatar element appears
    const observer = new MutationObserver(updateAvatarIcon);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, [activeWallet]);
  
  // Load token configuration with CoinGecko logos on mount
  React.useEffect(() => {
    const loadTokens = async () => {
      try {
        const tokens = await createTokenConfig();
        setSupportedTokens(tokens);
      } catch (error) {
        console.warn('Failed to load token logos:', error);
        // Fallback to basic configuration without logos
        setSupportedTokens({
          [1]: [
            { address: "0xA0b86a33E6441b8dB4C6b5b2e2e3c3e4e5f6g7h8", name: "USD Coin", symbol: "USDC" },
            { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", name: "Tether USD", symbol: "USDT" }
          ],
          [42161]: [
            { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", name: "USD Coin", symbol: "USDC" }
          ]
        });
      }
    };
    
    loadTokens();
  }, []);
  
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div style={{ fontSize: 'inherit' }}>
        <ConnectButton
        client={client}
        chains={supportedChains}
        connectButton={{
          label: "Connect Wallet",
          className: "!bg-[#243029] hover:!text-[#559779] !text-[#FFFFFF] !font-medium !text-xs md:!text-sm !px-3 md:!px-6 !py-1.5 md:!py-2 !rounded-[1rem] !border !border-white/10 hover:!border-[#559779] !transition-colors !min-h-0 !h-auto !w-auto !max-w-none",
        }}
        connectModal={{
          title: "Connect Your Wallet",
          titleIcon: "/logo.png",
          size: "wide",
          welcomeScreen: {
            title: "Welcome to Auxesis Portfolio Autopilot",
            subtitle: "Connect your wallet to start managing your cross-chain DeFi portfolio",
          },
        }}
        detailsButton={{
          className: "!bg-[#243029] hover:!text-[#559779] !text-[#FFFFFF] !font-medium !text-xs md:!text-sm !px-3 md:!px-6 !py-1.5 md:!py-2 !rounded-[1rem] !border !border-white/10 hover:!border-[#559779] !transition-colors !min-h-0 !h-auto !w-auto !max-w-none",
        }}
        supportedTokens={supportedTokens}
        theme={customTheme}
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
    </div>
  );
};
