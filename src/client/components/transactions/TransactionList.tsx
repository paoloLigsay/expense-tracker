'use client';

import { X } from 'lucide-react';
import { Card, List, ListItem } from '@/client/components/ui';

interface Transaction {
  id: string;
  amount: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  description: string | null;
  date: string | Date;
  allocationFrom: { name: string } | null;
  allocationTo: { name: string } | null;
}

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onDelete?: (id: string) => Promise<void>;
}

const typeIcons = {
  INCOME: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19v-7m0 0V5m0 7H5m7 0h7" />
    </svg>
  ),
  EXPENSE: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
    </svg>
  ),
  TRANSFER: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
};

const typeIconBg = {
  INCOME: 'bg-lime-400 text-black',
  EXPENSE: 'bg-red-600 text-white',
  TRANSFER: 'bg-blue-600 text-white',
};

const typeAmountColor = {
  INCOME: 'text-lime-400',
  EXPENSE: 'text-red-400',
  TRANSFER: 'text-blue-400',
};

const typeAmountPrefix = {
  INCOME: '+',
  EXPENSE: '-',
  TRANSFER: '→',
};

export function TransactionList({ transactions, isLoading, onDelete }: TransactionListProps) {
  if (isLoading) {
    return (
      <Card>
        <div className="text-slate-400">Loading transactions...</div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="text-center">
        <div className="text-slate-400">
          No transactions yet. Add one to get started!
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
      <List gap="md">
        {transactions.map((transaction) => (
          <ListItem
            key={transaction.id}
            className="flex gap-3"
          >
            <div className={`shrink-0 w-12 h-12 rounded-full ${typeIconBg[transaction.type]} flex items-center justify-center`}>
              {typeIcons[transaction.type]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <h4 className="font-semibold text-white truncate">
                  {transaction.description || 'Transaction'}
                </h4>
                <span className="shrink-0 text-xs font-medium text-slate-500">
                  {transaction.type === 'TRANSFER'
                    ? `${transaction.allocationFrom?.name || 'Unknown'} → ${transaction.allocationTo?.name || 'Unknown'}`
                    : transaction.allocationTo?.name || transaction.allocationFrom?.name || 'Unknown'
                  }
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(transaction.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-end gap-2">
              <div className={`font-semibold text-sm ${typeAmountColor[transaction.type]}`}>
                {typeAmountPrefix[transaction.type]} ${parseFloat(transaction.amount).toFixed(2)}
              </div>
              {onDelete && (
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                  title="Delete transaction"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
