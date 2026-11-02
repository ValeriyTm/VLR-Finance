import { z } from 'zod';

// Market Data Schemas
export const marketTickSchema = z.object({
  symbol: z.string().min(1),
  price: z.number().positive(),
  volume: z.number().nonnegative(),
  timestamp: z.number(), // Unix timestamp in milliseconds
  exchange: z.string().default('binance'),
});

export const exchangeConfigSchema = z.object({
  url: z.string().url(),
  symbols: z.array(z.string()),
  reconnectInterval: z.number().default(5000),
  maxReconnectAttempts: z.number().default(10),
});

export const exchangeStateSchema = z.object({
  connected: z.boolean(),
  lastTickTimestamp: z.number().nullable(),
  tickCount: z.number().default(0),
  errorCount: z.number().default(0),
  reconnectAttempts: z.number().default(0),
});

export const kafkaStateSchema = z.object({
  connected: z.boolean(),
  publishCount: z.number().default(0),
  errorCount: z.number().default(0),
});

export type MarketTick = z.infer<typeof marketTickSchema>;
export type ExchangeConfig = z.infer<typeof exchangeConfigSchema>;
export type ExchangeState = z.infer<typeof exchangeStateSchema>;
export type KafkaState = z.infer<typeof kafkaStateSchema>;
