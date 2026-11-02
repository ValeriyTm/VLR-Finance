# Spec Delta

## Purpose

Provides real-time market data ingestion from cryptocurrency exchanges and publishes data to Kafka for downstream processing.

## ADDED Requirements

### Requirement: WebSocket connection to exchange
The system SHALL connect to cryptocurrency exchange WebSocket API to receive real-time market data.

#### Scenario: Successful connection to Binance
- **WHEN** ingestor-service starts
- **THEN** system establishes WebSocket connection to Binance
- **AND** system subscribes to market tick streams

#### Scenario: Connection failure
- **WHEN** WebSocket connection fails
- **THEN** system logs error and attempts reconnection
- **AND** system uses exponential backoff for reconnection attempts

### Requirement: Market tick ingestion
The system SHALL receive and parse market tick data from exchange WebSocket.

#### Scenario: Receive market tick
- **WHEN** exchange sends market tick data
- **THEN** system parses symbol, price, volume, and timestamp
- **AND** system validates data format
- **AND** system normalizes data to standard format

#### Scenario: Invalid tick data
- **WHEN** received tick data is invalid
- **THEN** system logs warning and discards the data
- **AND** system continues processing subsequent ticks

### Requirement: Kafka publishing
The system SHALL publish market ticks to Kafka market-ticks topic.

#### Scenario: Publish tick to Kafka
- **WHEN** valid market tick is received
- **THEN** system publishes tick to market-ticks topic
- **AND** system includes all required fields (symbol, price, volume, timestamp)

#### Scenario: Kafka publish failure
- **WHEN** Kafka publish fails
- **THEN** system logs error
- **AND** system attempts retry with exponential backoff
- **AND** system continues processing subsequent ticks

### Requirement: Mock strategy for local development
The system SHALL support mock strategy for local development without external exchange connection.

#### Scenario: Use mock strategy
- **WHEN** MOCK_STRATEGY environment variable is true
- **THEN** system generates simulated market ticks
- **AND** system publishes simulated ticks to Kafka
- **AND** system does not connect to exchange WebSocket

### Requirement: Data normalization
The system SHALL normalize exchange data to standard format regardless of exchange.

#### Scenario: Normalize Binance data
- **WHEN** Binance tick data is received
- **THEN** system converts to standard format (symbol, price, volume, timestamp)
- **AND** system standardizes timestamp to UTC
- **AND** system standardizes price to decimal with 8 decimal places

### Requirement: Connection resilience
The system SHALL automatically reconnect on WebSocket connection failures.

#### Scenario: WebSocket disconnect
- **WHEN** WebSocket connection is lost
- **THEN** system logs disconnection
- **AND** system attempts reconnection with exponential backoff
- **AND** system subscribes to market streams after reconnection

#### Scenario: Max reconnection attempts
- **WHEN** reconnection attempts exceed threshold
- **THEN** system logs critical error
- **AND** system continues attempting reconnection with longer backoff

### Requirement: Health check endpoint
The system SHALL provide health check endpoint for monitoring.

#### Scenario: Health check
- **WHEN** GET /health is called
- **THEN** system returns status including WebSocket connection state
- **AND** system returns Kafka producer state
- **AND** system returns tick count statistics
