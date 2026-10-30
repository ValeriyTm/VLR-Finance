# Project Rules for VLR Finance

## General Principles

### 1. Always Check Official Documentation
Before using any library or framework, check the official documentation for the latest methods and best practices. Do not rely on outdated knowledge.

### 2. Follow KeyDecisions.md
All architectural decisions are documented in [KeyDecisions.md](../../Plans/KeyDecisions.md). Never deviate from these decisions without explicit approval.

### 3. Monorepo Structure
Follow the structure defined in [Structure.md](../../Plans/Structure.md):
- apps/ for micro-frontends and microservices
- packages/ for shared packages
- infrastructure/ for Docker, scripts, migrations
- proto/ for gRPC proto files

### 4. Code Style
- Use Biome for linting and formatting
- Follow TypeScript strict mode
- No comments unless absolutely necessary (remove if accidentally added)
- Write compact code - collapse duplicate else branches, avoid unnecessary nesting

### 5. Error Handling
- Implement centralized error handling in all services
- Map Prisma errors to appropriate HTTP status codes
- Never log sensitive data (passwords, tokens, secrets)
- Use Cockateil for resilience patterns

### 6. Database
- Use Prisma for PostgreSQL
- Use raw SQL for ClickHouse
- Use idempotency keys for transaction deduplication
- Implement proper indexes

### 7. Security
- Never store secrets in code
- Use environment variables for configuration
- Validate env variables with Zod at startup
- Use Argon2id for password hashing
- Implement rate limiting on sensitive endpoints
- Use HttpOnly, Secure, SameSite=strict cookies

### 8. Testing
- Target 70% code coverage
- Write tests for all API contracts
- Test all security scenarios
- Use Testcontainers for integration tests

### 9. API Contracts
- Follow contracts defined in [APIContracts.md](../../Plans/APIContracts.md)
- Do not change contracts without updating documentation
- Use Zod schemas from packages/schemas (shared between frontend and backend)

### 10. Dependencies
- Prefer packages published at least 7 days ago
- Avoid floating ranges (latest, *, unbounded >=)
- Use shared packages for common dependencies

### 11. Git
- Follow conventional commits
- Use Co-Authored-By for bot commits
- Never commit secrets
- Use husky for pre-commit hooks

### 12. Docker
- Use non-root user in containers
- Use env_file for secrets (not in image)
- Enable service isolation (run verticals separately)
- Configure proper networking

### 13. Documentation
- Update documentation when changing architecture
- Keep API contracts in sync with implementation
- Document architectural decisions

### 14. Agent Coordination
- Each agent works only in their area of responsibility
- Do not modify other agents' code without coordination
- Resolve conflicts through Coordinator Agent
- All changes must align with KeyDecisions.md

### 15. Performance
- Optimize for fast iteration
- Use caching where appropriate
- Implement proper database indexes
- Use efficient algorithms (e.g., FIFO O(N) for PnL)

### 16. Monitoring
- All logs go to stdout/stderr
- Use structured logging (JSON)
- Implement proper tracing (Langfuse for AI, Tempo for distributed)
- Set up Prometheus metrics

### 17. AI Specific
- Connect to Ollama on localhost:11434 via host.docker.internal
- Use Langfuse Cloud (not local)
- Use Mem0 as Docker container
- Protect against prompt injection
- Implement rate limiting on AI endpoints

### 18. Responsive Design
For Design Agent: support breakpoints:
- desktop: 1599.98px
- laptop: 1440.98px
- laptop-s: 1199.92px
- tablet: 1023.98px
- mobile: 767.98px
- mobile-s: 480.98px

## Violation Consequences
If any rule is violated:
- The responsible agent must fix the issue
- Document the reason for deviation
- Get approval from Coordinator Agent
- Update relevant documentation
