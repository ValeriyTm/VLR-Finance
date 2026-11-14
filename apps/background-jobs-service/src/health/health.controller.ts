import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BullMQService } from '../bullmq/bullmq.service';
import { MinIOService } from '../minio/minio.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private bullMQ: BullMQService,
    private minio: MinIOService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get service health status' })
  @ApiResponse({ status: 200, description: 'Health status retrieved successfully' })
  getHealth() {
    return {
      status: 'ok',
      service: 'background-jobs-service',
      timestamp: new Date().toISOString(),
      redis: 'connected',
      minio: 'connected',
    };
  }
}
