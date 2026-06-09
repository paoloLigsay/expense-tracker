import 'server-only';

import { appRouter } from './routers/_app';
import { createQueryClient } from './query-client';

export const api = appRouter.createCaller({
  user: null,
});

export const getQueryClient = () => createQueryClient();
