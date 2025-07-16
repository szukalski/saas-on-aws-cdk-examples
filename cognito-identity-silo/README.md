# Cognito Identity Silo

A multi-tenant identity provider solution using Amazon Cognito with a silo model approach.

## Architecture

This project implements a tenant isolation pattern where:
- One user pool serves all tenants
- Tenant isolation is enforced through custom attributes
- Each user is associated with a specific tenant via `custom:tenant_id` attribute
- Role-based access control is implemented via `custom:role` attribute

```
┌─────────────┐     ┌───────────────┐     ┌───────────────┐
│  API Client │────▶│ Authentication │────▶│ User Management│
└─────────────┘     │    Service     │     │    Service     │
                    └───────────────┘     └───────────────┘
                           │                      │
                           ▼                      ▼
                    ┌───────────────────────────────────────┐
                    │           Amazon Cognito              │
                    │  (Single User Pool, Multi-Tenant)     │
                    └───────────────────────────────────────┘
```

## Features

- **Multi-tenant User Management**: Create, read, update, delete users within tenant context
- **Tenant Isolation**: Users can only access resources within their tenant
- **Role-Based Access Control**: Support for different user roles within each tenant
- **JWT Authentication**: Token-based authentication with tenant and role claims
- **Type-safe API**: Generated from Smithy models
- **AWS CDK Infrastructure**: Infrastructure as Code deployment

## User Management Operations

The service provides the following operations:

- **CreateUser**: Create a new user within a tenant
- **ReadUser**: Retrieve user details (enforcing tenant isolation)
- **UpdateUser**: Update user attributes like role
- **DeleteUser**: Remove a user
- **ListUser**: List users within a tenant with optional filtering

## JWT Claims

The service uses the following custom claims in JWT tokens:

- `custom:tenant_id` - Unique identifier for the tenant
- `custom:role` - User role within the tenant context

## Getting Started

### Prerequisites

- Node.js 18+
- AWS CLI configured
- AWS CDK CLI installed

### Installation

```bash
# Install dependencies
npx yarn install

# Init the project
npx projen
```

### Deployment

```bash
# Deploy to AWS
npx projen deploy

# Or use CDK directly
cdk deploy
```

### Usage Examples

The `_interface.sh` script provides helper functions for interacting with the service:

```bash
# Create a new user
create_user "username" "Password123!" "tenant-id" "USER"

# Authenticate a user
auth "username" "Password123!"
```

## Security Considerations

- Tenant isolation is enforced at the application level
- All user operations validate tenant context
- API access is protected through JWT token validation
- Password policies are enforced by Cognito

## Related Projects

This project works in conjunction with the [API Gateway Lambda Authorizer](../api-gateway-lambda-authorizer) project to provide a complete multi-tenant API authentication solution.

## License

Apache-2.0
