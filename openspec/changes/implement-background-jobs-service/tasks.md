# Tasks

## 1. Project Structure Setup

- [x] 1.1 Create background-jobs-service directory in apps/ with NestJS structure
- [x] 1.2 Initialize NestJS project with pnpm create nest-app
- [x] 1.3 Configure tsconfig.json and nest-cli.json
- [x] 1.4 Create module structure (jobs, bullmq, minio modules)
- [x] 1.5 Add required dependencies (bullmq, puppeteer, @aws-sdk/client-s3, @nestjs/bullmq, @vlr-finance/schemas)

## 2. Shared Schemas for Jobs

- [ ] 2.1 Add job Zod schemas to packages/schemas
- [ ] 2.2 Create JobStatus schema
- [ ] 2.3 Create ReportJob schema
- [ ] 2.4 Export schemas from packages/schemas

## 3. BullMQ Module

- [x] 3.1 Create BullMQService with queue configuration
- [x] 3.2 Configure Redis connection
- [x] 3.3 Implement job queue creation
- [x] 3.4 Implement job submission method
- [x] 3.5 Implement job status tracking
- [x] 3.6 Configure BullMQModule

## 4. MinIO Module

- [x] 4.1 Create MinIOService with S3 client configuration
- [x] 4.2 Implement file upload method
- [x] 4.3 Implement presigned URL generation
- [x] 4.4 Implement file deletion method
- [x] 4.5 Configure MinIOModule

## 5. Jobs Module

- [x] 5.1 Create JobsService for job management
- [x] 5.2 Implement report generation job processor
- [x] 5.3 Implement PDF generation with Puppeteer
- [x] 5.4 Implement report upload to MinIO
- [x] 5.5 Implement job status updates
- [x] 5.6 Implement job retry logic

## 6. Health Check

- [x] 6.1 Create HealthController
- [x] 6.2 Implement /health endpoint
- [x] 6.3 Return Redis connection state
- [x] 6.4 Return MinIO connection state
- [x] 6.5 Return job statistics
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
- [x] 8.4 Decorate endpoints with OpenAPI decorators

## 9. Integration with Infrastructure

- [x] 9.1 Configure environment variables for REDIS_URL
- [x] 9.2 Configure environment variables for MINIO_ENDPOINT
- [x] 9.3 Configure environment variables for MINIO_ACCESS_KEY
- [x] 9.4 Configure environment variables for MINIO_SECRET_KEY
- [x] 9.5 Update Dockerfile for background-jobs-service
- [x] 9.6 Update docker-compose.v5-jobs.yaml with build context

## 10. Testing (SKIPPED - deferred)

- [~] 10.1 Write unit tests for JobsService (SKIPPED)
- [~] 10.2 Write unit tests for BullMQService (SKIPPED)
- [~] 10.3 Test PDF generation (SKIPPED)
- [~] 10.4 Test MinIO integration (SKIPPED)
- [~] 10.5 Test job processing (SKIPPED)

## 11. Documentation (SKIPPED - deferred)

- [~] 11.1 Update README.md with background-jobs-service documentation (SKIPPED)
- [~] 11.2 Document job processing flow in docs (SKIPPED)
- [~] 11.3 Document environment variables required (SKIPPED)
