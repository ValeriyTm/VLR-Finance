import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Mem0Service {
  private readonly logger = new Logger(Mem0Service.name);
  private baseUrl: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('MEM0_URL', 'http://localhost:8080');
  }

  async addMemory(userId: string, fact: string, category?: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/memories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          fact,
          category,
        }),
      });

      if (!response.ok) {
        throw new Error(`Mem0 API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      this.logger.error('Failed to add memory:', error);
      return null;
    }
  }

  async getMemories(userId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/memories?user_id=${userId}`);

      if (!response.ok) {
        throw new Error(`Mem0 API error: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      this.logger.error('Failed to get memories:', error);
      return [];
    }
  }

  async deleteMemory(memoryId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/memories/${memoryId}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      this.logger.error('Failed to delete memory:', error);
      return false;
    }
  }
}
