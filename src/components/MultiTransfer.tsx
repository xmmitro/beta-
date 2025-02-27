import React, { useState } from 'react';
import { ArrowRightLeft, Plus, Trash2, Loader2, XCircle, CheckCircle } from 'lucide-react';
import { executeMultiTransfer } from '../services/api';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

type Transfer = {
  fromChain: string;
  toChain: string;
  amount: string;
};

type MultiTransferProps = {
  supportedChains: string[];
};

export function MultiTransfer({ supportedChains }: MultiTransferProps) {
  const [transfers, setTransfers] = useState<Transfer[]>([
    { fromChain: '', toChain: '', amount: '' }
  ]);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addTransfer = () => {
    setTransfers([...transfers, { fromChain: '', toChain: '', amount: '' }]);
  };

  const removeTransfer = (index: number) => {
    if (transfers.length > 1) {
      const newTransfers = [...transfers];
      newTransfers.splice(index, 1);
      setTransfers(newTransfers);
    }
  };

  const updateTransfer = (index: number, field: keyof Transfer, value: string) => {
    const newTransfers = [...transfers];
    newTransfers[index] = { ...newTransfers[index], [field]: value };
    setTransfers(newTransfers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults(null);
    setIsLoading(true);

    // Validate transfers
    const isValid = transfers.every(t => t.fromChain && t.toChain && t.amount && !isNaN(parseFloat(t.amount)));
    
    if (!isValid) {
      setError('Please fill in all fields with valid values');
      setIsLoading(false);
      toast.error('Please fill in all fields with valid values');
      return;
    }

    try {
      const data = await executeMultiTransfer(transfers);
      
      if (data.success) {
        setResults(data.results);
        toast.success('Transfers completed successfully!');
      } else {
        setError(data.error || 'Failed to process transfers');
        toast.error(data.error || 'Failed to process transfers');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing transfers';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error processing transfers:', err);
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
      <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Multi-Transfer</h2>
      <p className="text-gray-600 mb-6">
        Transfer tokens between multiple chains in a single operation.
      </p>

      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {transfers.map((transfer, index) => (
          <motion.div 
            key={index} 
            className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">Transfer #{index + 1}</h3>
              {transfers.length > 1 && (
                <motion.button
                  type="button"
                  onClick={() => removeTransfer(index)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor={`fromChain-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  From Chain
                </label>
                <select
                  id={`fromChain-${index}`}
                  value={transfer.fromChain}
                  onChange={(e) => updateTransfer(index, 'fromChain', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white backdrop-blur-sm transition-all duration-300"
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
              
              <div className="relative">
                <label htmlFor={`toChain-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  To Chain
                </label>
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 md:block hidden">
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRightLeft className="h-5 w-5 text-blue-500" />
                  </motion.div>
                </div>
                <select
                  id={`toChain-${index}`}
                  value={transfer.toChain}
                  onChange={(e) => updateTransfer(index, 'toChain', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white backdrop-blur-sm transition-all duration-300"
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
                <label htmlFor={`amount-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  id={`amount-${index}`}
                  type="text"
                  value={transfer.amount}
                  onChange={(e) => updateTransfer(index, 'amount', e.target.value)}
                  placeholder="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white backdrop-blur-sm transition-all duration-300"
                  required
                />
              </div>
            </div>
          </motion.div>
        ))}

        <div className="flex justify-center">
          <motion.button
            type="button"
            onClick={addTransfer}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Transfer
          </motion.button>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Processing...
            </>
          ) : (
            <>
              <ArrowRightLeft className="mr-2 h-5 w-5" />
              Execute Transfers
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

      {results && (
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-md border border-blue-200 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="font-medium text-green-700">Transfers Completed</h3>
          </div>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-4 rounded-md border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <h4 className="font-medium mb-2 text-gray-800">Transfer #{index + 1}</h4>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transaction Hash</p>
                    <p className="text-gray-900 break-all font-mono text-xs">{result.transactionHash}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="flex items-center">
                      {result.status ? (
                        <span className="text-green-600 flex items-center">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Success
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center">
                          <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Failed
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Block Number</p>
                    <p className="text-gray-900 font-mono">{result.blockNumber}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}