import { Injectable, Logger } from '@nestjs/common';
import { OllamaService } from '../ollama/ollama.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LangGraphService {
  private readonly logger = new Logger(LangGraphService.name);

  constructor(
    private ollama: OllamaService,
    private prisma: PrismaService,
  ) {}

  async processChat(userId: string, message: string): Promise<string> {
    // Router: Determine intent (simplified for now)
    const intent = await this.classifyIntent(message);
    this.logger.log(`Intent: ${intent} for message: ${message.substring(0, 50)}...`);

    // Execute based on intent
    switch (intent) {
      case 'RAG':
        return this.ragQuery(userId, message);
      case 'TOOLS':
        return this.toolsQuery(userId, message);
      default:
        return this.textQuery(userId, message);
    }
  }

  private async classifyIntent(message: string): Promise<string> {
    const prompt = `Classify the intent of this user message. Return only one word: RAG, TOOLS, or TEXT.

Message: ${message}

Intent:`;

    const response = await this.ollama.chat([
      { role: 'system', content: 'You are an intent classifier. Return only RAG, TOOLS, or TEXT.' },
      { role: 'user', content: prompt },
    ]);

    return response.trim().toUpperCase();
  }

  private async ragQuery(userId: string, message: string): Promise<string> {
    // Simplified RAG - would integrate with RAGService
    const context = await this.retrieveContext(message);
    
    const prompt = `Answer based on this context:

Context: ${context}

Question: ${message}`;

    return this.ollama.chat([
      { role: 'system', content: 'You are a financial assistant. Answer based on the provided context.' },
      { role: 'user', content: prompt },
    ]);
  }

  private async toolsQuery(userId: string, message: string): Promise<string> {
    // Would call portfolio-service via gRPC
    return `Tool execution for: ${message}`;
  }

  private async textQuery(userId: string, message: string): Promise<string> {
    return this.ollama.chat([
      { role: 'system', content: 'You are a helpful financial assistant.' },
      { role: 'user', content: message },
    ]);
  }

  private async retrieveContext(message: string): Promise<string> {
    // Simplified - would use RAGService
    return 'No relevant documents found.';
  }
}
