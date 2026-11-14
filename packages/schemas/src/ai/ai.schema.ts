import { z } from 'zod';

// AI Copilot Schemas
export const chatRequestSchema = z.object({
  message: z.string().min(1).max(500),
  sessionId: z.string().optional(),
});

export const chatResponseSchema = z.object({
  content: z.string(),
  sessionId: z.string(),
  timestamp: z.string(),
});

export const documentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  filename: z.string(),
  content: z.string(),
  embedding: z.array(z.number()).optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const memorySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  fact: z.string(),
  category: z.string().optional(),
  confidence: z.number().min(0).max(1).default(0.5),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const chatSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  messages: z.array(z.any()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;
export type Document = z.infer<typeof documentSchema>;
export type Memory = z.infer<typeof memorySchema>;
export type ChatSession = z.infer<typeof chatSessionSchema>;
