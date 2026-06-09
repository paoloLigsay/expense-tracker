'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/client/components/ui';

interface Allocation {
  id: string;
  name: string;
}

interface TransactionFormProps {
  accountId: string;
  allocations: Allocation[];
  isLoading: boolean;
  onSubmit: (
    amount: string,
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER',
    allocationToId: string,
    allocationFromId: string | undefined,
    description: string,
    date: string,
  ) => Promise<void>;
  onCancel: () => void;
}

export function TransactionForm({
  allocations,
  isLoading,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE' | 'TRANSFER'>('EXPENSE');
  const [allocationToId, setAllocationToId] = useState(allocations[0]?.id || '');
  const [allocationFromId, setAllocationFromId] = useState(allocations[0]?.id || '');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (!allocationToId) {
      setError('Please select a destination allocation');
      return;
    }

    if (type === 'TRANSFER' && !allocationFromId) {
      setError('Please select a source allocation for transfers');
      return;
    }

    if (!date) {
      setError('Date is required');
      return;
    }

    try {
      await onSubmit(amount, type, allocationToId, type === 'TRANSFER' ? allocationFromId : undefined, description, date);
      setAmount('');
      setType('EXPENSE');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
    }
  };

  return (
    <Card className="border-slate-700 bg-slate-800">
      <CardHeader>
        <CardTitle level={3}>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'INCOME' | 'EXPENSE' | 'TRANSFER')}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
              disabled={isLoading}
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>
        </div>

        {type === 'TRANSFER' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                From Allocation
              </label>
              <select
                value={allocationFromId}
                onChange={(e) => setAllocationFromId(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
                disabled={isLoading || allocations.length === 0}
              >
                {allocations.length === 0 ? (
                  <option disabled>No allocations available</option>
                ) : (
                  allocations.map((alloc) => (
                    <option key={alloc.id} value={alloc.id}>
                      {alloc.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                To Allocation
              </label>
              <select
                value={allocationToId}
                onChange={(e) => setAllocationToId(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
                disabled={isLoading || allocations.length === 0}
              >
                {allocations.length === 0 ? (
                  <option disabled>No allocations available</option>
                ) : (
                  allocations.map((alloc) => (
                    <option key={alloc.id} value={alloc.id}>
                      {alloc.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        ) : (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Allocation
            </label>
            <select
              value={allocationToId}
              onChange={(e) => setAllocationToId(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
              disabled={isLoading || allocations.length === 0}
            >
              {allocations.length === 0 ? (
                <option disabled>No allocations available</option>
              ) : (
                allocations.map((alloc) => (
                  <option key={alloc.id} value={alloc.id}>
                    {alloc.name}
                  </option>
                ))
              )}
            </select>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Groceries at Whole Foods"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
              disabled={isLoading}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-900 bg-opacity-30 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              size="sm"
              fullWidth
            >
              {isLoading ? 'Adding...' : 'Add Transaction'}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              variant="secondary"
              size="sm"
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
