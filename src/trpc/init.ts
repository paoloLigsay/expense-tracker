import { initTRPC, TRPCError } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { getUserFromToken } from '@/lib/supabase/server';

export const createTRPCContext = async (
  opts?: FetchCreateContextFnOptions,
) => {
  const token = opts?.req.headers.get('authorization')?.replace('Bearer ', '');

  let user = null;
  if (token) {
    user = await getUserFromToken(token);
  }

  return {
    user,
  };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
