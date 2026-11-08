import { Controller } from '@nestjs/common';
import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import { AnalyticsService } from './analytics.service';

interface GetPortfolioAnalyticsRequest {
  user_id: string;
}

interface GetPortfolioAnalyticsResponse {
  analytics: any;
}

@GrpcService('analytics.AnalyticsService')
export class AnalyticsGrpcController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @GrpcMethod('AnalyticsService', 'GetPortfolioAnalytics')
  async getPortfolioAnalytics(
    data: GetPortfolioAnalyticsRequest,
  ): Promise<GetPortfolioAnalyticsResponse> {
    const analytics = await this.analyticsService.getPortfolioAnalytics(data.user_id);
    return { analytics };
  }

  @GrpcMethod('AnalyticsService', 'GetPnLBreakdown')
  async getPnLBreakdown(data: GetPortfolioAnalyticsRequest) {
    const analytics = await this.analyticsService.getPortfolioAnalytics(data.user_id);
    return { pnl_breakdown: analytics.pnlBreakdown };
  }

  @GrpcMethod('AnalyticsService', 'GetAssetAllocation')
  async getAssetAllocation(data: GetPortfolioAnalyticsRequest) {
    const analytics = await this.analyticsService.getPortfolioAnalytics(data.user_id);
    return { asset_allocation: analytics.assetAllocation };
  }
}
