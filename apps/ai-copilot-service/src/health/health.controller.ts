import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OllamaService } from '../ollama/ollama.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly ollamaService: OllamaService) {}

  @Get()
  @ApiOperation({ summary: 'Get service health status' })
  @ApiResponse({ status: 200, description: 'Health status retrieved successfully' })
  getHealth() {
    return {
      status: 'ok',
      service: 'ai-copilot-service',
      timestamp: new Date().toISOString(),
      ollama: this.ollamaService.getState(),
    };
  }
}
