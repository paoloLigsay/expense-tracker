'use client';

import Link from 'next/link';
import { Card, List, ListItem } from '@/client/components/ui';

interface Account {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AccountListProps {
  accounts: Account[];
  isLoading: boolean;
}

export function AccountList({ accounts, isLoading }: AccountListProps) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl p-8">
        <div className="text-slate-400">Loading accounts...</div>
      </Card>
    );
  }

  if (accounts.length === 0) {
    return (
      <Card className="rounded-2xl p-8 text-center">
        <div className="text-slate-400">
          No accounts yet. Create one to get started!
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-white">Your Accounts</h2>
      <List gap="md">
        {accounts.map((account) => (
          <li key={account.id}>
            <Link
              href={`/accounts/${account.id}`}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-lime-400 hover:bg-slate-800 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{account.name}</h3>
                <p className="text-xs text-slate-500">
                  Created {new Date(account.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="ml-2 shrink-0 text-right">
                <div className="text-lime-400 font-semibold">$0.00</div>
              </div>
            </Link>
          </li>
        ))}
      </List>
    </div>
  );
}
