import { z } from 'zod';

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export const transactionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.nativeEnum(TransactionType),
  symbol: z.string().min(1),
  quantity: z.number().positive(),
  price: z.number().positive(),
  timestamp: z.date(),
});

export const createTransactionSchema = z.object({
  userId: z.string().uuid(),
  type: z.nativeEnum(TransactionType),
  symbol: z.string().min(1),
  quantity: z.number().positive(),
  price: z.number().positive(),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type CreateTransaction = z.infer<typeof createTransactionSchema>;
