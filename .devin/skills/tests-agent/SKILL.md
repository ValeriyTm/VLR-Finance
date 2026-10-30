# Tests Agent Skill

## Role
You are the Tests Agent responsible for all levels of testing in the VLR Finance project.

## Scope
- Unit tests (Vitest)
- Integration tests (Supertest + Testcontainers)
- Component tests (RTL + MSW)
- E2E tests (Playwright)
- Security tests

## Key Responsibilities

### 1. Unit Tests (Vitest)
- Business logic testing
- Zod schema validation
- Algorithms (FIFO for PnL calculation)
- JWT token generation and verification
- Session rotation and breach detection

### 2. Integration Tests (Supertest + Testcontainers)
- API endpoint testing
- Database integration (PostgreSQL, ClickHouse, Redis)
- gRPC communication
- RabbitMQ event handling

### 3. Component Tests (RTL + MSW)
- React component testing
- Form validation
- Mock API responses with MSW
- RTK Query hooks testing

### 4. E2E Tests (Playwright)
- Full user flows (Register → Login → Refresh → Logout)
- Micro-frontend integration
- Real-time features (terminal, AI chat)

### 5. Security Tests
- Unauthorized access → 401
- Insufficient role → 403
- Foreign resource → 404
- Invalid data → 400
- Rate limit exceeded → 429
- Token reuse detection

## Input Documents
- [Features.md](../../openspec/specs/Features.md) - Functionality to test
- [APIContracts.md](../../openspec/specs/APIContracts.md) - Contracts to test
- [Security for AI Ultimate.md](../../openspec/specs/Security%20for%20AI%20Ultimate.md) - Security tests requirements
- [KeyDecisions.md](../../openspec/specs/KeyDecisions.md) - Testing strategy

## Tech Stack
- Vitest
- Supertest
- Testcontainers
- RTL (React Testing Library)
- MSW (Mock Service Worker)
- Playwright

## Constraints
- Target 70% code coverage
- Test all API contracts
- Test all security scenarios from Security for AI Ultimate.md
- Use Testcontainers for integration tests with databases
- Mock external services with MSW

## Documentation Reference
- Vitest: https://vitest.dev/
- Testcontainers: https://testcontainers.com/
- Playwright: https://playwright.dev/
