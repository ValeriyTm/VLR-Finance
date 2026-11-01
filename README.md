# VLR Finance - Financial Analytics Platform

![Main Logo](./logo.png)

Note: The project is in the development stage.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

#### Frontend

![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?logo=shadcnui&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-60A5FA?logo=biome&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?logo=redux&logoColor=white)
![RTK Query](https://img.shields.io/badge/RTK_Query-764ABC?logo=redux&logoColor=white)

#### Desktop / Mobile

![React Native](https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB)
![Electron](https://img.shields.io/badge/Electron-47848F?logo=electron&logoColor=white)

#### Backend

![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Docker-336791?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Docker-DC382D?logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-Redis_Queue-DC382D?logo=redis&logoColor=white)
![ClickHouse](https://img.shields.io/badge/ClickHouse-FFCC01?logo=clickhouse&logoColor=black)
![Kafka](https://img.shields.io/badge/Kafka-231F20?logo=apachekafka&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?logo=rabbitmq&logoColor=white)
![MinIO](https://img.shields.io/badge/MinIO-C72E49?logo=minio&logoColor=white)
![ksqlDB](https://img.shields.io/badge/ksqlDB-00A3E0?logo=confluent&logoColor=white)
![Debezium](https://img.shields.io/badge/Debezium-000000?logo=debezium&logoColor=white)

#### LLM

![Langfuse](https://img.shields.io/badge/Langfuse-000000?logo=langfuse&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-1C3C3C?logo=langchain&logoColor=white)
![Mem0](https://img.shields.io/badge/Mem0-6C47FF?logo=mem0&logoColor=white)
![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-000000?logo=vercel&logoColor=white)
![DeepEval](https://img.shields.io/badge/DeepEval-5B4BDB?logo=python&logoColor=white)

#### Testing

![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)
![MSW](https://img.shields.io/badge/MSW-FF6A33?logo=mockserviceworker&logoColor=white)
![React Testing Library](https://img.shields.io/badge/RTL-Testing-E33332?logo=testinglibrary&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-000000?logo=nodedotjs&logoColor=white)
![Testcontainers](https://img.shields.io/badge/Testcontainers-2496ED?logo=docker&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![Husky](https://img.shields.io/badge/Husky-000000?logo=husky&logoColor=white)

#### Tooling

![Zod](https://img.shields.io/badge/Zod-3E67B1)
![OpenAPI](https://img.shields.io/badge/OpenAPI-6BA539?logo=openapiinitiative&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-000000?logo=turborepo&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)

#### DevOps

![Docker](https://img.shields.io/badge/Docker-Container-2496ED?logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-Docker-009639?logo=nginx&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-Docker-E6522C?logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-Docker-F46800?logo=grafana&logoColor=white)
![Grafana Loki](https://img.shields.io/badge/Loki-Docker-F46800?logo=grafana&logoColor=white)
![Grafana Tempo](https://img.shields.io/badge/Tempo-Docker-F46800?logo=grafana&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes&logoColor=white)
<!-- ![K3s](https://img.shields.io/badge/K3s-FFC61C?logo=k3s&logoColor=black) -->

## Project Description

### Core Concept
VLR Finance is a demonstration pet project of a financial analytics platform built with an AI-first approach. The project is designed to showcase modern architectural patterns and technologies in a unified ecosystem.

**Core Principles**:
- **AI-first**: AI is an integral part of functionality, not an add-on feature
- **Microservices Architecture**: Each domain (Auth, Terminal, Portfolio, AI) is implemented as a separate microservice
- **Micro-frontends**: Frontend is divided into independent micro-frontends with the ability to run separately
- **Event-Driven**: Asynchronous communication between services via Kafka and RabbitMQ
- **Real-time**: Streaming market data and CEP anomaly analysis
- **Monorepo**: Single repository with Turborepo and pnpm workspaces

**Project Goal**: Demonstration of skills in working with modern technologies and architectural patterns in a full-stack environment.


### Architecture

#### Client Side


**1) 4 Client Types**:
- **Web**: Browser (Next.js micro-frontends)
- **PWA**: Progressive Web Application (Next.js)
- **Mobile**: Mobile application (React Native)
- **Desktop**: Desktop application (Electron)

**2) Micro-frontends** (Module Federation 2.0 + FSD):
- **host**: Container for loading micro-frontends
- **auth-profile-mf**: Authentication and user profile
- **terminal-mf**: Real-time trading terminal
- **portfolio-mf**: Portfolio management and analytics
- **ai-copilot-mf**: AI assistant with Generative UI

**3) BFF (Backend for Frontend)**:
- 4 BFF layers in Next.js (web, mobile, desktop, pwa)
- Proxying requests to microservices
- Token management (cookies for web/pwa, JSON for mobile/desktop)

#### Server Side

**1) Microservices** (NestJS):
- **auth-service**: Authentication, authorization, session management
- **ingestor-service**: Data ingestion from exchanges (WebSocket → Kafka)
- **portfolio-service**: Portfolio management (CQRS - Commands)
- **analytics-service**: Portfolio analytics (CQRS - Queries)
- **ai-copilot-service**: AI agent with RAG and long-term memory
- **background-jobs-service**: Background jobs (PDF reports)

**2) Service Communication**:
- **gRPC**: Synchronous calls (Auth ↔ AI Copilot, Analytics ↔ Background Jobs)
- **RabbitMQ**: Asynchronous events and sagas (Premium purchase)
- **Kafka**: Data streaming (market ticks, CDC, logs)

#### Infrastructure

**1) Message Brokers**:
- **Kafka**: Streaming and CEP analysis (ksqlDB)
- **RabbitMQ**: Events and sagas

**2) Databases**:
- **PostgreSQL** (auth-service): Users and sessions
- **PostgreSQL + pgvector** (ai-copilot-service): RAG documents and long-term memory
- **PostgreSQL** (portfolio-service): Transactions (OLTP)
- **ClickHouse**: Analytics and market data (OLAP)
- **Redis**: Session cache, rate limiting, BullMQ queues

**3) Infrastructure Services**:
- **MinIO**: S3 storage (PDF reports, logs)
- **ksqlDB**: CEP analysis of market data anomalies
- **Debezium**: CDC from PostgreSQL to Kafka
- **Vector**: Logging (stdout → Kafka → ClickHouse/Loki)
- **Ollama**: Local LLM models (qwen2.5:3b, nomic-embed-text)
- **Mem0**: Long-term memory of AI agent
- **Langfuse Cloud**: Observability for AI agent

**4) Observability**:
- **Prometheus**: Metrics collection
- **Grafana**: Dashboards
- **Grafana Tempo**: Distributed tracing
- **Grafana Loki**: Logging

**5) API Gateway**:
- **Nginx**: Single entry point to backend
- Will be replaced with Ingress Controller at the end of the project (k3s)

---

### Project Structure

```
vlr-finance/
├── apps/                              # Микрофронты и микросервисы
├── packages/                          # Общие пакеты
├── infrastructure/                    # Инфраструктура
├── proto/                              # gRPC прото-файлы
├── .devin/                            # Devin конфигурация
├── .github/                           # GitHub Actions
├── .husky/                            # Git hooks
├── turbo.json                         # Turborepo конфигурация
├── pnpm-workspace.yaml                # pnpm workspaces
├── package.json                       # Root package.json
├── biome.json                         # Biome конфигурация
├── .env.example                       # Пример переменных окружения
└── .gitignore
```

```
apps/
├── host/                              # Host Application (контейнер для микрофронтов)
├── auth-profile-mf/                   # Вертикаль 1: Auth & Profile
├── terminal-mf/                       # Вертикаль 2: Real-time Terminal
├── portfolio-mf/                      # Вертикаль 3: Portfolio & Analytics
└── ai-copilot-mf/                     # Вертикаль 4: AI Copilot
```

```
apps/
├── auth-service/                      # Auth Service
├── ingestor-service/                  # Data Ingestor (Kafka producer)
├── portfolio-service/                 # Portfolio Service (CQRS Commands)
├── analytics-service/                 # Analytics Service (CQRS Queries)
├── ai-copilot-service/                # AI Copilot Service
└── background-jobs-service/           # Background Jobs (BullMQ)
```

```
packages/
├── ui/                                # Общие UI компоненты (Shadcn)
├── config/                            # Биоме, ESLint, TSConfig
├── types/                             # TypeScript типы
├── schemas/                           # Zod схемы (auth, user, portfolio)
├── api-client/                        # RTK Query setup
├── utils/                             # Утилиты
└── grpc/                              # gRPC сгенерированный код
```

```
infrastructure/
├── docker/                            # Docker-файлы для всех сервисов
├── docker-compose/                     # Docker compose конфигурации
│   ├── docker-compose.base.yaml       # Базовые сервисы
│   ├── docker-compose.v1-auth.yaml    # Вертикаль 1
│   ├── docker-compose.v2-terminal.yaml # Вертикаль 2
│   ├── docker-compose.v3-portfolio.yaml # Вертикаль 3
│   ├── docker-compose.v4-ai.yaml     # Вертикаль 4
│   ├── docker-compose.v5-jobs.yaml   # Вертикаль 5
│   └── docker-compose.full.yaml      # Все сервисы
├── k8s/                               # Kubernetes манифесты (в конце проекта)
├── scripts/                           # Скрипты инициализации
│   ├── init-clickhouse.sh             # Создание таблиц ClickHouse
│   ├── init-ksqldb.sql                # ksqlDB стримы и таблицы
│   └── seed-data.sql                  # Seed данные для dev
└── migrations/                        # Миграции БД
    ├── postgres/                      # Prisma миграции
    └── clickhouse/                    # SQL миграции ClickHouse
```


## Project Functionality

### Authentication and Authorization

**User can**:
- Register in the system (email + password)
- Log in to the system
- Log out of current session
- Log out of all sessions (logout-all)
- Configure profile (change name, email)
- View active sessions (devices, IP, time)

**Technical Details**:
- JWT tokens (access: 5 min, refresh: 7 days)
- Breach detection (detection of refresh token reuse)
- Rate limiting (brute-force protection)
- Password hashing (Argon2id)

### Real-time Trading Terminal

**User can**:
- Open trading terminal tab
- Watch interactive real-time quote chart (BTC/USDT)
- See order book (OrderBook)
- Receive popup notifications about market anomalies

**Technical Details**:
- WebSocket connection to Binance exchange (or Mock strategy for local development)
- Streaming ticks to Kafka
- CEP analysis via ksqlDB (calculating moving average)
- Alert generation when price deviates > 2% from SMA
- SSE connection to frontend for real-time updates

### Portfolio Management

**User can**:
- Add transaction (buy/sell asset)
- See pie chart of asset allocation
- View profit/loss charts (PnL)
- Order detailed PDF portfolio report for the year

**Technical Details**:
- CQRS separation (Commands → PostgreSQL, Queries → ClickHouse)
- CDC via Debezium (real-time OLTP and OLAP synchronization)
- FIFO algorithm for PnL calculation (O(N) complexity)
- Asynchronous PDF generation via BullMQ
- Report storage in MinIO with encryption

### AI Assistant

**User can**:
- Write in chat with AI assistant
- Request market data analysis based on documents (RAG)
- Ask for portfolio rebalancing advice
- Receive interactive components directly in chat (Generative UI)

**Example Queries**:
- "Show current BTC anomalies and analyze them based on Bitcoin Whitepaper"
- "Should I buy Apple stock after their latest report?"
- "Rebalance my portfolio"
- "What do you think about my current strategy?"

**Technical Details**:
- LangGraph for agent management (Router → RAG/Tools/Memory)
- RAG via pgvector + HNSW index (semantic search across PDF documents)
- Long-term memory via Mem0 (remembering investment goals)
- Generative UI via Vercel AI SDK (dynamic components in chat)
- SSE response streaming
- Prompt Injection protection (Zod + System Prompt)
- gRPC token validation and limit deduction

### Premium Status Purchase

**User can**:
- Buy Premium account for $50
- Get extended AI request limits (30/min instead of 5/min)
- Get access to extended analytics

**Technical Details**:
- Distributed saga via RabbitMQ
- Compensating transactions on failures
- Money deduction → memory allocation in Mem0 → role change in Auth Service
- Dead Letter Queue for processing failed messages

### Report Export

**User can**:
- Order PDF portfolio report
- Track generation status (Pending → Processing → Completed)
- Download report via temporary link (Presigned URL, 15 min TTL)

**Technical Details**:
- BullMQ for background jobs
- Puppeteer for PDF generation from HTML
- MinIO for file storage with encryption (AES256)
- Presigned URL for secure access

### Logging and Monitoring

**System can**:
- Collect logs from all services in a unified data bus
- Split logs into structured (ClickHouse) and text (Loki)
- Build performance dashboards
- Track AI agent execution (Langfuse Cloud)

**Technical Details**:
- stdout → Vector → Kafka → ClickHouse/Loki
- Prometheus for metrics
- Grafana for dashboards
- Grafana Tempo for distributed tracing
- Langfuse Cloud for AI observability

---

## Project Highlights

### CEP Analysis (Complex Event Processing)

**How it works**:
1. Ingestor Service receives ticks from exchange via WebSocket
2. Ticks are sent to Kafka topic market-ticks
3. ksqlDB reads the stream and calculates moving average (SMA) in 1-minute window
4. When price deviates > 2% from SMA, an event is generated in market-alerts
5. Frontend receives notification via SSE

### LLM and AI Agent

**What it is**: AI assistant with RAG, long-term memory, and Generative UI

**How it works**:
1. User writes a query in chat
2. LangGraph routes the query (RAG / Tools / Text)
3. For RAG: query is vectorized → semantic search in pgvector → response based on context
4. For Tools: gRPC call to Portfolio Service methods
5. Response is streamed via SSE with Generative UI metadata
6. After response: Mem0 analyzes dialog and remembers facts

**Technologies**: LangGraph, Ollama (qwen2.5:3b, nomic-embed-text), pgvector, Mem0, Langfuse Cloud, Vercel AI SDK


### CDC (Change Data Capture)

1. Portfolio Service writes transaction to PostgreSQL
2. Debezium intercepts PostgreSQL WAL logs
3. Changes are sent to Kafka topic portfolio-cdc
4. Vector reads the topic and loads data into ClickHouse
5. Analytics Service makes queries to ClickHouse for analytics

**Technologies**: Debezium, Kafka Connect, ClickHouse (ReplacingMergeTree)


### CQRS (Command Query Responsibility Segregation)

- **Commands (Write)**: Portfolio Service → PostgreSQL (OLTP)
  - Transaction creation
  - ACID guarantees
  - CDC to Kafka

- **Queries (Read)**: Analytics Service → ClickHouse (OLAP)
  - Portfolio analytics
  - Raw SQL queries
  - FIFO algorithm for PnL calculation


### Micro-frontends (Module Federation)

- Host App loads micro-frontends on demand
- Each micro-frontend is isolated (can run separately)
- Shared packages for common components
- FSD methodology inside each micro-frontend


### Resilience Patterns

- **Retry**: Automatic request retry on temporary errors
- **Timeout**: Request execution time limit
- **Circuit Breaker**: Opening on cascading failures
- **Bulkhead**: Limiting parallel requests

**Technologies**: Cockateil



### Event-Driven Architecture

- Kafka for data streaming (market ticks, CDC, logs)
- RabbitMQ for events and sagas (Premium purchase)
- Compensating transactions on failures
- Dead Letter Queue for processing failed messages

**Technologies**: Kafka, RabbitMQ, Debezium

---

## Technology Stack

### Frontend
- TypeScript, Next.js App Router, Tailwind, Shadcn UI
- Module Federation 2.0, FSD methodology
- RTK + RTK Query, React Hook Form, Zod
- Vercel AI SDK (streaming)

### Backend
- NestJS, TypeScript
- Kafka, RabbitMQ, gRPC
- PostgreSQL, Prisma ORM, pgvector
- ClickHouse, Redis
- MinIO, @aws-sdk/client-s3

### AI
- LangGraph, Ollama (qwen2.5:3b, nomic-embed-text)
- pgvector + HNSW, Mem0
- Langfuse Cloud

### Infrastructure
- Docker, docker-compose
- Turborepo, pnpm workspaces
- Nginx, ksqlDB, Debezium, Vector
- Prometheus, Grafana, Grafana Tempo, Grafana Loki

### Testing
- Vitest, MSW, RTL, jsdom
- Supertest, Testcontainers
- Playwright

---
## Running the Project

### Requirements
- Docker
- Node.js >= 18
- pnpm >= 8
- Ollama (running on localhost:11434 for AI features)

### Infrastructure Setup

The project uses Docker Compose for local development. Infrastructure is organized into verticals to allow incremental development.

**Base Services** (databases, message brokers, observability):
```bash
docker-compose -f infrastructure/docker-compose/docker-compose.base.yaml up -d
```

**Vertical 1 (Auth & Profile)**:
```bash
docker-compose -f infrastructure/docker-compose/docker-compose.base.yaml \
  -f infrastructure/docker-compose/docker-compose.v1-auth.yaml up -d
```

**Vertical 2 (Terminal)**:
```bash
docker-compose -f infrastructure/docker-compose/docker-compose.base.yaml \
  -f infrastructure/docker-compose/docker-compose.v2-terminal.yaml up -d
```

**Vertical 3 (Portfolio & Analytics)**:
```bash
docker-compose -f infrastructure/docker-compose/docker-compose.base.yaml \
  -f infrastructure/docker-compose/docker-compose.v3-portfolio.yaml up -d
```

**Vertical 4 (AI Copilot)**:
```bash
docker-compose -f infrastructure/docker-compose/docker-compose.base.yaml \
  -f infrastructure/docker-compose/docker-compose.v4-ai.yaml up -d
```

**Vertical 5 (Background Jobs)**:
```bash
docker-compose -f infrastructure/docker-compose/docker-compose.base.yaml \
  -f infrastructure/docker-compose/docker-compose.v5-jobs.yaml up -d
```

**All Services**:
```bash
docker-compose -f infrastructure/docker-compose/docker-compose.base.yaml \
  -f infrastructure/docker-compose/docker-compose.full.yaml up -d
```

### Service URLs

After starting the base services, access the following URLs:

- **Nginx API Gateway**: http://localhost
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **ksqDB UI**: http://localhost:8088

### Database Migrations

**PostgreSQL** (via Prisma):
```bash
# Auth database
cd apps/auth-service
pnpm prisma migrate dev

# Portfolio database
cd apps/portfolio-service
pnpm prisma migrate dev

# AI database
cd apps/ai-copilot-service
pnpm prisma migrate dev
```

**ClickHouse**:
```bash
docker exec vlr-clickhouse /docker-entrypoint-initdb.d/init-clickhouse.sh
```

### Troubleshooting

**Containers won't start**:
- Check Docker is running: `docker ps`
- Check port conflicts: services use ports 80, 3000-3009, 5432-5434, 6379, 8123, 9000-9001, 9090, 9092, 15672, 3100, 3200, 4318, 8083, 8088
- Check logs: `docker-compose logs <service-name>`

**Database connection errors**:
- Verify DATABASE_URL in .env matches docker-compose configuration
- Check PostgreSQL containers are healthy: `docker-compose ps`

**Kafka/ksqDB issues**:
- Kafka runs in KRaft mode (no Zookeeper needed)
- Wait for Kafka to fully start before running ksqlDB commands
- Check Kafka UI if enabled: http://localhost:8080

**MinIO bucket creation**:
- Access MinIO console at http://localhost:9001
- Create buckets manually: reports, logs, assets
- Or run minio-init container: `docker-compose up minio-init`

### Running Verticals

---

## Authors & License

- [MIT License](./LICENSE)
