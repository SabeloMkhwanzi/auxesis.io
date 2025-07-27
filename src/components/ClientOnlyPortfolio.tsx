'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamic import to prevent hydration issues
const PortfolioDashboard = dynamic(() => import('./PortfolioDashboard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Portfolio...</p>
        </div>
      </div>
    </div>
  ),
});

export default function ClientOnlyPortfolio() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Initializing...</p>
          </div>
        </div>
      </div>
    );
  }

  return <PortfolioDashboard />;
}
