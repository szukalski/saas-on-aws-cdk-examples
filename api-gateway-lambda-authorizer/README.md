# API Gateway Lambda Authorizer

A multi-tenant SaaS API service built with AWS CDK that demonstrates secure API access using JWT-based Lambda authorizers. This project showcases a production-ready pattern for implementing tenant isolation in serverless APIs.

## Architecture

```bash
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

## Key Components

- **API Gateway**: REST API endpoint that receives client requests
- **Lambda Authorizer**: Validates JWT tokens and extracts tenant context
- **Lambda Service**: Processes business logic with tenant awareness
- **Smithy**: Generates type-safe API contracts and server code

## Features

- **Multi-tenant Architecture**: Secure tenant isolation using JWT claims
- **JWT-based Authentication**: Token validation with tenant and role extraction
- **Type-safe API Development**: Generated from Smithy models
- **Infrastructure as Code**: AWS CDK deployment
- **Comprehensive Logging**: CloudWatch integration for monitoring
- **Tenant Context Propagation**: Authorizer extracts and passes tenant context to service

## JWT Claims

The Lambda authorizer extracts and validates these custom claims:

- `custom:tenant_id` - Unique identifier for the tenant
- `custom:role` - User role within the tenant context

These claims are passed to the service Lambda as context, enabling tenant-aware business logic.

## Data Flow

1. Client sends request with JWT token in Authorization header
2. API Gateway forwards token to Lambda Authorizer
3. Authorizer decodes JWT and extracts tenant context
4. Authorizer generates IAM policy allowing/denying access
5. API Gateway forwards request with tenant context to service Lambda
6. Service Lambda processes request in tenant context
7. Response is returned to client

## Getting Started

### Prerequisites

- Node.js 18+
- AWS CLI configured
- AWS CDK CLI installed

### Installation

```bash
# Install dependencies
npx yarn install

# Initialize the project
npx projen
```

### Deployment

```bash
# Deploy to AWS
npx projen deploy

# Or use CDK directly
cdk deploy
```

## API Usage

### Hello Endpoint

**Request:**

```bash
curl -X POST \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  <api-url>/hello
```

**Response:**

```json
{
  "message": "Hello, <role> for <tenant_id>!"
}
```

### Testing with Sample JWT

The project includes a sample JWT token in `_interface.sh` for testing:

```bash
# Run the hello function from the interface script
source _interface.sh
hello
```

## Implementation Details

### Smithy API Definition

The API is defined in `model/tickles.smithy` using the Smithy IDL:

```smithy
@authorizer("authy")
@http(method: "POST", uri: "/hello")
operation Hello {
    input := {}
    output := {
        message: String
    }
}
```

### Lambda Authorizer

The authorizer in `src/tickles/tickles.authorizer.ts` handles:

- JWT token extraction and decoding
- Tenant context extraction
- IAM policy generation
- Context propagation to service Lambda

### Service Implementation

The service in `src/tickles/tickles.ts` implements:

- Tenant-aware business logic
- Type-safe request/response handling
- Context-based personalization

## Security Considerations

⚠️ **Important**: For production use, implement these enhancements:

1. **JWT Signature Verification**: Currently only decodes JWT without verification
2. **Token Validation**: Add proper token validation and expiration checks
3. **Error Handling**: Implement comprehensive error handling and logging
4. **Rate Limiting**: Add API throttling and rate limiting
5. **CORS**: Configure appropriate CORS policies

## Monitoring and Observability

All Lambda functions log to CloudWatch under the log group `/saas/Tickles`. Monitor:

- Authorization failures
- Service errors
- Performance metrics
- Tenant access patterns

## Related Projects

This project works in conjunction with the [Cognito Identity Silo](../cognito-identity-silo) project, which provides the JWT token generation and user management capabilities.

## Development Workflow

1. Modify the Smithy model in `model/tickles.smithy`
2. Regenerate code with `npx smithy build`
3. Update service implementation in `src/tickles/`
4. Run tests with `npm test`
5. Deploy changes with `npm run deploy`

## License

Apache-2.0
