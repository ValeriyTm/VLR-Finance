import { Module } from '@nestjs/common';
import { RAGService } from './rag.service';
import { PrismaModule } from '../prisma/prisma.module';
import { OllamaModule } from '../ollama/ollama.module';

@Module({
  imports: [PrismaModule, OllamaModule],
  providers: [RAGService],
  exports: [RAGService],
})
export class RAGModule {}
