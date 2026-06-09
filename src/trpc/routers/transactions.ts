import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../init';
import { db } from '@/server/db';
import { TransactionType, Prisma } from '@prisma/client';

export const transactionsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        accountId: z.string().optional(),
        allocationId: z.string().optional(),
        limit: z.number().default(50),
        skip: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Prisma.TransactionWhereInput = {
        userId: ctx.user.id,
      };
      if (input.accountId) where.accountId = input.accountId;
      if (input.allocationId) where.allocationToId = input.allocationId;

      return db.transaction.findMany({
        where,
        include: { allocationFrom: true, allocationTo: true },
        orderBy: { date: 'desc' },
        take: input.limit,
        skip: input.skip,
      });
    }),

  add: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        allocationToId: z.string(),
        allocationFromId: z.string().optional(),
        amount: z.number().positive('Amount must be positive'),
        type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
        description: z.string().optional(),
        date: z.coerce.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const amountDelta =
        input.type === 'INCOME' ? input.amount : -input.amount;

      await db.transaction.create({
        data: {
          userId: ctx.user.id,
          accountId: input.accountId,
          allocationToId: input.allocationToId,
          allocationFromId: input.allocationFromId,
          amount: input.amount,
          type: input.type as TransactionType,
          description: input.description,
          date: input.date,
        },
      });

      if (input.type === 'TRANSFER' && input.allocationFromId) {
        await db.allocation.update({
          where: { id: input.allocationFromId },
          data: { amount: { decrement: input.amount } },
        });
        return db.allocation.update({
          where: { id: input.allocationToId },
          data: { amount: { increment: input.amount } },
        });
      }

      return db.allocation.update({
        where: { id: input.allocationToId },
        data: {
          amount: {
            increment: amountDelta,
          },
        },
      });
    }),

  getByAllocation: protectedProcedure
    .input(z.object({ allocationId: z.string() }))
    .query(async ({ ctx, input }) => {
      return db.transaction.findMany({
        where: {
          allocationToId: input.allocationId,
          userId: ctx.user.id,
        },
        include: { allocationFrom: true, allocationTo: true },
        orderBy: { date: 'desc' },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const transaction = await db.transaction.findUnique({
        where: { id: input.id },
      });

      if (!transaction || transaction.userId !== ctx.user.id) {
        throw new Error('Transaction not found');
      }

      await db.transaction.delete({
        where: { id: input.id },
      });

      if (transaction.type === 'TRANSFER' && transaction.allocationFromId && transaction.allocationToId) {
        await db.allocation.update({
          where: { id: transaction.allocationFromId },
          data: { amount: { increment: transaction.amount } },
        });
        return db.allocation.update({
          where: { id: transaction.allocationToId },
          data: { amount: { decrement: transaction.amount } },
        });
      }

      if (!transaction.allocationToId) {
        throw new Error('No allocation to reverse');
      }

      const amountDelta =
        transaction.type === 'INCOME' ? -transaction.amount : transaction.amount;

      return db.allocation.update({
        where: { id: transaction.allocationToId },
        data: {
          amount: {
            increment: amountDelta,
          },
        },
      });
    }),
});
