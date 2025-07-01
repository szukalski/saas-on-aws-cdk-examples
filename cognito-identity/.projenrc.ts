import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.202.0',
  defaultReleaseBranch: 'main',
  name: 'cognito-identity',
  projenrcTs: true,
  deps: [
    '@aws-sdk/client-cognito-identity-provider',
    '@aws-smithy/server-apigateway',
    '@aws-smithy/server-common',
    '@tsconfig/node18',
    'aws-lambda',
    'jwt-decode',
    're2-wasm',
    'saas-on-aws-cdk',
  ],
  devDeps: [
    '@types/aws-lambda',
  ],

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.eslint?.addIgnorePattern('src/smithy/**/*');
project.tasks.tryFind('deploy')?.reset('cdk deploy --require-approval=never --all');
project.tasks.tryFind('destroy')?.reset('cdk destroy --force --all');
project.synth();