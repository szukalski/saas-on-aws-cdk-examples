import {
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { HelloInput, HelloOutput } from '../smithy/Identity/typescript-ssdk-codegen/src';
import {
  IdentityService,
} from '../smithy/Identity/typescript-ssdk-codegen/src/server';

export interface IdentityServiceContext {
  userPoolClientId: string;
  userPoolId: string;
}

export class IdentityServiceImpl implements IdentityService<IdentityServiceContext> {
  private cognitoClient: CognitoIdentityProviderClient;

  constructor() {
    this.cognitoClient = new CognitoIdentityProviderClient({});
  }

  Hello = async (
    input: HelloInput,
    context: IdentityServiceContext,
  ): Promise<HelloOutput> => {
    return {
      message: 'Hello, Universe!',
    };
  };

}
