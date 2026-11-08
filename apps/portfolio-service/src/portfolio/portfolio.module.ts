import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PortfolioService } from './portfolio.service';
import { PortfolioGrpcController } from './portfolio-grpc.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    KafkaModule,
    ClientsModule.register([
      {
        name: 'PORTFOLIO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'portfolio',
          protoPath: join(__dirname, '../../../proto/portfolio/portfolio.proto'),
        },
      },
    ]),
  ],
  providers: [PortfolioService, PortfolioGrpcController],
  exports: [PortfolioService],
})
export class PortfolioModule {}
