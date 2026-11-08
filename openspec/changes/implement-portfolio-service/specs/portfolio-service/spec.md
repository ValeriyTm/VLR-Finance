# Spec Delta

## Purpose

Provides portfolio transaction management (buy/sell) using PostgreSQL for OLTP and publishes CDC events to Kafka.

## ADDED Requirements

### Requirement: PostgreSQL connection
The system SHALL connect to PostgreSQL database for transaction storage.

#### Scenario: Successful connection to PostgreSQL
- **WHEN** portfolio-service starts
- **THEN** system establishes connection to PostgreSQL
- **AND** system verifies database exists

#### Scenario: Connection failure
- **WHEN** PostgreSQL connection fails
- **THEN** system logs error and attempts reconnection
- **AND** system returns 503 Service Unavailable for requests

### Requirement: Transaction creation
The system SHALL create portfolio transactions (buy/sell).

#### Scenario: Create buy transaction
- **WHEN** user creates buy transaction
- **THEN** system validates transaction data
- **AND** system stores transaction in PostgreSQL
- **AND** system publishes CDC event to Kafka
- **AND** system returns created transaction

#### Scenario: Create sell transaction
- **WHEN** user creates sell transaction
- **THEN** system validates sufficient holdings
- **AND** system stores transaction in PostgreSQL
- **AND** system publishes CDC event to Kafka
- **AND** system returns created transaction

### Requirement: Transaction validation
The system SHALL validate transactions before creation.

#### Scenario: Insufficient holdings for sell
- **WHEN** user attempts to sell more than owned
- **THEN** system returns 400 Bad Request error
- **AND** system returns error message about insufficient holdings

#### Scenario: Invalid price or quantity
- **WHEN** transaction has invalid price or quantity
- **THEN** system returns 400 Bad Request error
- **AND** system returns validation error

### Requirement: Transaction retrieval
The system SHALL retrieve transactions from PostgreSQL.

#### Scenario: Get user transactions
- **WHEN** user requests their transactions
- **THEN** system queries PostgreSQL
- **AND** system returns transaction list with pagination

### Requirement: Redis caching
The system SHALL cache transactions in Redis for fast lookup.

#### Scenario: Cache transaction on creation
- **WHEN** transaction is created
- **THEN** system caches transaction in Redis
- **AND** system sets TTL for cache

#### Scenario: Check cache before query
- **WHEN** transaction is requested
- **THEN** system checks Redis cache first
- **AND** system returns cached data if available

### Requirement: gRPC commands
The system SHALL provide gRPC methods for portfolio commands.

#### Scenario: gRPC CreateTransaction
- **WHEN** gRPC client calls CreateTransaction
- **THEN** system validates user token
- **THEN** system creates transaction
- **AND** system returns created transaction

### Requirement: Health check endpoint
The system SHALL provide health check endpoint for monitoring.

#### Scenario: Health check
- **WHEN** GET /health is called
- **THEN** system returns status including PostgreSQL connection state
- **AND** system returns Redis connection state
- **AND** system returns transaction statistics
