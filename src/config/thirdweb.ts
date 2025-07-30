import { createThirdwebClient } from "thirdweb";
import { zkSync, linea, gnosis, ethereum, arbitrum, polygon, base, optimism, bsc, avalanche } from "thirdweb/chains";
import { defineChain } from "thirdweb/chains";

// Custom chain definitions for chains not yet in thirdweb SDK
export const sonic = defineChain({
  id: 146,
  name: "Sonic",
  nativeCurrency: {
    name: "Sonic",
    symbol: "S",
    decimals: 18,
  },
  rpc: "https://rpc.soniclabs.com",
  blockExplorers: [
    {
      name: "Sonic Explorer",
      url: "https://explorer.soniclabs.com",
    },
  ],
});

export const unichain = defineChain({
  id: 130,
  name: "Unichain",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpc: "https://mainnet.unichain.world",
  blockExplorers: [
    {
      name: "Unichain Explorer",
      url: "https://explorer.unichain.world",
    },
  ],
});

// Create the thirdweb client
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// Supported chains for the portfolio autopilot
export const supportedChains = [
  ethereum,
  arbitrum, 
  polygon,
  base,
  optimism,
  bsc,
  avalanche,
  gnosis,
  linea,
  zkSync,
  sonic,
  unichain
];

// Chain configuration for display
export const chainConfig = {
  [ethereum.id]: {
    name: "Ethereum",
    color: "#627EEA",
    nativeCurrency: "ETH",
  },
  [arbitrum.id]: {
    name: "Arbitrum",
    color: "#28A0F0",
    nativeCurrency: "ETH",
  },
  [polygon.id]: {
    name: "Polygon",
    color: "#8247E5",
    nativeCurrency: "MATIC",
  },
  [base.id]: {
    name: "Base",
    color: "#0052FF",
    nativeCurrency: "ETH",
  },
  [optimism.id]: {
    name: "Optimism",
    color: "#FF0420",
    nativeCurrency: "ETH",
  },
  [bsc.id]: {
    name: "BSC",
    color: "#F3BA2F",
    nativeCurrency: "BNB",
  },
  [avalanche.id]: {
    name: "Avalanche",
    color: "#E84142",
    nativeCurrency: "AVAX",
  },
  [sonic.id]: {
    name: "Sonic",
    color: "#FF6B35",
    nativeCurrency: "S",
  },
  [unichain.id]: {
    name: "Unichain",
    color: "#FF007A",
    nativeCurrency: "ETH",
  },
};
