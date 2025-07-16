import { App, CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { ArnPrincipal, Effect, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

interface MyStackProps extends StackProps {
  myRole: string
}

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: MyStackProps) {
    super(scope, id, props);

    const { myRole } = props

    const assumedRole = new Role(this, 'AssumedRole', {
      roleName: 'AssumedRole',
      assumedBy: new ArnPrincipal(myRole),
    });

    assumedRole.assumeRolePolicy?.addStatements(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          'sts:TagSession',
        ],
        conditions: {
          StringLike: {
            'aws:RequestTag/tenant_id': '*',
          },
        },
        principals: [
          new ArnPrincipal(myRole),
        ],
      }),
    );

    const chainedRole = new Role(this, 'ChainedRole', {
      roleName: 'ChainedRole',
      assumedBy: assumedRole,
    });

    chainedRole.assumeRolePolicy?.addStatements(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          'sts:TagSession',
        ],
        conditions: {
          StringLike: {
            'aws:RequestTag/tenant_id': '*',
          },
        },
        principals: [
          assumedRole,
        ],
      }),
    );

    const bucket = new Bucket(this, 'bobbyBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    chainedRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          's3:*',
        ],
        resources: [
          bucket.bucketArn+'/${aws:PrincipalTag/tenant_id}/*',
        ],
      }),
    );

    new CfnOutput(this, 'AssumedRoleArn', { value: assumedRole.roleArn });
    new CfnOutput(this, 'ChainedRoleArn', { value: chainedRole.roleArn });
    new CfnOutput(this, 'BucketName', { value: bucket.bucketName });
  }
}

const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const myRole = process.env.MY_ROLE_ARN
if (!myRole) {
  throw new Error("MY_ROLE_ARN environment variable is required")
}

const app = new App();

new MyStack(app, 'iam-transitive-tags', { myRole: myRole, env: devEnv });

app.synth();