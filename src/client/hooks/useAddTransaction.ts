'use client';

import { trpc } from '@/trpc/client';

interface UseAddTransactionProps {
  accountId: string;
  onSuccess?: () => void;
}

export function useAddTransaction({ accountId, onSuccess }: UseAddTransactionProps) {
  const utils = trpc.useUtils();

  return trpc.transactions.add.useMutation({
    onSuccess: () => {
      utils.transactions.list.invalidate({ accountId });
      utils.allocations.listByAccount.invalidate({ accountId });
      onSuccess?.();
    },
  });
}
