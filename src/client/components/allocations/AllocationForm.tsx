'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/client/components/ui';

interface AllocationFormProps {
  accountId: string;
  isLoading: boolean;
  onSubmit: (name: string, amount: string) => Promise<void>;
  onCancel: () => void;
}

export function AllocationForm({
  isLoading,
  onSubmit,
  onCancel,
}: AllocationFormProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!amount || parseFloat(amount) < 0) {
      setError('Amount must be positive');
      return;
    }

    try {
      await onSubmit(name.trim(), amount);
      setName('');
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create allocation');
    }
  };

  return (
    <Card className="border-slate-700 bg-slate-800">
      <CardHeader>
        <CardTitle level={3}>Add Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Allocation Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Groceries, Entertainment"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white placeholder-slate-500 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Initial Amount
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
              {isLoading ? 'Creating...' : 'Create'}
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
