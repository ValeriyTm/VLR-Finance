import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IngestorService } from './ingestor/ingestor.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly ingestorService: IngestorService) {}

  @Get()
  @ApiOperation({ summary: 'Get service health status' })
  @ApiResponse({ status: 200, description: 'Health status retrieved successfully' })
  getHealth() {
    return {
      status: 'ok',
      service: 'ingestor-service',
      timestamp: new Date().toISOString(),
      statistics: this.ingestorService.getStatistics(),
    };
  }
}
