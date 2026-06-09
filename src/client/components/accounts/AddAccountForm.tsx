'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/client/components/ui';

interface AddAccountFormProps {
  onAccountAdded: () => void;
  isLoading: boolean;
  onSubmit: (name: string) => Promise<void>;
}

export function AddAccountForm({
  onAccountAdded,
  isLoading,
  onSubmit,
}: AddAccountFormProps) {
  const [accountName, setAccountName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accountName.trim()) {
      setError('Account name is required');
      return;
    }

    try {
      await onSubmit(accountName.trim());
      setAccountName('');
      onAccountAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    }
  };

  return (
    <Card className="mb-8 rounded-2xl p-8">
      <CardHeader>
        <CardTitle level={2}>Add New Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Account Name
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g., Checking, Savings, Credit Card"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-900 bg-opacity-30 p-3 text-red-300">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            variant="primary"
            size="md"
          >
            {isLoading ? 'Creating...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
