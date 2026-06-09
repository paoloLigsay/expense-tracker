'use client';

import { useState } from 'react';
import { trpc } from '@/trpc/client';
import { useAddTransaction, useDeleteTransaction } from '@/client/hooks';
import { Button } from '@/client/components/ui';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';

interface TransactionsContainerProps {
  accountId: string;
}

export function TransactionsContainer({ accountId }: TransactionsContainerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const {
    data: transactions = [],
    isLoading,
  } = trpc.transactions.list.useQuery({ accountId });

  const { data: allocations = [] } = trpc.allocations.listByAccount.useQuery({
    accountId,
  });

  const addTransactionMutation = useAddTransaction({
    accountId,
    onSuccess: () => setShowForm(false),
  });

  const deleteTransactionMutation = useDeleteTransaction({ accountId });

  const handleAddTransaction = async (
    amount: string,
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER',
    allocationToId: string,
    allocationFromId: string | undefined,
    description: string,
    date: string,
  ) => {
    setIsCreating(true);
    try {
      await addTransactionMutation.mutateAsync({
        accountId,
        allocationToId,
        allocationFromId,
        amount: parseFloat(amount),
        type,
        description: description || undefined,
        date,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransactionMutation.mutateAsync({ id });
  };

  return (
    <div className="space-y-4">
      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          variant="primary"
          size="md"
          className="sm:w-auto"
        >
          Add Transaction
        </Button>
      )}

      {showForm && (
        <TransactionForm
          accountId={accountId}
          allocations={allocations}
          isLoading={isCreating}
          onSubmit={handleAddTransaction}
          onCancel={() => setShowForm(false)}
        />
      )}

      <TransactionList
        transactions={transactions}
        isLoading={isLoading || isCreating}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
}
