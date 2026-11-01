# Spec Delta

## Purpose

Provides user authentication, session management, and role-based access control for the VLR Finance platform.

## ADDED Requirements

### Requirement: User registration with email and password
The system SHALL allow users to register with email and password.

#### Scenario: Successful registration
- **WHEN** user submits registration with valid email and password
- **THEN** system creates user account with USER role and returns user data

#### Scenario: Registration with duplicate email
- **WHEN** user submits registration with already registered email
- **THEN** system returns 409 Conflict error

### Requirement: User login with email and password
The system SHALL authenticate users with email and password and issue JWT tokens.

#### Scenario: Successful login
- **WHEN** user submits valid credentials
- **THEN** system returns access token (5 min expiry) and refresh token (7 days expiry)

#### Scenario: Login with invalid credentials
- **WHEN** user submits invalid credentials
- **THEN** system returns 401 Unauthorized error

### Requirement: Logout current session
The system SHALL allow users to logout their current session by invalidating the refresh token.

#### Scenario: Successful logout
- **WHEN** user requests logout with valid refresh token
- **THEN** system invalidates refresh token and returns success

#### Scenario: Logout with invalid token
- **WHEN** user requests logout with invalid refresh token
- **THEN** system returns 401 Unauthorized error

### Requirement: Logout all sessions
The system SHALL allow users to logout from all devices by invalidating all refresh tokens.

#### Scenario: Successful logout-all
- **WHEN** user requests logout-all with valid refresh token
- **THEN** system invalidates all refresh tokens for that user and returns success

### Requirement: Session management with device tracking
The system SHALL track user sessions with device information and IP address.

#### Scenario: Active sessions list
- **WHEN** user requests list of active sessions
- **THEN** system returns list of sessions with device info, IP, and creation time

### Requirement: JWT token rotation
The system SHALL implement refresh token rotation on each token refresh.

#### Scenario: Token rotation on refresh
- **WHEN** user refreshes token with valid refresh token
- **THEN** system issues new refresh token and invalidates old one

### Requirement: Breach detection
The system SHALL detect refresh token reuse and invalidate all user sessions.

#### Scenario: Breach detection triggered
- **WHEN** refresh token is reused after rotation
- **THEN** system invalidates all user sessions and returns 401 Unauthorized

### Requirement: Rate limiting
The system SHALL implement rate limiting on authentication endpoints to prevent brute-force attacks.

#### Scenario: Rate limit exceeded
- **WHEN** user exceeds rate limit on login endpoint
- **THEN** system returns 429 Too Many Requests error

### Requirement: Role-based access control (RBAC)
The system SHALL implement RBAC with USER, PREMIUM, and ADMIN roles.

#### Scenario: User role assignment
- **WHEN** new user registers
- **THEN** system assigns USER role by default

#### Scenario: Role check
- **WHEN** endpoint requires specific role
- **THEN** system verifies user has required role before granting access

### Requirement: Password hashing with Argon2id
The system SHALL hash passwords using Argon2id algorithm before storage.

#### Scenario: Password hashing on registration
- **WHEN** user registers with password
- **THEN** system hashes password with Argon2id before storing

### Requirement: OpenAPI documentation
The system SHALL decorate all endpoints with OpenAPI decorators for API documentation.

#### Scenario: API documentation accessible
- **WHEN** Swagger UI is accessed
- **THEN** all auth endpoints are documented with request/response schemas
