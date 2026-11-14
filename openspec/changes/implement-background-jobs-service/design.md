# Design

## Context

This is a greenfield service implementation. The background-jobs-service handles asynchronous tasks like PDF report generation. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Implement BullMQ job processing with Redis
- Implement PDF report generation using Puppeteer
- Implement MinIO integration for report storage
- Implement presigned URL generation
- Implement job status tracking
- Provide health check endpoint
- Create shared Zod schemas for job data

**Non-Goals:**
- Real-time job processing - asynchronous only
- Complex report templates - basic PDF generation
- Email notifications - deferred to future
- Report scheduling - deferred to future

## Decisions

### Framework: NestJS

**Decision:** Use NestJS framework for background-jobs-service.

**Rationale:**
- Consistent with other microservices
- Built-in support for BullMQ integration
- Easy integration with MinIO
- TypeScript support

### Job Queue: BullMQ

**Decision:** Use BullMQ for job processing with Redis.

**Rationale:**
- Modern, well-maintained job queue
- Redis-based (already in infrastructure)
- Supports retries, priorities, scheduling
- Good TypeScript support
- Built-in dashboard support

**Alternatives Considered:**
- **Agenda:** Less active development
- **node-resque:** Less modern

### PDF Generation: Puppeteer

**Decision:** Use Puppeteer for PDF generation.

**Rationale:**
- Headless Chrome for high-quality PDFs
- HTML-to-PDF conversion
- Supports complex layouts
- Well-maintained
- Industry standard

**Alternatives Considered:**
- **pdfkit:** Lower quality output
- **wkhtmltopdf:** Less maintained

### Storage: MinIO

**Decision:** Use MinIO for S3-compatible storage.

**Rationale:**
- Already in infrastructure
- S3-compatible API
- Cost-effective
- Presigned URL support
- Encryption support

**Alternatives Considered:**
- **Local filesystem:** Not scalable
- **AWS S3:** Costs and complexity

### Presigned URLs

**Decision:** Generate presigned URLs with 15-minute TTL.

**Rationale:**
- Secure temporary access
- No need for authentication on download
- Industry standard practice
- Configurable expiration

**Alternatives Considered:**
- **Direct download:** Security risk
- **Longer TTL:** Higher security risk

## Risks / Trade-offs

### Job Processing Reliability

**Risk:** Jobs may fail or get stuck.

**Mitigation:**
- Implement retry logic with exponential backoff
- Implement dead letter queue for failed jobs
- Monitor job status
- Implement timeout handling
- Log all job failures

### PDF Generation Performance

**Risk:** PDF generation may be slow for large reports.

**Mitigation:**
- Process jobs asynchronously
- Implement job prioritization
- Optimize HTML templates
- Use Puppeteer efficiently
- Monitor generation time

### MinIO Availability

**Risk:** MinIO may be unavailable.

**Mitigation:**
- Health checks for MinIO
- Retry logic for failed uploads
- Implement fallback storage (local)
- Monitor MinIO health
- Document MinIO as required service

### Presigned URL Security

**Risk:** Presigned URLs may be shared or leaked.

**Mitigation:**
- Short TTL (15 minutes)
- One-time use URLs if possible
- Monitor URL usage
- Implement rate limiting
- Document security best practices
