'use client';

import { trpc } from '@/trpc/client';

interface UseCreateAllocationProps {
  accountId: string;
  onSuccess?: () => void;
}

export function useCreateAllocation({ accountId, onSuccess }: UseCreateAllocationProps) {
  const utils = trpc.useUtils();

  return trpc.allocations.create.useMutation({
    onSuccess: () => {
      utils.allocations.listByAccount.invalidate({ accountId });
      onSuccess?.();
    },
  });
}
