'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  user_metadata?: {
    name?: string;
  };
}

export function WelcomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser({
          email: session.user.email || '',
          user_metadata: session.user.user_metadata,
        });
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const name = user.user_metadata?.name || user.email;

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Expense Tracker</h1>
            <button
              onClick={handleSignOut}
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white">
            Welcome, {name}!
          </h2>
          <p className="mt-2 text-slate-400">
            You're logged in and ready to start tracking your expenses.
          </p>
          <p className="mt-4 text-sm text-slate-400">
            Email: {user.email}
          </p>

          <div className="mt-8 rounded-lg border border-emerald-900 bg-emerald-900 bg-opacity-20 p-4">
            <p className="text-sm text-emerald-300">
              More features coming soon! This is the welcome page for now.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
