import { APIGatewayAuthorizerResult, APIGatewayAuthorizerResultContext, APIGatewayTokenAuthorizerEvent, APIGatewayTokenAuthorizerHandler, PolicyDocument } from 'aws-lambda';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { InternalServerError } from '../smithy/Tickles/typescript-ssdk-codegen/src';
import { TicklesServiceContext } from './tickles';

// Type the claims we need to see
export interface MultiTenantCognitoJwtPayload extends JwtPayload {
  'custom:tenant_id': string;
  'custom:role': string;
}

interface TicklesAPIGatewayAuthorizerResultContext extends APIGatewayAuthorizerResultContext, TicklesServiceContext {}

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
    // Extract token from "Bearer <token>" format
    const token = event.authorizationToken.replace('Bearer ', '');
    if (!token) {
      return defaultDenyAllPolicy;
    }

    // Decode JWT without verification (for demo purposes)
    // In production, you should verify the JWT signature
    // We expect the custom claims in the decoded JWT payload
    const decoded = jwtDecode<MultiTenantCognitoJwtPayload>(token);
    if (!decoded || !decoded['custom:tenant_id'] || !decoded['custom:role']) {
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
    const context: TicklesAPIGatewayAuthorizerResultContext = {
      tenant_id: decoded['custom:tenant_id'],
      role: decoded['custom:role']
    }
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