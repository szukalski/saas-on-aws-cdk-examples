import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { ManagedPolicy, Role, ServicePrincipal, PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { MultiTenantUserPool, ServiceServer, SoaLogGroup } from 'saas-on-aws-cdk';

export class IdentityStack extends Stack {
  public readonly userPool: MultiTenantUserPool;
  public readonly userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const serviceName = 'Identity';

    const logGroup = new SoaLogGroup(this, 'LogGroup', {
      logGroupName: '/saas/'+serviceName,
    });

    // Create Cognito user pool
    this.userPool = new MultiTenantUserPool(this, 'UserPool', {
      signInAliases: {
        username: false,
        email: true,
        phone: false,
      },
    });
    this.userPoolClient = this.userPool.addMultiTenantClient();

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
        'cognito-idp:GetUser',
        'cognito-idp:AdminCreateUser',
        'cognito-idp:AdminSetUserPassword',
        'cognito-idp:AdminGetUser',
        'cognito-idp:AdminUpdateUserAttributes',
      ],
      resources: [this.userPool.userPoolArn],
    }));

    const serviceFunction = new NodejsFunction(this, 'ServiceFunction', {
      runtime: Runtime.NODEJS_20_X,
      logGroup: logGroup,
      entry: __dirname + '/identity.function.ts',
      bundling: {
        nodeModules: ['re2-wasm'],
      },
      environment: {
        USER_POOL_CLIENT_ID: this.userPoolClient.userPoolClientId,
        USER_POOL_ID: this.userPool.userPoolId,
      },
      role: serviceFunctionRole,
    });
    const openApiPath = `./src/smithy/${serviceName}/openapi/${serviceName}.openapi.json`;

    new ServiceServer(this, 'Identity', {
      logGroup: logGroup,
      openApiPath: openApiPath,
      serviceFunction: serviceFunction,
      serviceName: serviceName,
    });

    // Output the User Pool ID and Client ID
    new CfnOutput(this, 'UserPoolId', {
      value: this.userPool.userPoolId,
      description: 'Cognito User Pool ID',
    });

    new CfnOutput(this, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
    });
  }
}