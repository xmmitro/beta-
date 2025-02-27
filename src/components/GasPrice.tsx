import React, { useState } from 'react';
import { Coins, Loader2, XCircle, CheckCircle } from 'lucide-react';
import { getGasPrice } from '../services/api';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

type GasPriceProps = {
  supportedChains: string[];
};

export function GasPrice({ supportedChains }: GasPriceProps) {
  const [chainKey, setChainKey] = useState('');
  const [gasPrice, setGasPrice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setGasPrice(null);
    setIsLoading(true);

    if (!chainKey) {
      setError('Please select a chain');
      setIsLoading(false);
      toast.error('Please select a chain');
      return;
    }

    try {
      const data = await getGasPrice(chainKey);
      
      if (data.success) {
        setGasPrice(data.gasPrice);
        toast.success('Gas price retrieved successfully!');
      } else {
        setError(data.error || 'Failed to fetch gas price');
        toast.error(data.error || 'Failed to fetch gas price');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching gas price';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching gas price:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to determine gas price category
  const getGasPriceCategory = (price: number) => {
    if (price < 10) return { label: 'Low', color: 'text-green-500' };
    if (price < 50) return { label: 'Medium', color: 'text-yellow-500' };
    return { label: 'High', color: 'text-red-500' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Gas Price</h2>
      <p className="text-gray-600 mb-6">
        Check the current gas price for a specific blockchain.
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
              <Coins className="mr-2 h-4 w-4" />
              Check Gas Price
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

      {gasPrice !== null && (
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-md border border-blue-200 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="font-medium text-green-700">Gas Price Retrieved</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white bg-opacity-70 p-3 rounded-md backdrop-blur-sm">
              <p className="text-sm font-medium text-gray-500">Chain</p>
              <p className="text-gray-900">{chainKey}</p>
            </div>
            
            <div className="bg-white bg-opacity-70 p-3 rounded-md backdrop-blur-sm">
              <p className="text-sm font-medium text-gray-500">Current Gas Price</p>
              <div className="flex items-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {parseFloat(gasPrice).toFixed(2)}
                </p>
                <p className="ml-2 text-lg font-medium text-gray-700">Gwei</p>
              </div>
              <p className={`text-sm mt-1 ${getGasPriceCategory(parseFloat(gasPrice)).color}`}>
                {getGasPriceCategory(parseFloat(gasPrice)).label} gas price
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}