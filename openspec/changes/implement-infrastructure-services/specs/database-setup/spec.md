# Spec Delta

## Purpose

Configures PostgreSQL, ClickHouse, and Redis databases with appropriate schemas and migrations for all services.

## ADDED Requirements

### Requirement: PostgreSQL databases exist for auth, portfolio, and AI services
The system SHALL provide separate PostgreSQL databases for auth-service, portfolio-service, and ai-copilot-service.

#### Scenario: Auth database exists
- **WHEN** auth-service connects to PostgreSQL
- **THEN** auth database exists and is accessible

#### Scenario: Portfolio database exists
- **WHEN** portfolio-service connects to PostgreSQL
- **THEN** portfolio database exists and is accessible

#### Scenario: AI database exists with pgvector extension
- **WHEN** ai-copilot-service connects to PostgreSQL
- **THEN** ai database exists with pgvector extension enabled

### Requirement: Prisma migrations exist for PostgreSQL databases
The system SHALL provide Prisma migration files for all PostgreSQL databases with appropriate schemas.

#### Scenario: Auth migrations apply successfully
- **WHEN** developer runs Prisma migrate for auth-service
- **THEN** auth database schema is created with users and sessions tables

#### Scenario: Portfolio migrations apply successfully
- **WHEN** developer runs Prisma migrate for portfolio-service
- **THEN** portfolio database schema is created with transactions table

#### Scenario: AI migrations apply successfully
- **WHEN** developer runs Prisma migrate for ai-copilot-service
- **THEN** ai database schema is created with documents and memories tables

### Requirement: ClickHouse database exists for analytics
The system SHALL provide ClickHouse database for analytics-service with appropriate table structures.

#### Scenario: ClickHouse initialization script runs
- **WHEN** developer runs init-clickhouse.sh script
- **THEN** ClickHouse database and tables are created

#### Scenario: ClickHouse tables support analytics queries
- **WHEN** analytics-service queries ClickHouse
- **THEN** tables exist with appropriate schema for market data and portfolio analytics

### Requirement: ClickHouse migrations exist
The system SHALL provide SQL migration scripts for ClickHouse table creation and initialization.

#### Scenario: Market data table exists
- **WHEN** migration script runs
- **THEN** market_data table exists with appropriate columns and engine

#### Scenario: Portfolio analytics table exists
- **WHEN** migration script runs
- **THEN** portfolio_analytics table exists with appropriate columns and engine

### Requirement: Redis exists for caching and queues
The system SHALL provide Redis instance for session caching, rate limiting, and BullMQ queues.

#### Scenario: Redis is accessible
- **WHEN** any service connects to Redis
- **THEN** connection succeeds

#### Scenario: Redis persists data
- **WHEN** service writes to Redis
- **THEN** data is retrievable until expiration

### Requirement: Database connections are configurable
The system SHALL allow database connection parameters to be configured via environment variables.

#### Scenario: Auth database uses environment variables
- **WHEN** auth-service starts
- **THEN** it reads DATABASE_URL from environment variables

#### Scenario: ClickHouse uses environment variables
- **WHEN** analytics-service starts
- **THEN** it reads CLICKHOUSE_URL from environment variables
