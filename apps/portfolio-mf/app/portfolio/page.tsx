'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTransactionSchema, CreateTransaction } from '@vlr-finance/schemas';

export default function PortfolioPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTransaction>({
    resolver: zodResolver(createTransactionSchema),
  });

  const onSubmit = async (data: CreateTransaction) => {
    try {
      const response = await fetch('/api/portfolio/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setTransactions((prev) => [result, ...prev]);
    } catch (error) {
      console.error('Transaction error:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Portfolio Management</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Symbol</label>
            <input
              type="text"
              {...register('symbol')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.symbol && <p className="text-red-500 text-sm">{errors.symbol.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              {...register('type')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              step="0.0001"
              {...register('quantity', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Add Transaction
        </button>
      </form>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {transactions.map((tx, index) => (
          <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
            <span className="font-medium">{tx.symbol}</span>
            <span className="text-sm text-gray-600">{tx.type}</span>
            <span className="text-sm">Qty: {tx.quantity}</span>
            <span className="text-sm">Price: ${tx.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
