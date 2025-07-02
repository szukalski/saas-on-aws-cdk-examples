import { APIGatewayAuthorizerResult, APIGatewayAuthorizerResultContext, APIGatewayTokenAuthorizerEvent, APIGatewayTokenAuthorizerHandler, PolicyDocument } from 'aws-lambda';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { IdentityServiceContext } from './identity';
import { InternalServerError } from '../smithy/Identity/typescript-ssdk-codegen/src';

// Type the claims we need to see
export interface MultiTenantCognitoJwtPayload extends JwtPayload {
  'custom:tenantId': string;
  'custom:role': string;
}

interface IdentityAPIGatewayAuthorizerResultContext extends APIGatewayAuthorizerResultContext, IdentityServiceContext { }

const defaultDenyAllPolicy: APIGatewayAuthorizerResult = {
  principalId: 'user',
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: '*',
        Effect: 'Deny',
        Resource: '*',
      },
    ],
  },
};

export const handler: APIGatewayTokenAuthorizerHandler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  try {
    console.log(event);
    const userPoolClientId = process.env.USER_POOL_CLIENT_ID ?? '';
    if (!userPoolClientId) {
      throw new InternalServerError({
        message: 'USER_POOL_CLIENT_ID environment variable is required',
      });
    }

    const userPoolId = process.env.USER_POOL_ID ?? '';
    if (!userPoolId) {
      throw new InternalServerError({
        message: 'USER_POOL_ID environment variable is required',
      });
    }
    // Extract token from "Bearer <token>" format
    const token = event.authorizationToken.replace('Bearer ', '');
    if (!token) {
      return defaultDenyAllPolicy;
    }

    // Decode JWT without verification (for demo purposes)
    // In production, you should verify the JWT signature
    // We expect the custom claims in the decoded JWT payload
    const decoded = jwtDecode<MultiTenantCognitoJwtPayload>(token);
    if (!decoded || !decoded['custom:tenantId'] || !decoded['custom:role']) {
      throw new InternalServerError({ message: 'Invalid token or missing tenant information' });
    }

    const policyDocument: PolicyDocument = {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: event.methodArn,
      }],
    };
    const context: IdentityAPIGatewayAuthorizerResultContext = {
      tenantId: decoded['custom:tenantId'],
      role: decoded['custom:role'],
      userPoolClientId: userPoolClientId,
      userPoolId: userPoolId,
    };
    const response: APIGatewayAuthorizerResult = {
      principalId: decoded.sub ?? 'user',
      context: context,
      policyDocument,
    };
    return response;
  } catch (error) {
    throw new InternalServerError({
      message: error as string,
    });
  }
};