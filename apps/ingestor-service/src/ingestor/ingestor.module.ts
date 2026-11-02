import { Module } from '@nestjs/common';
import { IngestorService } from './ingestor.service';
import { ExchangeModule } from '../exchange/exchange.module';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [ExchangeModule, KafkaModule],
  providers: [IngestorService],
  exports: [IngestorService],
})
export class IngestorModule {}
