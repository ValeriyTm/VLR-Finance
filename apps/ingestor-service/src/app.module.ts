import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { IngestorModule } from './ingestor/ingestor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    IngestorModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
