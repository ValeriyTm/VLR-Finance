import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private connected = false;

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
      clientId: 'portfolio-service',
      brokers,
    });

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
      idempotent: true,
    });

    try {
      await this.producer.connect();
      this.connected = true;
    } catch (error) {
      console.error('Failed to connect to Kafka:', error);
    }
  }

  async disconnect() {
    if (this.producer) {
      await this.producer.disconnect();
      this.connected = false;
    }
  }

  async publishCDC(event: any): Promise<void> {
    if (!this.connected) return;

    try {
      await this.producer.send({
        topic: 'portfolio-cdc',
        messages: [
          {
            key: event.userId,
            value: JSON.stringify(event),
            timestamp: Date.now(),
          },
        ],
      });
    } catch (error) {
      console.error('Failed to publish CDC event:', error);
    }
  }
}
