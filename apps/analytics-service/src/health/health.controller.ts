import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClickHouseService } from '../clickhouse/clickhouse.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly clickHouseService: ClickHouseService) {}

  @Get()
  @ApiOperation({ summary: 'Get service health status' })
  @ApiResponse({ status: 200, description: 'Health status retrieved successfully' })
  getHealth() {
    return {
      status: 'ok',
      service: 'analytics-service',
      timestamp: new Date().toISOString(),
      clickhouse: this.clickHouseService.getState(),
    };
  }
}
