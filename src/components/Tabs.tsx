import React, { createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';

type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function Tabs({ 
  children, 
  value, 
  onValueChange 
}: { 
  children: React.ReactNode; 
  value: string; 
  onValueChange: (value: string) => void;
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={`flex space-x-2 overflow-x-auto pb-2 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ 
  children, 
  value, 
  className = '' 
}: { 
  children: React.ReactNode; 
  value: string; 
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const isActive = context.value === value;
  
  return (
    <motion.button
      className={`px-4 py-2 rounded-md font-medium text-sm transition-colors
        ${isActive 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } ${className}`}
      onClick={() => context.onValueChange(value)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}

export function TabsContent({ 
  children, 
  value 
}: { 
  children: React.ReactNode; 
  value: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  if (context.value !== value) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}