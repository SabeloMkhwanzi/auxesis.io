'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// Supported blockchain networks
const supportedChains = [
  { name: 'Arbitrum', logo: '/images/arbitrum-logo.svg' },
  { name: 'Polygon', logo: '/images/polygon-logo.svg' },
  { name: 'Base', logo: '/images/base-logo.svg' },
  { name: 'Optimism', logo: '/images/optimism-logo.svg' },
  { name: 'Avalanche', logo: '/images/avalanche-logo.svg' },
  { name: 'BNB Chain', logo: '/images/bnb-logo.svg' },
  { name: 'Gnosis', logo: '/images/gnosis-logo.svg' },
  { name: 'Linea', logo: '/images/linea-logo.svg' },
  { name: 'zkSync', logo: '/images/zksync-logo.svg' },
  // Add Sonic and Unichain from your custom chain support
  { name: 'Sonic', logo: '/images/sonic-logo.svg' },
  { name: 'Unichain', logo: '/images/unichain-logo.svg' },
];

export default function SupportedChains() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Preload images
  useEffect(() => {
    const imagePromises = supportedChains.map(chain => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.src = chain.logo;
        img.onload = resolve;
        img.onerror = reject;
      });
    });
    
    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch(err => {
        console.error('Error preloading images:', err);
        setImagesLoaded(true); // Show anyway even if some fail
      });
  }, []);
  
  // Add marquee animation via CSS
  useEffect(() => {
    const marqueeStyle = `
      .marquee {
        position: relative;
        overflow: hidden;
      }
      .marquee-content {
        display: flex;
        animation: marquee 30s linear infinite;
        white-space: nowrap;
      }
      @keyframes marquee {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      @media (max-width: 640px) {
        .marquee-content {
          animation: marquee 20s linear infinite;
        }
      }
    `;
    const style = document.createElement('style');
    style.innerHTML = marqueeStyle;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="mt-4 md:mt-8 mb-4 md:mb-8">
      <div className="bg-black backdrop-blur-sm rounded-xl md:rounded-2xl mx-2 md:mx-8 py-3 md:py-4 relative marquee overflow-hidden">
        {/* Left fade mask */}
        <div className="absolute left-0 top-0 bottom-0 w-[60px] md:w-[500px] bg-gradient-to-r from-black to-transparent z-10"></div>
        {/* Right fade mask */}
        <div className="absolute right-0 top-0 bottom-0 w-[60px] md:w-[500px] bg-gradient-to-l from-black to-transparent z-10"></div>
        <div className={`marquee-content ${!imagesLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
          {/* First set of logos */}
          {supportedChains.map((chain, index) => (
            <div key={index} className="flex items-center justify-center flex-shrink-0 mx-3 md:mx-6">
              <Image 
                src={chain.logo} 
                alt={chain.name}
                width={32}
                height={32}
                className="h-6 md:h-8 w-auto object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                title={chain.name}
                priority={index < 5} // Prioritize loading first 5 images
              />
            </div>
          ))}
          {/* Duplicate set for continuous loop */}
          {supportedChains.map((chain, index) => (
            <div key={`second-${index}`} className="flex items-center justify-center flex-shrink-0 mx-3 md:mx-6">
              <Image 
                src={chain.logo} 
                alt={chain.name}
                width={32}
                height={32}
                className="h-6 md:h-8 w-auto object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                title={chain.name}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
