import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
} from '@aws-sdk/client-cognito-identity-provider';
import { AuthenticationService, AuthInput, AuthOutput } from '../smithy/Authentication/typescript-ssdk-codegen/src';
import { UnauthorizedError } from '../smithy/Identity/typescript-ssdk-codegen/src';

export interface AuthenticationServiceContext {
  userPoolClientId: string;
  userPoolId: string;
}

export class AuthenticationServiceImpl implements AuthenticationService<AuthenticationServiceContext> {
  private cognitoClient: CognitoIdentityProviderClient;

  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({});
  }

  Auth = async (
    input: AuthInput,
    context: AuthenticationServiceContext,
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
