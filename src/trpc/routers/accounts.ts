import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '../init';
import { db } from '@/server/db';

export const accountsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.account.findMany({
      where: { userId: ctx.user.id },
      include: { allocations: true },
    });
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1, 'Name is required') }))
    .mutation(async ({ ctx, input }) => {
      try {
        await db.user.upsert({
          where: { id: ctx.user.id },
          update: {},
          create: {
            id: ctx.user.id,
            email: ctx.user.email || '',
            name: (ctx.user.user_metadata?.name as string) || null,
          },
        });

        return db.account.create({
          data: {
            name: input.name,
            userId: ctx.user.id,
          },
        });
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create account',
        });
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return db.account.findUnique({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
        include: { allocations: true },
      });
    }),
});
