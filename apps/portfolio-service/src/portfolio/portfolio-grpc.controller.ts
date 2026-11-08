import { Controller } from '@nestjs/common';
import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import { PortfolioService } from './portfolio.service';

@GrpcService('portfolio.PortfolioService')
export class PortfolioGrpcController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @GrpcMethod('PortfolioService', 'CreateTransaction')
  async createTransaction(data: any) {
    return { transaction: await this.portfolioService.createTransaction(data) };
  }

  @GrpcMethod('PortfolioService', 'GetTransactions')
  async getTransactions(data: any) {
    const transactions = await this.portfolioService.getTransactions(
      data.user_id,
      data.skip || 0,
      data.take || 100,
    );
    return { transactions };
  }
}
