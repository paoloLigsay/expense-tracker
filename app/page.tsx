'use client';

import { AccountsContainer } from '@/client/components/accounts/AccountsContainer';
import { Button } from '@/client/components/ui';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoggedIn === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Expense Tracker</h1>
          <Button
            onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
            variant="secondary"
            size="md"
          >
            Sign Out
          </Button>
        </div>
        <AccountsContainer />
      </div>
    </div>
  );
}
