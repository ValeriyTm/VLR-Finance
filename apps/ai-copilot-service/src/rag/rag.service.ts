import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OllamaService } from '../ollama/ollama.service';

@Injectable()
export class RAGService {
  private readonly logger = new Logger(RAGService.name);

  constructor(
    private prisma: PrismaService,
    private ollama: OllamaService,
  ) {}

  async addDocument(userId: string, filename: string, content: string) {
    // Generate embedding
    const embedding = await this.ollama.embed(content);

    // Store document with embedding
    return this.prisma.document.create({
      data: {
        userId,
        filename,
        content,
        embedding: embedding as any, // pgvector
      },
    });
  }

  async search(userId: string, query: string, topK = 5): Promise<any[]> {
    // Generate query embedding
    const queryEmbedding = await this.ollama.embed(query);

    // Semantic search with pgvector
    // This would use raw SQL for vector similarity search
    // For now, simplified implementation
    return this.prisma.document.findMany({
      where: { userId },
      take: topK,
      orderBy: { createdAt: 'desc' },
    });
  }
}
