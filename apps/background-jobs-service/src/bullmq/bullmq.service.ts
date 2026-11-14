import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

@Injectable()
export class BullMQService implements OnModuleInit, OnModuleDestroy {
  private connection: IORedis;
  private reportQueue: Queue;
  private worker: Worker;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL', 'redis://localhost:6379');
    this.connection = new IORedis(redisUrl);

    this.reportQueue = new Queue('reports', {
      connection: this.connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    });

    // Worker will be set up in JobsService
  }

  async onModuleDestroy() {
    if (this.worker) await this.worker.close();
    if (this.reportQueue) await this.reportQueue.close();
    if (this.connection) await this.connection.quit();
  }

  getReportQueue(): Queue {
    return this.reportQueue;
  }

  getConnection(): IORedis {
    return this.connection;
  }
}
