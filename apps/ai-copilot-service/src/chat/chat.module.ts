import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { LangGraphModule } from '../langgraph/langgraph.module';

@Module({
  imports: [LangGraphModule],
  controllers: [ChatController],
})
export class ChatModule {}
