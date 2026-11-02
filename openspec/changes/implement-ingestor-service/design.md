# Design

## Context

This is a greenfield service implementation. The ingestor-service will be the data ingestion layer connecting to cryptocurrency exchanges and publishing market data to Kafka. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Implement WebSocket connection to Binance exchange
- Implement market tick data ingestion and normalization
- Implement Kafka producer for publishing ticks
- Implement connection resilience with exponential backoff
- Implement mock strategy for local development
- Provide health check endpoint
- Create shared Zod schemas for market data

**Non-Goals:**
- Support for multiple exchanges (Binance only initially) - deferred to future
- Historical data backfilling - deferred to future
- Order book depth ingestion - deferred to future
- Trade execution - not in scope

## Decisions

### Framework: NestJS

**Decision:** Use NestJS framework for ingestor-service.

**Rationale:**
- Built-in support for WebSocket handling
- Excellent TypeScript support
- Easy integration with Kafka
- Consistent with other microservices in the architecture
- Built-in lifecycle hooks for connection management

**Alternatives Considered:**
- **Express.js:** More boilerplate, less structured
- **Raw Node.js:** More control but more boilerplate

### Kafka Client: KafkaJS

**Decision:** Use kafkajs for Kafka producer.

**Rationale:**
- Modern, well-maintained Kafka client for Node.js
- Good TypeScript support
- Simple API for producer/consumer patterns
- Built-in retry and error handling
- Compatible with Kafka 7.6.0 (KRaft mode)

**Alternatives Considered:**
- **kafka-node:** Less maintained, older API
- **confluent-kafka-javascript:** Native bindings, more complex setup

### WebSocket: ws library

**Decision:** Use ws library for WebSocket connections.

**Rationale:**
- Lightweight, fast WebSocket client
- Native Node.js support
- Good TypeScript definitions
- Simple API for connection management
- Compatible with Binance WebSocket API

**Alternatives Considered:**
- **socket.io-client:** Overkill for client-side WebSocket
- **native WebSocket:** Less cross-platform support

### Mock Strategy: Environment Variable

**Decision:** Use MOCK_STRATEGY environment variable to enable mock mode.

**Rationale:**
- Simple configuration approach
- No code changes needed for local development
- Easy to enable/disable via docker-compose
- Consistent with other service configurations

**Alternatives Considered:**
- **Command-line flag:** Less flexible in containerized environments
- **Separate service:** More infrastructure overhead

### Data Format: JSON

**Decision:** Use JSON for market tick data.

**Rationale:**
- Human-readable
- Easy to debug
- Compatible with Kafka JSON serialization
- Standard format for financial data
- Easy to extend with additional fields

**Alternatives Considered:**
- **Avro:** More efficient but adds complexity
- **Protobuf:** More efficient but adds complexity

## Risks / Trade-offs

### WebSocket Connection Instability

**Risk:** Exchange WebSocket connections can be unstable.

**Mitigation:**
- Implement exponential backoff for reconnection
- Implement connection state monitoring
- Log all connection errors
- Provide health check endpoint to monitor connection state
- Implement graceful degradation

### Kafka Producer Bottleneck

**Risk:** High-frequency market data may overwhelm Kafka producer.

**Mitigation:**
- Implement batching for Kafka messages
- Use async publishing with queue
- Monitor Kafka producer lag
- Implement backpressure if needed
- Use Kafka partitioning for parallel processing

### Data Loss on Failure

**Risk:** Market ticks may be lost during connection failures.

**Mitigation:**
- Log all connection failures
- Implement reconnection with minimal delay
- Consider implementing message buffering (future enhancement)
- Document that data loss is acceptable for real-time ticks
- Consider implementing compensation from historical data (future)

### Mock Strategy Accuracy

**Risk:** Mock strategy may not accurately simulate real market behavior.

**Mitigation:**
- Document mock strategy limitations
- Use realistic price movements
- Implement realistic volume distribution
- Allow mock strategy configuration (frequency, symbols)
- Recommend using real exchange for production testing
