import React from 'react';
import { List, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

type SupportedChainsProps = {
  chains: string[];
};

export function SupportedChains({ chains }: SupportedChainsProps) {
  // Map of chain keys to their respective explorer URLs
  const chainExplorers: Record<string, string> = {
    ETH: 'https://sepolia.etherscan.io',
    POLYGON: 'https://polygonscan.com',
    BNB: 'https://bscscan.com',
    OP: 'https://optimistic.etherscan.io',
    BASE: 'https://basescan.org',
    ARB: 'https://arbiscan.io',
    Holesky: 'https://holesky.etherscan.io',
  };

  // Map of chain keys to their native tokens
  const chainTokens: Record<string, string> = {
    ETH: 'ETH',
    POLYGON: 'POL',
    BNB: 'BNB',
    OP: 'ETH',
    BASE: 'ETH',
    ARB: 'ETH',
    Holesky: 'ETH',
  };

  // Chain logos (using emoji as placeholders)
  const chainLogos: Record<string, string> = {
    ETH: '💎',
    POLYGON: '🔷',
    BNB: '🔶',
    OP: '⚡',
    BASE: '🔵',
    ARB: '🔴',
    Holesky: '🟡',
  };

  // Chain background colors
  const chainColors: Record<string, string> = {
    ETH: 'from-blue-500 to-purple-500',
    POLYGON: 'from-purple-500 to-indigo-500',
    BNB: 'from-yellow-500 to-orange-500',
    OP: 'from-red-500 to-pink-500',
    BASE: 'from-blue-500 to-cyan-500',
    ARB: 'from-blue-500 to-indigo-500',
    Holesky: 'from-yellow-500 to-amber-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Supported Chains</h2>
      <p className="text-gray-600 mb-6">
        The following blockchain networks are supported by this application.
      </p>

      <motion.div 
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-md border border-blue-200 p-6 shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chains.map((chain, index) => (
            <motion.div 
              key={chain} 
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${chainColors[chain] || 'from-gray-500 to-gray-600'} opacity-10`}></div>
              
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{chainLogos[chain] || '🔗'}</span>
                  <h3 className="font-bold text-gray-900">{chain}</h3>
                </div>
                {chainExplorers[chain] && (
                  <a 
                    href={chainExplorers[chain]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              
              <div className="relative z-10">
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="font-medium">Native Token:</span>
                  <span className="ml-2 px-2 py-1 bg-gray-100 rounded-md text-xs font-mono">
                    {chainTokens[chain] || 'Unknown'}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}