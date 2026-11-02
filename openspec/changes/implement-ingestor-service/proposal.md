# Proposal

## Why

The ingestor-service is the data ingestion layer for the VLR Finance platform. It connects to cryptocurrency exchanges via WebSocket, receives real-time market data (ticks), and publishes this data to Kafka for downstream processing by other services (analytics, AI, CEP). Without this service, no market data can flow into the platform.

## What Changes

- Implement ingestor-service microservice with NestJS
- Implement WebSocket connection to Binance exchange (or Mock strategy for local development)
- Implement market tick data ingestion (symbol, price, volume, timestamp)
- Implement Kafka producer for publishing ticks to market-ticks topic
- Implement connection resilience (reconnection logic, error handling)
- Implement data validation and normalization
- Decorate all endpoints with OpenAPI decorators
- Create shared Zod schemas for market data structures

## Capabilities

### New Capabilities

- `market-data-ingestion`: Real-time market data ingestion from exchanges
- `kafka-publishing`: Publishing market ticks to Kafka topics
- `connection-resilience`: Automatic reconnection on WebSocket failures
- `data-normalization`: Normalizing exchange data to standard format

### Modified Capabilities

None - this is a new service implementation.

## Impact

- Enables real-time market data flow into the platform
- Provides data for analytics-service (portfolio analytics)
- Provides data for ai-copilot-service (market analysis)
- Provides data for ksqlDB (CEP anomaly detection)
- Establishes the data pipeline foundation
