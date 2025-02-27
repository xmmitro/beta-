import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/Tabs';
import { TransactionStatus } from './components/TransactionStatus';
import { WalletBalance } from './components/WalletBalance';
import { GasPrice } from './components/GasPrice';
import { SupportedChains } from './components/SupportedChains';
import { MultiTransfer } from './components/MultiTransfer';
import { Wallet, Activity, Coins, List, ArrowRightLeft, Zap } from 'lucide-react';
import { useSupportedChains } from './services/api';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [activeTab, setActiveTab] = useState('transaction');
  const { chains: supportedChains, isLoading } = useSupportedChains();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block relative w-20 h-20">
            <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-2 left-2 right-2 bottom-2 border-4 border-purple-500 border-t-transparent rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="mt-4 text-white text-lg font-medium">Loading Blockchain Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.h1 
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Zap className="mr-2 h-6 w-6 text-blue-500" />
            Blockchain Dashboard
          </motion.h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mounted && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <TabsList className="mb-8">
                <TabsTrigger value="transaction" className="flex items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  Transaction Status
                </TabsTrigger>
                <TabsTrigger value="balance" className="flex items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  Wallet Balance
                </TabsTrigger>
                <TabsTrigger value="gas" className="flex items-center">
                  <Coins className="mr-2 h-4 w-4" />
                  Gas Price
                </TabsTrigger>
                <TabsTrigger value="chains" className="flex items-center">
                  <List className="mr-2 h-4 w-4" />
                  Supported Chains
                </TabsTrigger>
                <TabsTrigger value="transfer" className="flex items-center">
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Multi-Transfer
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <motion.div 
              className="bg-white shadow-lg rounded-lg p-6 border border-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <TabsContent value="transaction">
                <TransactionStatus supportedChains={supportedChains} />
              </TabsContent>
              
              <TabsContent value="balance">
                <WalletBalance supportedChains={supportedChains} />
              </TabsContent>
              
              <TabsContent value="gas">
                <GasPrice supportedChains={supportedChains} />
              </TabsContent>
              
              <TabsContent value="chains">
                <SupportedChains chains={supportedChains} />
              </TabsContent>
              
              <TabsContent value="transfer">
                <MultiTransfer supportedChains={supportedChains} />
              </TabsContent>
            </motion.div>
          </Tabs>
        )}
      </main>
      
      <footer className="bg-white border-t border-blue-100 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Blockchain Dashboard • Made by 0xSumitro
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;