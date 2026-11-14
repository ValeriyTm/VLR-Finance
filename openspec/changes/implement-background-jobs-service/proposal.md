# Proposal

## Why

The background-jobs-service handles asynchronous background tasks for the VLR Finance platform. It processes BullMQ jobs for PDF report generation, manages job queues, stores reports in MinIO, and provides presigned URLs for secure access. Without this service, users cannot generate or download portfolio reports.

## What Changes

- Implement background-jobs-service microservice with NestJS
- Implement BullMQ job processing with Redis queues
- Implement PDF report generation using Puppeteer
- Implement MinIO integration for report storage
- Implement presigned URL generation for secure downloads
- Implement job status tracking and management
- Decorate all endpoints with OpenAPI decorators
- Create shared Zod schemas for job and report data

## Capabilities

### New Capabilities

- `job-processing`: BullMQ job processing and queue management
- `pdf-generation`: PDF report generation using Puppeteer
- `minio-storage`: S3-compatible storage for reports
- `presigned-urls`: Secure temporary access to reports
- `job-tracking`: Job status and progress tracking

### Modified Capabilities

None - this is a new service implementation.

## Impact

- Enables asynchronous PDF report generation
- Provides secure report storage and access
- Supports portfolio report requests from portfolio-mf
- Integrates with BullMQ for job processing
- Uses MinIO for cost-effective S3 storage
