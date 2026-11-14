import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LangfuseService {
  private readonly logger = new Logger(LangfuseService.name);
  private publicKey: string;
  private secretKey: string;
  private baseUrl = 'https://cloud.langfuse.com';

  constructor(private configService: ConfigService) {
    this.publicKey = this.configService.get<string>('LANGFUSE_PUBLIC_KEY', '');
    this.secretKey = this.configService.get<string>('LANGFUSE_SECRET_KEY', '');
  }

  async createTrace(name: string, userId?: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/public/traces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.publicKey}:${this.secretKey}`).toString('base64')}`,
        },
        body: JSON.stringify({
          name,
          userId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Langfuse API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      this.logger.error('Failed to create trace:', error);
      return null;
    }
  }

  async logStep(traceId: string, name: string, input: any, output: any): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/api/public/observations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${this.publicKey}:${this.secretKey}`).toString('base64')}`,
        },
        body: JSON.stringify({
          traceId,
          name,
          type: 'GENERATION',
          input,
          output,
          startTime: new Date().toISOString(),
        }),
      });
    } catch (error) {
      this.logger.error('Failed to log step:', error);
    }
  }
}
