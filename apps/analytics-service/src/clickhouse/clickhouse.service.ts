import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, ClickHouseClient } from '@clickhouse/client';

@Injectable()
export class ClickHouseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ClickHouseService.name);
  private client: ClickHouseClient | null = null;
  private connected = false;
  private queryCount = 0;
  private errorCount = 0;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    const url = this.configService.get<string>(
      'CLICKHOUSE_URL',
      'http://localhost:8123',
    );

    try {
      this.client = createClient({
        url,
        query_options: {
          format: 'JSON',
        },
      });

      // Test connection
      await this.client.query({
        query: 'SELECT 1',
      });

      this.connected = true;
      this.logger.log('ClickHouse client connected');
    } catch (error) {
      this.logger.error('Failed to connect to ClickHouse:', error);
      this.errorCount++;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.connected = false;
      this.logger.log('ClickHouse client disconnected');
    }
  }

  async query(query: string, params?: Record<string, any>): Promise<any> {
    if (!this.connected || !this.client) {
      throw new Error('ClickHouse client not connected');
    }

    try {
      const result = await this.client.query({
        query,
        format: 'JSON',
        query_params: params,
      });

      const data = await result.json();
      this.queryCount++;
      return data;
    } catch (error) {
      this.logger.error('ClickHouse query error:', error);
      this.errorCount++;
      throw error;
    }
  }

  async insert(table: string, data: any[]): Promise<void> {
    if (!this.connected || !this.client) {
      throw new Error('ClickHouse client not connected');
    }

    try {
      await this.client.insert({
        table,
        data,
        format: 'JSONEachRow',
      });
      this.queryCount++;
    } catch (error) {
      this.logger.error('ClickHouse insert error:', error);
      this.errorCount++;
      throw error;
    }
  }

  getState() {
    return {
      connected: this.connected,
      queryCount: this.queryCount,
      errorCount: this.errorCount,
    };
  }
}
