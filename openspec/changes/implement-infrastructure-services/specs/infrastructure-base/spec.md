# Spec Delta

## Purpose

Provides the foundational project structure, Docker containerization, and orchestration for all services and frontends.

## ADDED Requirements

### Requirement: Monorepo structure uses Turborepo and pnpm workspaces
The system SHALL use Turborepo with pnpm workspaces to manage the monorepo structure with apps, packages, and infrastructure directories.

#### Scenario: Turborepo builds all packages
- **WHEN** developer runs `turbo run build`
- **THEN** system builds all apps and packages in dependency order

#### Scenario: pnpm workspace installs dependencies
- **WHEN** developer runs `pnpm install`
- **THEN** system installs dependencies for all workspaces according to workspace configuration

### Requirement: Docker containers exist for all services
The system SHALL provide Docker containers for 6 microservices and 5 micro-frontends.

#### Scenario: Dockerfile exists for auth-service
- **WHEN** developer inspects apps/auth-service/Dockerfile
- **THEN** Dockerfile exists with appropriate base image and build instructions

#### Scenario: Dockerfile exists for auth-profile-mf
- **WHEN** developer inspects apps/auth-profile-mf/Dockerfile
- **THEN** Dockerfile exists with appropriate base image and build instructions

### Requirement: Docker-compose base configuration exists
The system SHALL provide docker-compose.base.yaml with base infrastructure services (PostgreSQL, Redis, Kafka, RabbitMQ, MinIO, ClickHouse, Nginx).

#### Scenario: Base services start successfully
- **WHEN** developer runs `docker-compose -f docker-compose.base.yaml up -d`
- **THEN** all base infrastructure services start without errors

#### Scenario: Base services are healthy
- **WHEN** developer runs `docker-compose ps`
- **THEN** all base services show healthy status

### Requirement: Docker-compose vertical configurations exist
The system SHALL provide docker-compose.v1-auth.yaml, docker-compose.v2-terminal.yaml, docker-compose.v3-portfolio.yaml, docker-compose.v4-ai.yaml, docker-compose.v5-jobs.yaml for each vertical.

#### Scenario: Vertical 1 starts auth services
- **WHEN** developer runs `docker-compose -f docker-compose.base.yaml -f docker-compose.v1-auth.yaml up -d`
- **THEN** auth-service and auth-profile-mf start successfully

#### Scenario: Vertical 2 starts terminal services
- **WHEN** developer runs `docker-compose -f docker-compose.base.yaml -f docker-compose.v2-terminal.yaml up -d`
- **THEN** ingestor-service and terminal-mf start successfully

### Requirement: Docker-compose full configuration exists
The system SHALL provide docker-compose.full.yaml that combines all verticals for complete system startup.

#### Scenario: All services start with full configuration
- **WHEN** developer runs `docker-compose -f docker-compose.base.yaml -f docker-compose.full.yaml up -d`
- **THEN** all microservices and micro-frontends start successfully

### Requirement: Nginx acts as API Gateway
The system SHALL configure Nginx as the single entry point to backend services with appropriate routing rules.

#### Scenario: Nginx routes to auth-service
- **WHEN** client requests /api/auth/**
- **THEN** Nginx routes request to auth-service container

#### Scenario: Nginx routes to micro-frontends
- **WHEN** client requests /auth-profile/**
- **THEN** Nginx routes request to auth-profile-mf container
