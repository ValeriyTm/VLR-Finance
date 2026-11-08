import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { KafkaService } from '../kafka/kafka.service';
import { CreateTransaction, TransactionType } from '@vlr-finance/schemas';

@Injectable()
export class PortfolioService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private kafka: KafkaService,
  ) {}

  async createTransaction(data: CreateTransaction) {
    // Validate sell transaction has sufficient holdings
    if (data.type === TransactionType.SELL) {
      const holdings = await this.getHoldings(data.userId, data.symbol);
      if (holdings < data.quantity) {
        throw new BadRequestException('Insufficient holdings for sell transaction');
      }
    }

    // Create transaction
    const transaction = await this.prisma.transaction.create({
      data,
    });

    // Cache transaction
    await this.redis.set(
      `transaction:${transaction.id}`,
      JSON.stringify(transaction),
      300, // 5 minutes TTL
    );

    // Publish CDC event
    await this.kafka.publishCDC({
      event: 'TRANSACTION_CREATED',
      data: transaction,
    });

    return transaction;
  }

  async getTransactions(userId: string, skip = 0, take = 100) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      skip,
      take,
    });
  }

  async getHoldings(userId: string, symbol: string): Promise<number> {
    const transactions = await this.prisma.transaction.findMany({
      where: { userId, symbol },
    });

    let holdings = 0;
    for (const tx of transactions) {
      if (tx.type === TransactionType.BUY) {
        holdings += tx.quantity;
      } else {
        holdings -= tx.quantity;
      }
    }

    return holdings;
  }
}
