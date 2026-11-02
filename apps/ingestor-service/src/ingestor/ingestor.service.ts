import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ExchangeService } from '../exchange/exchange.service';
import { KafkaService } from '../kafka/kafka.service';
import { MarketTick } from '@vlr-finance/schemas';

@Injectable()
export class IngestorService implements OnModuleInit {
  private readonly logger = new Logger(IngestorService.name);

  constructor(
    private exchangeService: ExchangeService,
    private kafkaService: KafkaService,
  ) {}

  async onModuleInit() {
    // Subscribe to exchange ticks
    this.exchangeService.on('tick', async (tick: MarketTick) => {
      await this.processTick(tick);
    });

    this.logger.log('Ingestor service initialized');
  }

  private async processTick(tick: MarketTick): Promise<void> {
    try {
      // Validate tick data
      this.validateTick(tick);

      // Publish to Kafka
      await this.kafkaService.publishTick(tick);

      this.logger.debug(`Processed tick: ${tick.symbol} @ ${tick.price}`);
    } catch (error) {
      this.logger.error('Error processing tick:', error);
    }
  }

  private validateTick(tick: MarketTick): void {
    if (!tick.symbol || !tick.price || !tick.timestamp) {
      throw new Error('Invalid tick data: missing required fields');
    }

    if (tick.price <= 0) {
      throw new Error('Invalid tick data: price must be positive');
    }

    if (tick.volume < 0) {
      throw new Error('Invalid tick data: volume cannot be negative');
    }
  }

  getStatistics() {
    return {
      exchange: this.exchangeService.getState(),
      kafka: this.kafkaService.getState(),
    };
  }
}
