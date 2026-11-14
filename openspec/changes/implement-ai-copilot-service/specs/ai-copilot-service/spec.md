# Spec Delta

## Purpose

Provides AI-powered financial assistant with RAG, long-term memory, and Generative UI capabilities.

## ADDED Requirements

### Requirement: LangGraph Agent
The system SHALL implement a LangGraph agent with nodes for routing, RAG, tools, and memory.

#### Scenario: Agent initialization
- **WHEN** ai-copilot-service starts
- **THEN** system initializes LangGraph agent
- **AND** system configures nodes (Router, RAG, Tools, Memory)
- **AND** system loads system prompt with XML isolation

#### Scenario: Agent routing
- **WHEN** user submits query
- **THEN** Router node decides intent (RAG/Tools/Text)
- **AND** system executes appropriate node
- **AND** system returns response

### Requirement: RAG implementation
The system SHALL implement RAG using pgvector with HNSW index for semantic search.

#### Scenario: Document ingestion
- **WHEN** document is uploaded
- **THEN** system embeds document using nomic-embed-text
- **AND** system stores embedding in pgvector
- **AND** system updates HNSW index

#### Scenario: Semantic search
- **WHEN** RAG node executes
- **THEN** system embeds user query
- **AND** system performs semantic search in pgvector
- **AND** system retrieves relevant documents
- **AND** system includes context in LLM prompt

### Requirement: Long-term memory (Mem0)
The system SHALL use Mem0 for long-term memory of user facts and preferences.

#### Scenario: Memory storage
- **WHEN** user interacts with AI
- **THEN** system asynchronously extracts facts
- **AND** system stores facts in Mem0
- **AND** system associates facts with user ID

#### Scenario: Memory retrieval
- **WHEN** user starts new session
- **THEN** system retrieves user facts from Mem0
- **AND** system includes facts in system prompt

### Requirement: Ollama LLM integration
The system SHALL integrate with Ollama for LLM generation.

#### Scenario: LLM generation
- **WHEN** user submits query
- **THEN** system sends query to Ollama (qwen2.5:3b)
- **AND** system receives response
- **AND** system streams response via SSE

#### Scenario: Embedding generation
- **WHEN** RAG or Memory node executes
- **THEN** system sends text to Ollama (nomic-embed-text)
- **AND** system receives embedding vector

### Requirement: Generative UI
The system SHALL support Generative UI with JSON markers for dynamic components.

#### Scenario: Component generation
- **WHEN** LLM response includes UI marker
- **THEN** system parses JSON marker
- **AND** system includes component metadata in SSE stream
- **AND** frontend renders dynamic component

### Requirement: SSE streaming
The system SHALL stream AI responses via Server-Sent Events.

#### Scenario: SSE streaming
- **WHEN** user submits query
- **THEN** system opens SSE connection
- **AND** system streams content events
- **AND** system streams component events if applicable
- **AND** system sends done event when complete

### Requirement: Prompt injection protection
The system SHALL protect against prompt injection attacks.

#### Scenario: Input validation
- **WHEN** user submits query
- **THEN** system validates with Zod schema
- **AND** system checks max length (500 chars)
- **AND** system forbids special characters

#### Scenario: System prompt isolation
- **WHEN** user input is processed
- **THEN** system wraps user input in <user_input> tags
- **AND** system uses XML isolation in system prompt

### Requirement: gRPC Auth integration
The system SHALL validate user tokens via Auth Service gRPC.

#### Scenario: Token validation
- **WHEN** user submits query
- **THEN** system calls Auth Service ValidateUserTariff
- **AND** system checks user role and limits
- **AND** system decrements AI request limits
- **AND** system rejects if limits exceeded

### Requirement: Langfuse observability
The system SHALL integrate with Langfuse Cloud for LLM observability.

#### Scenario: Trace generation
- **WHEN** user submits query
- **THEN** system creates Langfuse trace
- **AND** system logs LangGraph steps
- **AND** system logs LLM calls
- **AND** system logs embeddings

### Requirement: Health check endpoint
The system SHALL provide health check endpoint for monitoring.

#### Scenario: Health check
- **WHEN** GET /health is called
- **THEN** system returns status including Ollama connection
- **AND** system returns pgvector connection
- **AND** system returns Mem0 connection
- **AND** system returns LangGraph agent state
