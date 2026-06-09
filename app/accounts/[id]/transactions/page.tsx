'use client';

import { TransactionsContainer } from '@/client/components/transactions/TransactionsContainer';
import { trpc } from '@/trpc/client';
import { useParams, useRouter } from 'next/navigation';

export default function TransactionsPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.id as string;

  const { data: account, isLoading, error } = trpc.accounts.getById.useQuery({
    id: accountId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <h1 className="mb-4 text-xl font-bold text-red-300">Account not found</h1>
            <button
              onClick={() => router.back()}
              className="rounded-lg bg-slate-700 px-4 py-2.5 font-medium text-slate-200 hover:bg-slate-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {account.name} - Transactions
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Track and manage all transactions for this account
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="rounded-lg bg-slate-700 px-4 py-2.5 font-medium text-slate-200 hover:bg-slate-600"
          >
            Back
          </button>
        </div>

        <TransactionsContainer accountId={accountId} />
      </div>
    </div>
  );
}
