import { createTRPCRouter } from '../init';
import { accountsRouter } from './accounts';
import { allocationsRouter } from './allocations';
import { transactionsRouter } from './transactions';

export const appRouter = createTRPCRouter({
  accounts: accountsRouter,
  allocations: allocationsRouter,
  transactions: transactionsRouter,
});

export type AppRouter = typeof appRouter;
