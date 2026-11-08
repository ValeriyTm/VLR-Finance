# Spec Delta

## Purpose

Provides portfolio analytics and market data analysis queries using ClickHouse OLAP database with CQRS query pattern.

## ADDED Requirements

### Requirement: ClickHouse connection
The system SHALL connect to ClickHouse database for OLAP queries.

#### Scenario: Successful connection to ClickHouse
- **WHEN** analytics-service starts
- **THEN** system establishes connection to ClickHouse
- **AND** system verifies database exists

#### Scenario: Connection failure
- **WHEN** ClickHouse connection fails
- **THEN** system logs error and attempts reconnection
- **AND** system returns 503 Service Unavailable for queries

### Requirement: Portfolio PnL calculation
The system SHALL calculate portfolio profit/loss using FIFO algorithm.

#### Scenario: Calculate PnL for portfolio
- **WHEN** user requests portfolio PnL
- **THEN** system queries portfolio transactions from ClickHouse
- **AND** system applies FIFO algorithm
- **AND** system returns realized and unrealized PnL
- **AND** system returns PnL by asset

#### Scenario: No transactions
- **WHEN** portfolio has no transactions
- **THEN** system returns zero PnL
- **AND** system returns empty asset breakdown

### Requirement: Asset allocation
The system SHALL calculate asset allocation percentages for portfolio.

#### Scenario: Calculate asset allocation
- **WHEN** user requests asset allocation
- **THEN** system queries current holdings from ClickHouse
- **AND** system calculates percentage allocation
- **AND** system returns allocation by asset

### Requirement: Performance metrics
The system SHALL calculate portfolio performance metrics (ROI, Sharpe ratio, etc.).

#### Scenario: Calculate performance metrics
- **WHEN** user requests performance metrics
- **THEN** system queries historical portfolio data
- **AND** system calculates ROI
- **AND** system calculates Sharpe ratio
- **AND** system returns metrics

### Requirement: Market data analytics
The system SHALL provide market data analytics from ClickHouse.

#### Scenario: Query market data
- **WHEN** user requests market data for symbol
- **THEN** system queries market-ticks table
- **AND** system returns price history
- **AND** system returns volume history

### Requirement: gRPC analytics methods
The system SHALL provide gRPC methods for portfolio analytics.

#### Scenario: gRPC GetPortfolioAnalytics
- **WHEN** gRPC client calls GetPortfolioAnalytics
- **THEN** system validates user token
- **THEN** system returns portfolio analytics
- **AND** system includes PnL, allocation, performance metrics

### Requirement: Health check endpoint
The system SHALL provide health check endpoint for monitoring.

#### Scenario: Health check
- **WHEN** GET /health is called
- **THEN** system returns status including ClickHouse connection state
- **AND** system returns query statistics
