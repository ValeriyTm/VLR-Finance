import { Module } from '@nestjs/common';
import { LangGraphService } from './langgraph.service';
import { OllamaModule } from '../ollama/ollama.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [OllamaModule, PrismaModule],
  providers: [LangGraphService],
  exports: [LangGraphService],
})
export class LangGraphModule {}
