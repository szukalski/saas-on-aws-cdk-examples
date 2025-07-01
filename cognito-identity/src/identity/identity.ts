import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
} from '@aws-sdk/client-cognito-identity-provider';
import { JwtPayload } from 'jwt-decode';
import { SmithyContext } from 'saas-on-aws-cdk';
import {
  AuthInput,
  AuthOutput,
  UnauthorizedError,
} from '../smithy/Identity/typescript-ssdk-codegen/src/models/models_0';
import {
  IdentityService,
} from '../smithy/Identity/typescript-ssdk-codegen/src/server';

export interface IdentityServiceContext extends SmithyContext {
  userPoolClientId: string;
  userPoolId: string;
}

export class IdentityServiceImpl implements IdentityService<IdentityServiceContext> {
  private cognitoClient: CognitoIdentityProviderClient;

  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({});
  }

  Auth = async (
    input: AuthInput,
    context: IdentityServiceContext,
  ): Promise<AuthOutput> => {
    try {
      const authResult = await this.cognitoClient.send(new InitiateAuthCommand({
        ClientId: context.userPoolClientId,
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: input.username!,
          PASSWORD: input.password!,
        },
      }));

      if (!authResult.AuthenticationResult?.IdToken) {
        throw new UnauthorizedError({
          message: 'Authentication failed',
        });
      }

      return {
        idToken: authResult.AuthenticationResult.IdToken,
        refreshToken: authResult.AuthenticationResult.RefreshToken,
        accessToken: authResult.AuthenticationResult.AccessToken,
        expiresIn: authResult.AuthenticationResult.ExpiresIn,
      };
    } catch (error) {
      console.error('Error during logon:', error);
      throw new UnauthorizedError({
        message: 'Invalid credentials',
      });
    }
  };
}
