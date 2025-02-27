import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://173.212.203.53:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const fetchChains = async () => {
  try {
    const response = await api.get('/chains');
    return response.data;
  } catch (error) {
    console.error('Error fetching chains:', error);
    throw error;
  }
};

export const checkTxStatus = async (chainKey: string, txHash: string) => {
  try {
    const response = await api.post('/txStatus', { chainKey, txHash });
    return response.data;
  } catch (error) {
    console.error('Error checking transaction status:', error);
    throw error;
  }
};

export const checkBalance = async (chainKey: string) => {
  try {
    const response = await api.post('/checkBalance', { chainKey });
    return response.data;
  } catch (error) {
    console.error('Error checking balance:', error);
    throw error;
  }
};

export const getGasPrice = async (chainKey: string) => {
  try {
    const response = await api.post('/getGasPrice', { chainKey });
    return response.data;
  } catch (error) {
    console.error('Error getting gas price:', error);
    throw error;
  }
};

export const executeMultiTransfer = async (transfers: Array<{fromChain: string, toChain: string, amount: string}>) => {
  try {
    const response = await api.post('/multiTransfer', { transfers });
    return response.data;
  } catch (error) {
    console.error('Error executing multi-transfer:', error);
    throw error;
  }
};

// Custom hook for fetching chains
import { useState, useEffect } from 'react';

export function useSupportedChains() {
  const [chains, setChains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getChains = async () => {
      try {
        setIsLoading(true);
        const response = await fetchChains();
        if (response.success) {
          setChains(response.chains);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        console.error('Error fetching chains:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getChains();
  }, []);

  return { chains, isLoading, error };
}