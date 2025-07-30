import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { WalletProvider } from "@/components/wallet";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cross-Chain Portfolio Autopilot",
  description: "Intelligent DeFi portfolio management across multiple chains using 1inch infrastructure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} antialiased font-sans`}
      >
        <ThirdwebProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
