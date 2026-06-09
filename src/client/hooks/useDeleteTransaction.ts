'use client';

import { trpc } from '@/trpc/client';

interface UseDeleteTransactionProps {
  accountId: string;
  onSuccess?: () => void;
}

export function useDeleteTransaction({ accountId, onSuccess }: UseDeleteTransactionProps) {
  const utils = trpc.useUtils();

  return trpc.transactions.delete.useMutation({
    onSuccess: () => {
      utils.transactions.list.invalidate({ accountId });
      utils.allocations.listByAccount.invalidate({ accountId });
      onSuccess?.();
    },
  });
}
