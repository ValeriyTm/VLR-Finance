import { z } from 'zod';

// Analytics Schemas
export const pnlBreakdownSchema = z.object({
  symbol: z.string(),
  realizedPnl: z.number(),
  unrealizedPnl: z.number(),
  totalPnl: z.number(),
  quantity: z.number(),
  averageCost: z.number(),
  currentPrice: z.number(),
});

export const assetAllocationSchema = z.object({
  symbol: z.string(),
  value: z.number(),
  percentage: z.number(),
  quantity: z.number(),
});

export const performanceMetricsSchema = z.object({
  roi: z.number(),
  sharpeRatio: z.number().nullable(),
  totalReturn: z.number(),
  volatility: z.number(),
  maxDrawdown: z.number(),
  startDate: z.string(),
  endDate: z.string(),
});

export const portfolioAnalyticsSchema = z.object({
  userId: z.string(),
  totalValue: z.number(),
  totalPnl: z.number(),
  pnlBreakdown: z.array(pnlBreakdownSchema),
  assetAllocation: z.array(assetAllocationSchema),
  performanceMetrics: performanceMetricsSchema,
  lastUpdated: z.string(),
});

export type PnLBreakdown = z.infer<typeof pnlBreakdownSchema>;
export type AssetAllocation = z.infer<typeof assetAllocationSchema>;
export type PerformanceMetrics = z.infer<typeof performanceMetricsSchema>;
export type PortfolioAnalytics = z.infer<typeof portfolioAnalyticsSchema>;
