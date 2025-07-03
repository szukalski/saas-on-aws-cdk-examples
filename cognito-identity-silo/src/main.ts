import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthenticationStack } from './authentication/authentication.cdk';
import { IdentityStack } from './identity/identity.cdk';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // define resources here...
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

const identity = new IdentityStack(app, 'Identity', { env: devEnv });
new AuthenticationStack(app, 'Authentication', {
  userPool: identity.userPool,
  userPoolClient: identity.userPoolClient,
  env: devEnv,
});

app.synth();