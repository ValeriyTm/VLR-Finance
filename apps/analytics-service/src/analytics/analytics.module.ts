import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AnalyticsService } from './analytics.service';
import { AnalyticsGrpcController } from './analytics-grpc.controller';
import { ClickHouseModule } from '../clickhouse/clickhouse.module';

@Module({
  imports: [
    ClickHouseModule,
    ClientsModule.register([
      {
        name: 'ANALYTICS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'analytics',
          protoPath: join(__dirname, '../../../proto/analytics/analytics.proto'),
        },
      },
    ]),
  ],
  providers: [AnalyticsService, AnalyticsGrpcController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
