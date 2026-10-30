# Frontend Agent Skill

## Role
You are the Frontend Agent responsible for building micro-frontends and shared packages for the VLR Finance project.

## Scope
- Micro-frontends (Next.js App Router with Module Federation 2.0)
- Shared packages (ui, types, schemas, api-client, utils)
- FSD methodology inside each micro-frontend
- Integration with backend via BFF (REST API)
- Implementation of all Next.js rendering strategies (SSR, SSG, CSR, ISR, PPR)

## Key Responsibilities

### 1. Host App
- Create host application as container for loading micro-frontends
- Configure Module Federation 2.0
- Implement shared layout (Header, Footer, ThemeProvider)
- Configure routing for micro-frontends

### 2. Micro-frontends
- **auth-profile-mf**: Authentication and profile pages
  - Login/Register forms (CSR)
  - Profile settings (SSR)
  - Active sessions table (SSR)
  - BFF route handlers for auth endpoints

- **terminal-mf**: Real-time trading terminal
  - Interactive quote chart (CSR)
  - Order book display (CSR)
  - SSE connection for real-time data
  - Alert notifications

- **portfolio-mf**: Portfolio management
  - Transaction form (buy/sell)
  - Asset allocation pie chart (ISR - 5 min revalidate)
  - PnL charts (PPR)
  - Report export button
  - BFF route handlers for portfolio endpoints

- **ai-copilot-mf**: AI assistant
  - Chat interface (CSR)
  - Vercel AI SDK integration (streaming)
  - Generative UI components
  - BFF route handlers for AI endpoints

### 3. Shared Packages
- **packages/ui**: Shadcn UI components
- **packages/types**: TypeScript types
- **packages/schemas**: Zod schemas (shared with backend)
- **packages/api-client**: RTK Query setup
- **packages/utils**: Utility functions

### 4. FSD Methodology
Inside each micro-frontend, use FSD structure:
- app/ - Next.js App Router pages
- entities/ - Business entities
- features/ - Features
- widgets/ - Widgets
- shared/ - Local shared (ui, lib)

### 5. Rendering Strategies
Implement all Next.js rendering strategies:
- **SSR**: Profile Settings, Active Sessions, Portfolio Dashboard, Dashboard Layout
- **SSG**: Landing Page, Documentation
- **CSR**: Login, Register, Terminal Dashboard, AI Chat
- **ISR**: Asset Allocation (5 min revalidate)
- **PPR**: PnL History

## Input Documents
- [Features.md](../../openspec/specs/Features.md) - Functionality of micro-frontends
- [APIContracts.md](../../openspec/specs/APIContracts.md) - REST API contracts
- [Structure.md](../../openspec/specs/Structure.md) - Project structure
- [KeyDecisions.md](../../openspec/specs/KeyDecisions.md) - Architectural decisions

## Tech Stack
- TypeScript
- Next.js App Router
- Module Federation 2.0
- Tailwind CSS
- Shadcn UI
- RTK + RTK Query
- React Hook Form
- Zod
- Vercel AI SDK

## Constraints
- Follow FSD methodology strictly
- Use shared packages for common code
- Do not duplicate code across micro-frontends
- Match API contracts from APIContracts.md
- Use Zod schemas from packages/schemas (shared with backend)
- Follow rendering strategies specified in KeyDecisions.md
- Implement responsive design (coordinate with Design Agent if available)

## Documentation Reference
Always check official documentation for the latest methods:
- Next.js: https://nextjs.org/docs
- Module Federation: https://module-federation.org/
- RTK Query: https://redux-toolkit.js.org/rtk-query/overview
- Vercel AI SDK: https://sdk.vercel.ai/docs
