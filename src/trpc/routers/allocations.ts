import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../init';
import { db } from '@/server/db';

export const allocationsRouter = createTRPCRouter({
  listByAccount: protectedProcedure
    .input(z.object({ accountId: z.string() }))
    .query(async ({ ctx, input }) => {
      return db.allocation.findMany({
        where: {
          accountId: input.accountId,
          account: { userId: ctx.user.id },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        name: z.string().min(1, 'Name is required'),
        amount: z.number().nonnegative('Amount must be non-negative').default(0),
      }),
    )
    .mutation(async ({ input }) => {
      return db.allocation.create({
        data: {
          accountId: input.accountId,
          name: input.name,
          amount: input.amount,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        amount: z.number().nonnegative('Amount must be non-negative'),
      }),
    )
    .mutation(async ({ input }) => {
      return db.allocation.update({
        where: { id: input.id },
        data: { amount: input.amount },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return db.allocation.delete({
        where: { id: input.id },
      });
    }),
});
