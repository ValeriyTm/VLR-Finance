import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import { MarketTick, KafkaState } from '@vlr-finance/schemas';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;
  private connected = false;
  private publishCount = 0;
  private errorCount = 0;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    const brokers = this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092').split(',');

    this.kafka = new Kafka({
      clientId: 'ingestor-service',
      brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
      compression: 'gzip',
      maxInFlightRequests: 1,
      idempotent: true,
      transactionTimeout: 30000,
    });

    try {
      await this.producer.connect();
      this.connected = true;
      this.logger.log('Kafka producer connected');
    } catch (error) {
      this.logger.error('Failed to connect to Kafka:', error);
      this.errorCount++;
    }
  }

  async disconnect() {
    if (this.producer) {
      await this.producer.disconnect();
      this.connected = false;
      this.logger.log('Kafka producer disconnected');
    }
  }

  async publishTick(tick: MarketTick): Promise<void> {
    if (!this.connected) {
      this.logger.warn('Kafka producer not connected, skipping publish');
      return;
    }

    const topic = 'market-ticks';

    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: tick.symbol,
            value: JSON.stringify(tick),
            timestamp: tick.timestamp,
          },
        ],
      });

      this.publishCount++;
    } catch (error) {
      this.logger.error('Failed to publish tick to Kafka:', error);
      this.errorCount++;
      throw error;
    }
  }

  getState(): KafkaState {
    return {
      connected: this.connected,
      publishCount: this.publishCount,
      errorCount: this.errorCount,
    };
  }
}
