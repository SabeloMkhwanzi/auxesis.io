'use client';

import ClientOnlyPortfolio from '@/components/ClientOnlyPortfolio';
import NavBar from '@/components/landing/NavBar';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#1F1F1F] text-white">
      {/* Navigation Bar */}
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Portfolio Dashboard</h1>
        
        {/* Show portfolio component which has its own wallet connection UI */}
        <ClientOnlyPortfolio />
      </div>
    </div>
  );
}
