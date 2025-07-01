# Architecture Documentation

## Overview

This project implements a multi-tenant SaaS API using AWS serverless services with JWT-based authentication and authorization. The architecture follows a microservices pattern with clear separation of concerns.

## High-Level Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│ API Gateway │───▶│   Lambda    │───▶│   Lambda    │
│ Application │    │             │    │ Authorizer  │    │   Service   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                           │                   │                   │
                           ▼                   ▼                   ▼
                   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
                   │ CloudWatch  │    │ CloudWatch  │    │ CloudWatch  │
                   │    Logs     │    │    Logs     │    │    Logs     │
                   └─────────────┘    └─────────────┘    └─────────────┘
```

## Components

### 1. API Gateway

- **Type**: REST API
- **Purpose**: Entry point for all client requests
- **Features**:
  - Request routing
  - Request/response transformation
  - Integration with Lambda authorizer
  - CORS handling (configurable)
  - Throttling and rate limiting

### 2. Lambda Authorizer

- **Runtime**: Node.js 20.x
- **Purpose**: JWT token validation and context extraction
- **Responsibilities**:
  - Extract JWT from Authorization header
  - Decode JWT payload (without signature verification in demo)
  - Extract tenant context (`custom:tenantId`, `custom:role`)
  - Generate IAM policy for API Gateway
  - Pass context to downstream Lambda

**Flow**:
1. Receive authorization token from API Gateway
2. Parse "Bearer <token>" format
3. Decode JWT payload
4. Validate required custom claims
5. Return policy document with tenant context

### 3. Lambda Service Handler

- **Runtime**: Node.js 20.x
- **Purpose**: Business logic execution
- **Features**:
  - Smithy-generated type-safe handlers
  - Tenant context awareness
  - Request/response processing
  - Error handling

### 4. Smithy Code Generation

- **Purpose**: Type-safe API contract enforcement
- **Generated Artifacts**:
  - TypeScript interfaces
  - Request/response models
  - Service handlers
  - OpenAPI specification

## Data Flow

### Authentication Flow

```
1. Client sends request with JWT token
   ├─ Header: Authorization: Bearer <jwt-token>
   └─ Body: Request payload

2. API Gateway invokes Lambda Authorizer
   ├─ Passes: methodArn, authorizationToken
   └─ Expects: Policy document + context

3. Lambda Authorizer processes token
   ├─ Decodes JWT
   ├─ Extracts tenant claims
   └─ Returns: Allow/Deny policy + tenant context

4. API Gateway forwards to service Lambda
   ├─ Includes: Original request + authorizer context
   └─ Context: { tenantId, role }

5. Service Lambda processes request
   ├─ Uses tenant context for business logic
   └─ Returns: Response payload
```

### Request Processing Flow

```
POST /hello
├─ Authorization: Bearer eyJ...
├─ Content-Type: application/json
└─ Body: {}

↓ API Gateway

├─ Invoke Authorizer
│  ├─ Input: { authorizationToken, methodArn }
│  └─ Output: { principalId, policyDocument, context }

↓ Authorization Success

├─ Invoke Service Function
│  ├─ Input: { body, headers, requestContext }
│  └─ Context: { tenantId: "tenant-123", role: "admin" }

↓ Service Processing

├─ Generate Response
│  └─ Output: { message: "Hello, admin for tenant-123!" }

↓ API Gateway Response

└─ HTTP 200 OK
   ├─ Content-Type: application/json
   └─ Body: { "message": "Hello, admin for tenant-123!" }
```

## Security Model

### Multi-Tenancy

- **Tenant Isolation**: Each request carries tenant context
- **Data Segregation**: Business logic uses tenant ID for data access
- **Authorization**: Role-based access within tenant scope

### JWT Token Structure

```json
{
  "sub": "user-uuid",
  "iss": "cognito-issuer",
  "aud": "client-id",
  "exp": 1234567890,
  "iat": 1234567890,
  "custom:tenantId": "tenant-123",
  "custom:role": "admin"
}
```

### IAM Policies

The authorizer generates dynamic IAM policies:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Action": "execute-api:Invoke",
    "Effect": "Allow",
    "Resource": "arn:aws:execute-api:region:account:api-id/stage/method/resource"
  }]
}
```

## Error Handling

### Authorizer Errors

- **Invalid Token**: Returns deny-all policy
- **Missing Claims**: Throws InternalServerError
- **Decode Failure**: Returns deny-all policy

### Service Errors

- **Validation Errors**: Returns 400 Bad Request
- **Internal Errors**: Returns 500 Internal Server Error
- **Authorization Errors**: Returns 403 Forbidden

## Monitoring and Observability

### CloudWatch Logs

All components log to `/saas/Tickles` log group:

- **Authorizer Logs**: Token validation, policy generation
- **Service Logs**: Request processing, business logic
- **Error Logs**: Exceptions, validation failures

### Metrics

Key metrics to monitor:

- **Authorization Success Rate**: Successful vs failed authorizations
- **Response Times**: End-to-end latency
- **Error Rates**: 4xx and 5xx responses
- **Tenant Activity**: Requests per tenant

## Scalability Considerations

### Lambda Scaling

- **Concurrent Executions**: Auto-scales based on demand
- **Cold Starts**: Minimized with provisioned concurrency (if needed)
- **Memory Allocation**: Optimized for performance vs cost

### API Gateway Limits

- **Request Rate**: 10,000 requests per second (default)
- **Burst Capacity**: 5,000 requests
- **Payload Size**: 10MB maximum

## Deployment Architecture

### CDK Stack Components

```typescript
TicklesStack
├─ ServiceFunction (Lambda)
├─ Authorizer (Lambda)
├─ AuthorizerRole (IAM Role)
├─ LogGroup (CloudWatch)
└─ ServiceServer (Custom Construct)
   ├─ RestApi (API Gateway)
   ├─ Authorizer (API Gateway)
   └─ Method Integration
```

### Environment Configuration

- **Development**: Uses CDK CLI account/region
- **Production**: Configurable via environment variables
- **Cross-Region**: Supports multi-region deployment

## Future Enhancements

### Security Improvements

1. **JWT Signature Verification**: Implement proper token validation
2. **Token Caching**: Cache valid tokens to reduce latency
3. **Rate Limiting**: Per-tenant rate limiting
4. **CORS Configuration**: Proper CORS policy setup

### Operational Improvements

1. **Health Checks**: Service health monitoring
2. **Distributed Tracing**: X-Ray integration
3. **Metrics Dashboard**: CloudWatch dashboard
4. **Alerting**: CloudWatch alarms for errors

### Feature Enhancements

1. **API Versioning**: Support multiple API versions
2. **Request Validation**: Input validation middleware
3. **Response Caching**: API Gateway caching
4. **Documentation**: Auto-generated API docs
