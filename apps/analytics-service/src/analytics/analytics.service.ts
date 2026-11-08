import { Injectable, Logger } from '@nestjs/common';
import { ClickHouseService } from '../clickhouse/clickhouse.service';
import { PortfolioAnalytics, PnLBreakdown, AssetAllocation, PerformanceMetrics } from '@vlr-finance/schemas';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private clickHouse: ClickHouseService) {}

  async getPortfolioAnalytics(userId: string): Promise<PortfolioAnalytics> {
    const pnlBreakdown = await this.calculatePnL(userId);
    const assetAllocation = await this.calculateAssetAllocation(userId);
    const performanceMetrics = await this.calculatePerformanceMetrics(userId);
    const totalValue = assetAllocation.reduce((sum, a) => sum + a.value, 0);
    const totalPnl = pnlBreakdown.reduce((sum, p) => sum + p.totalPnl, 0);

    return {
      userId,
      totalValue,
      totalPnl,
      pnlBreakdown,
      assetAllocation,
      performanceMetrics,
      lastUpdated: new Date().toISOString(),
    };
  }

  private async calculatePnL(userId: string): Promise<PnLBreakdown[]> {
    // FIFO PnL calculation query
    const query = `
      SELECT 
        symbol,
        SUM(buy_quantity * buy_price) / SUM(buy_quantity) as averageCost,
        SUM(CASE WHEN type = 'sell' THEN quantity ELSE 0 END) as soldQuantity,
        SUM(CASE WHEN type = 'buy' THEN quantity ELSE 0 END) as boughtQuantity,
        SUM(CASE WHEN type = 'sell' THEN quantity * price ELSE 0 END) as sellValue,
        SUM(CASE WHEN type = 'buy' THEN quantity * price ELSE 0 END) as buyValue
      FROM portfolio_analytics
      WHERE user_id = {userId: String}
      GROUP BY symbol
    `;

    const result = await this.clickHouse.query(query, { userId });
    
    // Simplified FIFO calculation (O(N) per symbol)
    return result.data.map((row: any) => ({
      symbol: row.symbol,
      realizedPnl: row.sellValue - (row.soldQuantity * row.averageCost),
      unrealizedPnl: 0, // Would need current price from market data
      totalPnl: row.sellValue - (row.soldQuantity * row.averageCost),
      quantity: row.boughtQuantity - row.soldQuantity,
      averageCost: row.averageCost,
      currentPrice: row.averageCost, // Placeholder
    }));
  }

  private async calculateAssetAllocation(userId: string): Promise<AssetAllocation[]> {
    const query = `
      SELECT 
        symbol,
        SUM(CASE WHEN type = 'buy' THEN quantity ELSE -quantity END) as quantity,
        SUM(CASE WHEN type = 'buy' THEN quantity * price ELSE -quantity * price END) as value
      FROM portfolio_analytics
      WHERE user_id = {userId: String}
      GROUP BY symbol
      HAVING quantity > 0
    `;

    const result = await this.clickHouse.query(query, { userId });
    const totalValue = result.data.reduce((sum: number, row: any) => sum + row.value, 0);

    return result.data.map((row: any) => ({
      symbol: row.symbol,
      value: row.value,
      percentage: totalValue > 0 ? (row.value / totalValue) * 100 : 0,
      quantity: row.quantity,
    }));
  }

  private async calculatePerformanceMetrics(userId: string): Promise<PerformanceMetrics> {
    // Simplified performance metrics calculation
    const query = `
      SELECT 
        MIN(timestamp) as startDate,
        MAX(timestamp) as endDate,
        SUM(CASE WHEN type = 'sell' THEN quantity * price ELSE 0 END) as totalSell,
        SUM(CASE WHEN type = 'buy' THEN quantity * price ELSE 0 END) as totalBuy
      FROM portfolio_analytics
      WHERE user_id = {userId: String}
    `;

    const result = await this.clickHouse.query(query, { userId });
    const data = result.data[0] || {};

    const totalReturn = (data.totalSell || 0) - (data.totalBuy || 0);
    const roi = data.totalBuy > 0 ? (totalReturn / data.totalBuy) * 100 : 0;

    return {
      roi,
      sharpeRatio: null, // Would need historical returns calculation
      totalReturn,
      volatility: 0, // Would need historical price data
      maxDrawdown: 0, // Would need historical data
      startDate: data.startDate || new Date().toISOString(),
      endDate: data.endDate || new Date().toISOString(),
    };
  }
}
