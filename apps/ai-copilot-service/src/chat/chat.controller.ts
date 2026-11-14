import { Controller, Post, Body, Res, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { LangGraphService } from '../langgraph/langgraph.service';
import { z } from 'zod';

const chatRequestSchema = z.object({
  message: z.string().min(1).max(500),
  sessionId: z.string().optional(),
});

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly langGraphService: LangGraphService) {}

  @Post()
  @ApiOperation({ summary: 'Send chat message and receive SSE stream' })
  @ApiResponse({ status: 200, description: 'SSE stream started' })
  @ApiBody({ type: 'object', schema: { example: { message: 'Hello, how are you?' } } })
  async chat(
    @Body() body: unknown,
    @Headers('authorization') authHeader: string,
    @Res() res: Response,
  ) {
    // Validate input
    const validated = chatRequestSchema.parse(body);
    const userId = 'user-123'; // Would extract from JWT token

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      // Process chat and stream response
      const response = await this.langGraphService.processChat(userId, validated.message);
      
      // Send content event
      res.write(`data: ${JSON.stringify({ type: 'content', content: response })}\n\n`);
      
      // Send done event
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    } catch (error) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      res.end();
    }
  }
}
