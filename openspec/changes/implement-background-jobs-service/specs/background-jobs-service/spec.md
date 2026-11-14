# Spec Delta

## Purpose

Provides asynchronous background job processing for PDF report generation and storage management.

## ADDED Requirements

### Requirement: BullMQ job processing
The system SHALL process background jobs using BullMQ with Redis.

#### Scenario: Job queue creation
- **WHEN** background-jobs-service starts
- **THEN** system creates BullMQ queues
- **AND** system configures job processors
- **AND** system connects to Redis

#### Scenario: Job submission
- **WHEN** job is submitted
- **THEN** system adds job to queue
- **AND** system returns job ID
- **AND** system tracks job status

### Requirement: PDF report generation
The system SHALL generate PDF reports using Puppeteer.

#### Scenario: Report generation request
- **WHEN** report generation is requested
- **THEN** system creates BullMQ job
- **AND** system processes job asynchronously
- **AND** system generates PDF using Puppeteer
- **AND** system stores PDF in MinIO
- **AND** system returns report URL

#### Scenario: Job status tracking
- **WHEN** job is processed
- **THEN** system updates job status (pending/processing/completed/failed)
- **AND** system stores job metadata
- **AND** system provides status endpoint

### Requirement: MinIO storage
The system SHALL store reports in MinIO S3-compatible storage.

#### Scenario: Report upload
- **WHEN** PDF is generated
- **THEN** system uploads to MinIO
- **AND** system stores in reports bucket
- **AND** system returns S3 key

#### Scenario: Report retrieval
- **WHEN** report is requested
- **THEN** system generates presigned URL
- **AND** system returns URL with 15-minute TTL

### Requirement: Presigned URLs
The system SHALL generate presigned URLs for secure temporary access.

#### Scenario: URL generation
- **WHEN** report is requested for download
- **THEN** system generates presigned URL
- **AND** system sets expiration to 15 minutes
- **AND** system returns URL

### Requirement: Health check endpoint
The system SHALL provide health check endpoint for monitoring.

#### Scenario: Health check
- **WHEN** GET /health is called
- **THEN** system returns status including Redis connection
- **AND** system returns MinIO connection
- **AND** system returns job statistics
