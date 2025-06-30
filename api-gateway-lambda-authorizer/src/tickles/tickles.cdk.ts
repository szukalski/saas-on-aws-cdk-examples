import { Stack, StackProps } from 'aws-cdk-lib';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { SoaLogGroup } from 'saas-on-aws-cdk';
import { ServiceServer } from './service-server';

export class TicklesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const logGroup = new SoaLogGroup(this, 'LogGroup', {
      logGroupName: 'Tickles'
    });
    const serviceFunction = new NodejsFunction(this, 'ServiceFunction', {
      runtime: Runtime.NODEJS_20_X,
      logGroup: logGroup,
      entry: __dirname + '/tickles.function.ts',
      bundling: {
        nodeModules: ['re2-wasm'],
      },
    });

    const serviceAuthorizerRole = new Role(this, 'AuthorizerRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    const serviceAuthorizer = new NodejsFunction(this, 'Authorizer', {
      runtime: Runtime.NODEJS_20_X,
      entry: __dirname + '/tickles.authorizer.ts',
      logGroup: logGroup,
      role: serviceAuthorizerRole,
      bundling: {
        nodeModules: ['re2-wasm'],
      },
    });

    const serviceName = 'Tickles';
    const openApiPath = `./src/smithy/${serviceName}/openapi/${serviceName}.openapi.json`;

    new ServiceServer(this, 'Tickles', {
      logGroup: logGroup,
      openApiPath: openApiPath,
      serviceAuthorizer: serviceAuthorizer,
      serviceFunction: serviceFunction,
      serviceName: 'Tickles',
    });
  }
}