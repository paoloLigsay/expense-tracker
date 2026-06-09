export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Expense Tracker</h1>
          <p className="mt-2 text-slate-400">Manage your finances with ease</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
