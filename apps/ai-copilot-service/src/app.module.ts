import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { HealthController } from './health/health.controller';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';
import { OllamaModule } from './ollama/ollama.module';
import { LangGraphModule } from './langgraph/langgraph.module';
import { RAGModule } from './rag/rag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    OllamaModule,
    LangGraphModule,
    RAGModule,
    ChatModule,
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, '../../proto/auth/auth.proto'),
        },
      },
    ]),
  ],
  controllers: [HealthController],
})
export class AppModule {}
