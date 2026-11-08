import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { HealthController } from './health/health.controller';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'PORTFOLIO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'portfolio',
          protoPath: join(__dirname, '../../proto/portfolio/portfolio.proto'),
        },
      },
    ]),
    PortfolioModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
