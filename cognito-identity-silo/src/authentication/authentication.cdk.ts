import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { IUserPool, IUserPoolClient, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { ManagedPolicy, Role, ServicePrincipal, PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { MultiTenantUserPool, ServiceServer, SoaLogGroup } from 'saas-on-aws-cdk';

export interface AuthenticationStackProps extends StackProps {
  userPool: IUserPool;
  userPoolClient: IUserPoolClient;
}

export class AuthenticationStack extends Stack {

  constructor(scope: Construct, id: string, props: AuthenticationStackProps) {
    super(scope, id, props);

    const serviceName = 'Authentication';

    const logGroup = new SoaLogGroup(this, 'LogGroup', {
      logGroupName: '/saas/'+serviceName,
    });

    const serviceFunctionRole = new Role(this, 'ServiceFunctionRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    // Grant permissions to interact with Cognito
    serviceFunctionRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'cognito-idp:InitiateAuth',
      ],
      resources: [props.userPool.userPoolArn],
    }));

    const serviceFunction = new NodejsFunction(this, 'ServiceFunction', {
      runtime: Runtime.NODEJS_20_X,
      logGroup: logGroup,
      entry: __dirname + '/authentication.function.ts',
      bundling: {
        nodeModules: ['re2-wasm'],
      },
      environment: {
        USER_POOL_CLIENT_ID: props.userPoolClient.userPoolClientId,
        USER_POOL_ID: props.userPool.userPoolId,
      },
      role: serviceFunctionRole,
    });
    const openApiPath = `./src/smithy/${serviceName}/openapi/${serviceName}.openapi.json`;

    new ServiceServer(this, 'Server', {
      logGroup: logGroup,
      openApiPath: openApiPath,
      serviceFunction: serviceFunction,
      serviceName: serviceName,
    });
  }
}