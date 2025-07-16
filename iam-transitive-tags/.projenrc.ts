import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.203.0',
  defaultReleaseBranch: 'main',
  name: 'iam-transitive-tags',
  projenrcTs: true,
  deps: [
    '@aws-sdk/client-s3'
  ]

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.tasks.tryFind('deploy')?.reset('cdk deploy --require-approval never ');
project.tasks.tryFind('destroy')?.reset('cdk destroy --force ');
project.synth();
