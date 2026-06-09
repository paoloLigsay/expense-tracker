'use client';

import { trpc } from '@/trpc/client';

interface UseDeleteAllocationProps {
  accountId: string;
  onSuccess?: () => void;
}

export function useDeleteAllocation({ accountId, onSuccess }: UseDeleteAllocationProps) {
  const utils = trpc.useUtils();

  return trpc.allocations.delete.useMutation({
    onSuccess: () => {
      utils.allocations.listByAccount.invalidate({ accountId });
      onSuccess?.();
    },
  });
}
