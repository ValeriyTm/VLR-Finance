import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ollama } from 'ollama';

@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);
  private client: Ollama;
  private connected = false;

  constructor(private configService: ConfigService) {
    const baseUrl = this.configService.get<string>(
      'OLLAMA_URL',
      'http://host.docker.internal:11434',
    );
    this.client = new Ollama({ host: baseUrl });
  }

  async onModuleInit() {
    await this.checkConnection();
  }

  private async checkConnection() {
    try {
      await this.client.list();
      this.connected = true;
      this.logger.log('Ollama connected');
    } catch (error) {
      this.logger.error('Failed to connect to Ollama:', error);
      this.connected = false;
    }
  }

  async chat(messages: any[], model = 'qwen2.5:3b'): Promise<string> {
    try {
      const response = await this.client.chat({
        model,
        messages,
        stream: false,
      });
      return response.message.content;
    } catch (error) {
      this.logger.error('Ollama chat error:', error);
      throw error;
    }
  }

  async embed(text: string, model = 'nomic-embed-text'): Promise<number[]> {
    try {
      const response = await this.client.embeddings({
        model,
        prompt: text,
      });
      return response.embedding;
    } catch (error) {
      this.logger.error('Ollama embed error:', error);
      throw error;
    }
  }

  getState() {
    return { connected: this.connected };
  }
}
