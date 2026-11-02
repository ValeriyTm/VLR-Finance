# Tasks

## 1. Project Structure Setup

- [x] 1.1 Create ingestor-service directory in apps/ with NestJS structure
- [x] 1.2 Initialize NestJS project with pnpm create nest-app
- [x] 1.3 Configure tsconfig.json and nest-cli.json
- [x] 1.4 Create module structure (ingestor, exchange, kafka modules)
- [x] 1.5 Add required dependencies (kafkajs, ws, @nestjs/websockets, @vlr-finance/schemas)

## 2. Shared Schemas for Market Data

- [x] 2.1 Add market data Zod schemas to packages/schemas
- [x] 2.2 Create MarketTick schema (symbol, price, volume, timestamp)
- [x] 2.3 Create ExchangeConfig schema
- [x] 2.4 Export schemas from packages/schemas

## 3. Exchange Module

- [x] 3.1 Create ExchangeService with WebSocket connection management
- [x] 3.2 Implement Binance WebSocket connection
- [x] 3.3 Implement market tick subscription
- [x] 3.4 Implement tick data parsing and normalization
- [x] 3.5 Implement reconnection logic with exponential backoff
- [x] 3.6 Implement connection state monitoring
- [x] 3.7 Implement mock strategy for local development

## 4. Kafka Module

- [x] 4.1 Create KafkaService with producer configuration
- [x] 4.2 Configure Kafka producer with compression and batching
- [x] 4.3 Implement publish method for market ticks
- [x] 4.4 Implement error handling and retry logic
- [x] 4.5 Implement connection monitoring

## 5. Ingestor Module

- [x] 5.1 Create IngestorService to coordinate exchange and kafka
- [x] 5.2 Implement tick processing pipeline
- [x] 5.3 Implement data validation
- [x] 5.4 Implement error handling
- [x] 5.5 Implement statistics tracking (tick count, errors)

## 6. Health Check

- [x] 6.1 Create HealthController
- [x] 6.2 Implement /health endpoint
- [x] 6.3 Return WebSocket connection state
- [x] 6.4 Return Kafka producer state
- [x] 6.5 Return tick statistics
- [x] 6.6 Decorate with OpenAPI decorators

## 7. Security Middleware

- [x] 7.1 Configure Helmet middleware in main.ts
- [x] 7.2 Configure CORS middleware
- [x] 7.3 Configure global exception filter
- [x] 7.4 Add security headers

## 8. OpenAPI Documentation

- [x] 8.1 Configure SwaggerModule in app module
- [x] 8.2 Set API documentation title and version
- [x] 8.3 Add Swagger UI setup
- [x] 8.4 Decorate health endpoint with OpenAPI decorators

## 9. Integration with Infrastructure

- [x] 9.1 Configure environment variables for KAFKA_BROKERS
- [x] 9.2 Configure environment variables for MOCK_STRATEGY
- [x] 9.3 Configure environment variables for BINANCE_WS_URL
- [x] 9.4 Update Dockerfile for ingestor-service
- [x] 9.5 Update docker-compose.v2-terminal.yaml with build context

## 10. Testing (SKIPPED - deferred)

- [~] 10.1 Write unit tests for ExchangeService (SKIPPED)
- [~] 10.2 Write unit tests for KafkaService (SKIPPED)
- [~] 10.3 Write unit tests for IngestorService (SKIPPED)
- [~] 10.4 Test WebSocket reconnection logic (SKIPPED)
- [~] 10.5 Test Kafka publishing (SKIPPED)
- [~] 10.6 Test mock strategy (SKIPPED)

## 11. Documentation (SKIPPED - deferred)

- [~] 11.1 Update README.md with ingestor-service documentation (SKIPPED)
- [~] 11.2 Document ingestion flow in docs (SKIPPED)
- [~] 11.3 Document environment variables required (SKIPPED)
