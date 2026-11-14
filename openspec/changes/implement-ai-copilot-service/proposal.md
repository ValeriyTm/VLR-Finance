# Proposal

## Why

The ai-copilot-service is the AI-first layer of the VLR Finance platform. It implements an intelligent assistant with RAG (Retrieval-Augmented Generation), long-term memory, and Generative UI capabilities. This service enables users to interact with their portfolio using natural language, get market insights, and receive AI-powered recommendations. Without this service, the platform lacks its core AI-first differentiator.

## What Changes

- Implement ai-copilot-service microservice with NestJS
- Implement LangGraph agent with nodes (Router, RAG, Tools, Memory)
- Implement RAG using pgvector + HNSW for semantic search
- Implement long-term memory using Mem0 (Docker container)
- Integrate with Ollama for LLM (qwen2.5:3b) and embeddings (nomic-embed-text)
- Implement Generative UI with Vercel AI SDK
- Implement SSE streaming for real-time responses
- Implement prompt injection protection
- Implement gRPC integration with Auth Service for token validation
- Integrate with Langfuse Cloud for LLM observability
- Decorate all endpoints with OpenAPI decorators
- Create shared Zod schemas for AI data structures

## Capabilities

### New Capabilities

- `ai-agent`: LangGraph agent with routing and tool execution
- `rag-implementation`: RAG with pgvector + HNSW for document retrieval
- `long-term-memory`: Mem0 integration for persistent user context
- `generative-ui`: Dynamic UI components in chat responses
- `sse-streaming`: Server-Sent Events for real-time AI responses
- `prompt-injection-protection`: Security against malicious prompts
- `langfuse-observability`: LLM observability and tracing
- `grpc-auth-integration`: Token validation and limit management

### Modified Capabilities

None - this is a new service implementation.

## Impact

- Enables AI-powered financial assistance
- Provides RAG for document-based analysis
- Maintains long-term user context and preferences
- Supports Generative UI for interactive responses
- Provides LLM observability for monitoring
- Integrates with authentication for secure access
