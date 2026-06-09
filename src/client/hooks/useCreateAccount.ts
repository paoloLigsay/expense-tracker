'use client';

import { trpc } from '@/trpc/client';

interface UseCreateAccountProps {
  onSuccess?: () => void;
}

export function useCreateAccount({ onSuccess }: UseCreateAccountProps = {}) {
  const utils = trpc.useUtils();

  return trpc.accounts.create.useMutation({
    onSuccess: () => {
      utils.accounts.list.invalidate();
      onSuccess?.();
    },
  });
}
