'use client';

import { useState } from 'react';
import { trpc } from '@/trpc/client';
import { useCreateAccount } from '@/client/hooks';
import { AddAccountForm } from './AddAccountForm';
import { AccountList } from './AccountList';

export function AccountsContainer() {
  const [isCreating, setIsCreating] = useState(false);

  const { data: accounts = [], isLoading } = trpc.accounts.list.useQuery();

  const createAccountMutation = useCreateAccount();

  const handleCreateAccount = async (name: string) => {
    setIsCreating(true);
    try {
      await createAccountMutation.mutateAsync({ name });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <AddAccountForm
        onAccountAdded={() => {}}
        isLoading={isCreating}
        onSubmit={handleCreateAccount}
      />
      <AccountList accounts={accounts} isLoading={isLoading || isCreating} />
    </div>
  );
}
