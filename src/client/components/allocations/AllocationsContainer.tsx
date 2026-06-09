'use client';

import { useState } from 'react';
import { trpc } from '@/trpc/client';
import { useCreateAllocation, useDeleteAllocation } from '@/client/hooks';
import { Button } from '@/client/components/ui';
import { AllocationForm } from './AllocationForm';
import { AllocationList } from './AllocationList';

interface AllocationsContainerProps {
  accountId: string;
}

export function AllocationsContainer({ accountId }: AllocationsContainerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const {
    data: allocations = [],
    isLoading,
  } = trpc.allocations.listByAccount.useQuery({ accountId });

  const createAllocationMutation = useCreateAllocation({
    accountId,
    onSuccess: () => setShowForm(false),
  });

  const deleteAllocationMutation = useDeleteAllocation({ accountId });

  const handleCreateAllocation = async (name: string, amount: string) => {
    setIsCreating(true);
    try {
      await createAllocationMutation.mutateAsync({
        accountId,
        name,
        amount: parseFloat(amount),
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAllocation = async (id: string) => {
    await deleteAllocationMutation.mutateAsync({ id });
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
          Add Allocation
        </Button>
      )}

      {showForm && (
        <AllocationForm
          accountId={accountId}
          isLoading={isCreating}
          onSubmit={handleCreateAllocation}
          onCancel={() => setShowForm(false)}
        />
      )}

      <AllocationList
        allocations={allocations}
        isLoading={isLoading || isCreating}
        onDelete={handleDeleteAllocation}
      />
    </div>
  );
}
