# API Gateway + Lambda Authorizer

A multi-tenant SaaS API service built with AWS CDK that demonstrates secure API access using JWT-based Lambda authorizers. This project uses Smithy to generate type-safe service server code and implements tenant isolation through JWT claims.

## Architecture

```
Client Request → API Gateway → Lambda Authorizer → Lambda Proxy → Service Handler
```

### Components

- **API Gateway**: REST API endpoint that receives client requests
- **Lambda Authorizer**: Validates JWT tokens and extracts tenant context
- **Lambda Proxy**: Main service handler that processes business logic
- **Smithy**: Code generation for type-safe API contracts

## Features

- **Multi-tenant Architecture**: Tenant isolation using JWT claims
- **JWT Authentication**: Token-based authentication with custom claims
- **Type-safe API**: Generated from Smithy models
- **AWS CDK Infrastructure**: Infrastructure as Code deployment
- **Comprehensive Logging**: CloudWatch integration for monitoring

## JWT Claims

The Lambda authorizer expects the following custom claims in the JWT token:

- `custom:tenantId` - Unique identifier for the tenant
- `custom:role` - User role within the tenant context

## Project Structure

```
├── model/
│   └── tickles.smithy          # Smithy service definition
├── src/
│   ├── main.ts                 # CDK app entry point
│   ├── smithy/                 # Generated Smithy code
│   └── tickles/
│       ├── tickles.authorizer.ts   # JWT token validation logic
│       ├── tickles.cdk.ts          # CDK stack definition
│       ├── tickles.function.ts     # Main service handler
│       └── tickles.ts              # Service implementation
├── test/                       # Unit tests
├── smithy-build.json          # Smithy build configuration
└── package.json               # Node.js dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+
- AWS CLI configured
- AWS CDK CLI installed

### Installation

```bash
# Install dependencies
npx yarn install

# Deploy the project
npx projen deploy
```

### Deployment

```bash
# Deploy to AWS
npm run deploy

# Or use CDK directly
cdk deploy
```

### Local Development

```bash
# Watch for changes
npm run watch

# Run tests
npm test

# Lint code
npm run eslint
```

## API Endpoints

### POST /hello

Returns a personalized greeting based on the authenticated user's tenant and role.

**Request Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "message": "Hello, <role> for <tenantId>!"
}
```

## Configuration

### Smithy Configuration

The service is defined in `model/tickles.smithy` with:
- REST JSON protocol
- API Gateway integration
- Custom authorizer configuration
- Error handling structures

### CDK Stack

The infrastructure includes:
- Lambda functions for authorizer and service handler
- API Gateway REST API
- CloudWatch log groups
- IAM roles and policies

## Security Considerations

⚠️ **Important**: This is a demonstration project. For production use:

1. **JWT Verification**: Currently only decodes JWT without signature verification
2. **Token Validation**: Implement proper token validation and expiration checks
3. **Error Handling**: Add comprehensive error handling and logging
4. **Rate Limiting**: Implement API throttling and rate limiting
5. **CORS**: Configure appropriate CORS policies

## Monitoring and Logging

All Lambda functions log to CloudWatch under the log group `/saas/Tickles`. Monitor:
- Authorization failures
- Service errors
- Performance metrics
- Tenant access patterns

## Development Notes

- Built with Projen for project management
- Uses TypeScript for type safety
- Includes ESLint configuration for code quality
- Jest for unit testing
- Supports both development and production environments

## Contributing

1. Make changes to the Smithy model in `model/tickles.smithy`
2. Regenerate code with `npx smithy build`
3. Update service implementation in `src/tickles/`
4. Run tests with `npm test`
5. Deploy changes with `npm run deploy`

## License

Apache-2.0
