import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { checkTxStatus } from '../services/api';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

type TransactionStatusProps = {
  supportedChains: string[];
};

export function TransactionStatus({ supportedChains }: TransactionStatusProps) {
  const [chainKey, setChainKey] = useState('');
  const [txHash, setTxHash] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);

    if (!chainKey || !txHash) {
      setError('Please provide both chain and transaction hash');
      setIsLoading(false);
      toast.error('Please provide both chain and transaction hash');
      return;
    }

    try {
      const data = await checkTxStatus(chainKey, txHash);
      
      if (data.success) {
        setResult(data.txReceipt);
        toast.success('Transaction found!');
      } else {
        setError(data.error || 'Failed to fetch transaction status');
        toast.error(data.error || 'Failed to fetch transaction status');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching transaction status';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching transaction status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Transaction Status</h2>
      <p className="text-gray-600 mb-6">
        Check the status of a transaction by providing the chain and transaction hash.
      </p>

      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div>
          <label htmlFor="chainKey" className="block text-sm font-medium text-gray-700 mb-1">
            Chain
          </label>
          <select
            id="chainKey"
            value={chainKey}
            onChange={(e) => setChainKey(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 backdrop-blur-sm transition-all duration-300"
            required
          >
            <option value="">Select a chain</option>
            {supportedChains.map((chain) => (
              <option key={chain} value={chain}>
                {chain}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="txHash" className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Hash
          </label>
          <input
            id="txHash"
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 backdrop-blur-sm transition-all duration-300"
            required
          />
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Checking...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Check Status
            </>
          )}
        </motion.button>
      </motion.form>

      {error && (
        <motion.div 
          className="p-4 bg-red-50 border border-red-200 rounded-md mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </motion.div>
      )}

      {result && (
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-md border border-blue-200 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="font-medium text-green-700">Transaction Found</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white bg-opacity-70 p-3 rounded-md backdrop-blur-sm">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-gray-900 flex items-center">
                {result.status ? (
                  <><span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span> Success</>
                ) : (
                  <><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span> Failed</>
                )}
              </p>
            </div>
            
            <div className="bg-white bg-opacity-70 p-3 rounded-md backdrop-blur-sm">
              <p className="text-sm font-medium text-gray-500">Block Number</p>
              <p className="text-gray-900 font-mono">{result.blockNumber}</p>
            </div>
            
            <div className="bg-white bg-opacity-70 p-3 rounded-md backdrop-blur-sm">
              <p className="text-sm font-medium text-gray-500">Gas Used</p>
              <p className="text-gray-900 font-mono">{result.gasUsed}</p>
            </div>
            
            <div className="bg-white bg-opacity-70 p-3 rounded-md backdrop-blur-sm">
              <p className="text-sm font-medium text-gray-500">Transaction Hash</p>
              <p className="text-gray-900 break-all font-mono text-xs">{result.transactionHash}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}