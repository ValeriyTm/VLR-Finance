# Tasks

## 1. Project Structure Setup

- [x] 1.1 Create ai-copilot-service directory in apps/ with NestJS structure
- [x] 1.2 Initialize NestJS project with pnpm create nest-app
- [x] 1.3 Configure tsconfig.json and nest-cli.json
- [x] 1.4 Create module structure (ai, langgraph, rag, memory, grpc modules)
- [x] 1.5 Add required dependencies (langgraph, langchain, ollama, mem0, @nestjs/microservices, @vlr-finance/schemas)

## 2. Prisma Setup for AI Database

- [x] 2.1 Copy Prisma schema from infrastructure/migrations/postgres/ai
- [x] 2.2 Configure pgvector extension
- [x] 2.3 Install Prisma Client and initialize Prisma
- [x] 2.4 Configure Prisma in NestJS with PrismaService
- [x] 2.5 Create initial migration

## 3. Shared Schemas for AI

- [ ] 3.1 Add AI Zod schemas to packages/schemas
- [ ] 3.2 Create ChatRequest schema
- [ ] 3.3 Create ChatResponse schema
- [ ] 3.4 Create Document schema for RAG
- [ ] 3.5 Create Memory schema for Mem0
- [ ] 3.6 Export schemas from packages/schemas

## 4. Ollama Integration

- [x] 4.1 Create OllamaService for LLM integration
- [x] 4.2 Implement chat completion method (qwen2.5:3b)
- [x] 4.3 Implement embedding generation method (nomic-embed-text)
- [x] 4.4 Configure Ollama connection via host.docker.internal
- [x] 4.5 Implement error handling and retries

## 5. LangGraph Agent

- [x] 5.1 Create LangGraphService for agent orchestration
- [x] 5.2 Implement Router node for intent classification
- [x] 5.3 Implement RAG node for document retrieval
- [x] 5.4 Implement Tools node for function calling
- [x] 5.5 Implement Memory node for session memory
- [x] 5.6 Configure system prompt with XML isolation
- [x] 5.7 Implement state management

## 6. RAG Implementation

- [x] 6.1 Create RAGService for document retrieval
- [x] 6.2 Implement document embedding
- [x] 6.3 Implement semantic search with pgvector
- [x] 6.4 Configure HNSW index (M=16, ef_construction=64)
- [x] 6.5 Implement top-k retrieval
- [x] 6.6 Implement context assembly for LLM

## 7. Mem0 Integration

- [ ] 7.1 Create Mem0Service for long-term memory
- [ ] 7.2 Implement fact extraction
- [ ] 7.3 Implement fact storage in Mem0
- [ ] 7.4 Implement fact retrieval
- [ ] 7.5 Implement async memory update after response
- [ ] 7.6 Configure Mem0 Docker container connection

## 8. gRPC Auth Integration

- [ ] 8.1 Create proto/ai/ai.proto for AI service
- [ ] 8.2 Create AuthGrpcClient for Auth Service integration
- [ ] 8.3 Implement ValidateUserTariff call
- [ ] 8.4 Implement limit checking and decrementing
- [ ] 8.5 Configure gRPC in app module

## 9. SSE Streaming

- [x] 9.1 Create ChatController with SSE endpoint
- [x] 9.2 Implement SSE streaming for chat responses
- [x] 9.3 Implement content event streaming
- [x] 9.4 Implement component event streaming
- [x] 9.5 Implement done event
- [x] 9.6 Decorate with OpenAPI decorators

## 10. Prompt Injection Protection

- [x] 10.1 Create Zod validation for chat requests
- [x] 10.2 Implement max length check (500 chars)
- [x] 10.3 Implement special character validation
- [x] 10.4 Implement XML isolation in system prompt
- [x] 10.5 Implement user input sanitization

## 11. Langfuse Integration

- [ ] 11.1 Create LangfuseService for observability
- [ ] 11.2 Implement trace creation
- [ ] 11.3 Implement step logging for LangGraph
- [ ] 11.4 Implement LLM call logging
- [ ] 11.5 Implement embedding logging
- [ ] 11.6 Configure Langfuse Cloud API keys

## 12. Health Check

- [x] 12.1 Create HealthController
- [x] 12.2 Implement /health endpoint
- [x] 12.3 Return Ollama connection state
- [x] 12.4 Return pgvector connection state
- [x] 12.5 Return Mem0 connection state
- [x] 12.6 Return LangGraph agent state
- [x] 12.7 Decorate with OpenAPI decorators

## 13. Security Middleware

- [x] 13.1 Configure Helmet middleware in main.ts
- [x] 13.2 Configure CORS middleware
- [x] 13.3 Configure global exception filter
- [x] 13.4 Add security headers

## 14. OpenAPI Documentation

- [x] 14.1 Configure SwaggerModule in app module
- [x] 14.2 Set API documentation title and version
- [x] 14.3 Add Swagger UI setup
- [x] 14.4 Decorate endpoints with OpenAPI decorators

## 15. Integration with Infrastructure

- [x] 15.1 Configure environment variables for DATABASE_URL_AI
- [x] 15.2 Configure environment variables for OLLAMA_URL
- [x] 15.3 Configure environment variables for MEM0_URL
- [x] 15.4 Configure environment variables for LANGFUSE keys
- [x] 15.5 Update Dockerfile for ai-copilot-service
- [x] 15.6 Update docker-compose.v4-ai.yaml with build context
- [x] 15.7 Configure extra_hosts for host.docker.internal

## 16. Testing (SKIPPED - deferred)

- [~] 16.1 Write unit tests for LangGraphService (SKIPPED)
- [~] 16.2 Write unit tests for RAGService (SKIPPED)
- [~] 16.3 Write unit tests for Mem0Service (SKIPPED)
- [~] 16.4 Test SSE streaming (SKIPPED)
- [~] 16.5 Test prompt injection protection (SKIPPED)
- [~] 16.6 Test gRPC integration (SKIPPED)

## 17. Documentation (SKIPPED - deferred)

- [~] 17.1 Update README.md with ai-copilot-service documentation (SKIPPED)
- [~] 17.2 Document AI agent flow in docs (SKIPPED)
- [~] 17.3 Document environment variables required (SKIPPED)
