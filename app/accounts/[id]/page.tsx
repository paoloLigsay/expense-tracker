'use client';

import { AllocationsContainer } from '@/client/components/allocations/AllocationsContainer';
import { TransactionsContainer } from '@/client/components/transactions/TransactionsContainer';
import { Button } from '@/client/components/ui';
import { trpc } from '@/trpc/client';
import { useParams, useRouter } from 'next/navigation';

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.id as string;

  const { data: account, isLoading, error } = trpc.accounts.getById.useQuery({
    id: accountId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-slate-400">Loading account...</div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <h1 className="mb-4 text-xl font-bold text-red-400">Account not found</h1>
            <Button
              onClick={() => router.back()}
              variant="secondary"
              size="md"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{account.name}</h1>
            <p className="mt-2 text-slate-400">
              Created {new Date(account.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button
            onClick={() => router.back()}
            variant="secondary"
            size="md"
          >
            Back
          </Button>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-xl font-bold text-white">Budget Allocations</h2>
            <AllocationsContainer accountId={accountId} />
          </section>

          <section className="border-t border-slate-800 pt-8">
            <h2 className="mb-4 text-xl font-bold text-white">Transactions</h2>
            <TransactionsContainer accountId={accountId} />
          </section>
        </div>
      </div>
    </div>
  );
}
