# Tasks

## 1. Project Structure Setup

- [x] 1.1 Create analytics-service directory in apps/ with NestJS structure
- [x] 1.2 Initialize NestJS project with pnpm create nest-app
- [x] 1.3 Configure tsconfig.json and nest-cli.json
- [x] 1.4 Create module structure (analytics, clickhouse, grpc modules)
- [x] 1.5 Add required dependencies (@clickhouse/client, @nestjs/microservices, @vlr-finance/schemas)

## 2. Shared Schemas for Analytics

- [x] 2.1 Add analytics Zod schemas to packages/schemas
- [x] 2.2 Create PortfolioAnalytics schema (PnL, allocation, performance)
- [x] 2.3 Create PnLBreakdown schema
- [x] 2.4 Create PerformanceMetrics schema
- [x] 2.5 Export schemas from packages/schemas

## 3. ClickHouse Module

- [x] 3.1 Create ClickHouseService with client configuration
- [x] 3.2 Implement connection management
- [x] 3.3 Implement query execution method
- [x] 3.4 Implement error handling and reconnection
- [x] 3.5 Implement query statistics tracking

## 4. Analytics Module

- [x] 4.1 Create AnalyticsService for portfolio analytics
- [x] 4.2 Implement FIFO PnL calculation algorithm
- [x] 4.3 Implement asset allocation calculation
- [x] 4.4 Implement performance metrics (ROI, Sharpe ratio)
- [x] 4.5 Implement market data queries
- [x] 4.6 Implement portfolio summary query

## 5. gRPC Service

- [x] 5.1 Create proto/analytics/analytics.proto
- [x] 5.2 Create AnalyticsGrpcController
- [x] 5.3 Implement GetPortfolioAnalytics method
- [x] 5.4 Implement GetPnLBreakdown method
- [x] 5.5 Implement GetAssetAllocation method
- [x] 5.6 Configure gRPC in app module

## 6. Health Check

- [x] 6.1 Create HealthController
- [x] 6.2 Implement /health endpoint
- [x] 6.3 Return ClickHouse connection state
- [x] 6.4 Return query statistics
- [x] 6.5 Decorate with OpenAPI decorators

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

- [x] 9.1 Configure environment variables for CLICKHOUSE_URL
- [x] 9.2 Update Dockerfile for analytics-service
- [x] 9.3 Update docker-compose.v3-portfolio.yaml with build context

## 10. Testing (SKIPPED - deferred)

- [~] 10.1 Write unit tests for AnalyticsService (SKIPPED)
- [~] 10.2 Write unit tests for ClickHouseService (SKIPPED)
- [~] 10.3 Test FIFO PnL calculation (SKIPPED)
- [~] 10.4 Test ClickHouse queries (SKIPPED)
- [~] 10.5 Test gRPC methods (SKIPPED)

## 11. Documentation (SKIPPED - deferred)

- [~] 11.1 Update README.md with analytics-service documentation (SKIPPED)
- [~] 11.2 Document analytics queries in docs (SKIPPED)
- [~] 11.3 Document environment variables required (SKIPPED)
