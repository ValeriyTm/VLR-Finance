# Design

## Context

This is a complex AI service implementation. The ai-copilot-service implements an AI agent with RAG, long-term memory, and Generative UI capabilities. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Implement LangGraph agent with routing
- Implement RAG with pgvector + HNSW
- Implement long-term memory with Mem0
- Integrate with Ollama for LLM and embeddings
- Implement Generative UI with SSE streaming
- Implement prompt injection protection
- Integrate with Auth Service via gRPC
- Integrate with Langfuse Cloud for observability
- Provide health check endpoint

**Non-Goals:**
- Multiple LLM providers - Ollama only initially
- Fine-tuning models - deferred to future
- Complex agent orchestration - basic LangGraph only
- Voice interface - deferred to future

## Decisions

### Framework: NestJS

**Decision:** Use NestJS framework for ai-copilot-service.

**Rationale:**
- Consistent with other microservices
- Built-in support for SSE streaming
- Easy integration with gRPC
- TypeScript support for type safety

**Alternatives Considered:**
- **Express.js:** Less structured
- **Fastify:** Faster but less ecosystem support

### LangGraph for Agent

**Decision:** Use LangGraph for agent orchestration.

**Rationale:**
- State-of-the-art agent framework
- Built-in support for routing and tools
- TypeScript support
- Good observability with Langfuse
- Supports streaming responses

**Alternatives Considered:**
- **LangChain:** Less specialized for agents
- **Custom implementation:** More boilerplate

### RAG with pgvector

**Decision:** Use pgvector with HNSW index for semantic search.

**Rationale:**
- PostgreSQL extension for vector search
- HNSW index provides O(log N) search
- Already in AI database setup
- Compatible with Prisma ORM
- Supports M=16, ef_construction=64 configuration

**Alternatives Considered:**
- **ChromaDB:** Separate service, more complexity
- **Weaviate:** More complex setup

### Mem0 for Long-term Memory

**Decision:** Use Mem0 as Docker container for long-term memory.

**Rationale:**
- Purpose-built for AI agent memory
- Simple API
- Can store in Redis or PostgreSQL
- Async fact extraction
- User-specific memory isolation

**Alternatives Considered:**
- **Custom implementation:** More boilerplate
- **Redis only:** Less structured memory

### Ollama for LLM

**Decision:** Use Ollama on localhost:11434 for LLM and embeddings.

**Rationale:**
- Local LLM execution (privacy)
- No API costs
- Supports qwen2.5:3b and nomic-embed-text
- Already running on host machine
- Easy integration via host.docker.internal

**Alternatives Considered:**
- **OpenAI API:** Costs and privacy concerns
- **Anthropic API:** Costs and privacy concerns

### SSE for Streaming

**Decision:** Use Server-Sent Events for real-time AI responses.

**Rationale:**
- Standard web technology
- Simple to implement
- Works with Vercel AI SDK
- Supports event types (content, component, done)
- Efficient for text streaming

**Alternatives Considered:**
- **WebSockets:** More complex, bidirectional not needed
- **Polling:** Less efficient

### Prompt Injection Protection

**Decision:** Use Zod validation + XML isolation in system prompt.

**Rationale:**
- Zod provides type-safe validation
- XML isolation prevents prompt injection
- Industry best practice for AI security
- Simple to implement
- Effective against common attacks

**Alternatives Considered:**
- **Custom sanitization:** Less robust
- **No protection:** Security risk

## Risks / Trade-offs

### LLM Response Quality

**Risk:** Local LLM (qwen2.5:3b) may produce lower quality responses than cloud models.

**Mitigation:**
- Use prompt engineering
- Provide good context via RAG
- Allow model upgrade path
- Document model limitations
- Monitor response quality via Langfuse

### RAG Performance

**Risk:** RAG may be slow on large document sets.

**Mitigation:**
- HNSW index provides O(log N) search
- Limit retrieval to top-k results
- Use connection pooling
- Monitor query performance
- Implement caching for frequent queries

### Mem0 Reliability

**Risk:** Mem0 container may be unavailable.

**Mitigation:**
- Graceful degradation (fallback to Redis memory)
- Health checks for Mem0
- Retry logic for failed calls
- Document Mem0 as optional service
- Implement circuit breaker pattern

### Ollama Availability

**Risk:** Ollama may not be running on host machine.

**Mitigation:**
- Health checks for Ollama
- Clear error messages
- Document Ollama requirement
- Support fallback to mock responses
- Retry logic for failed calls

### Langfuse Cloud Dependency

**Risk:** Langfuse Cloud may be unavailable.

**Mitigation:**
- Graceful degradation (skip tracing)
- Health checks for Langfuse
- Retry logic for failed calls
- Document Langfuse as optional
- Implement local fallback
