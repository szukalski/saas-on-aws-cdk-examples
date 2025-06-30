import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { TicklesStack } from './tickles/tickles.cdk';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new TicklesStack(app, 'Tickles', {
  env: devEnv,
});

app.synth();