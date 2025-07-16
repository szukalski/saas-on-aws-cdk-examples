# IAM Transitive Tags

This project demonstrates [role chaining with transitive tags](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_session-tags.html#id_session-tags_role-chaining) in AWS IAM. Session tags are key-value pairs that you can pass when you assume an IAM role, and transitive tags allow these tags to be passed through a chain of role assumptions.

## Architecture

The project creates the following resources:

1. **AssumedRole**: An IAM role that your current role can assume
2. **ChainedRole**: A second IAM role that can only be assumed by the AssumedRole
3. **S3 Bucket**: A bucket with permissions controlled by session tags

The role chain looks like this:

```bash
Your Current Role → AssumedRole → ChainedRole
```

Session tags (specifically `tenant_id`) are passed through this chain and used to control access to S3 bucket paths.

## How It Works

1. Your current role assumes the AssumedRole, passing a `tenant_id` session tag
2. The AssumedRole then assumes the ChainedRole, with the `tenant_id` tag passed transitively
3. The ChainedRole has permissions to access only specific paths in the S3 bucket, based on the `tenant_id` tag value

This demonstrates a powerful pattern for multi-tenant applications where access to resources needs to be scoped to a specific tenant context.

## Deployment

To deploy this stack:

```bash
# Get your current role ARN and export it
export MY_ROLE_ARN=$(aws sts get-caller-identity --query "Arn" --output text)

# Deploy the stack
npx projen deploy
```

## Testing the Role Chain

After deployment, you can test the role chain with the following commands:

```bash
# Get the role ARNs from the stack outputs
ASSUMED_ROLE_ARN=$(aws cloudformation describe-stacks --stack-name iam-transitive-tags --query "Stacks[0].Outputs[?OutputKey=='AssumedRoleArn'].OutputValue" --output text)
CHAINED_ROLE_ARN=$(aws cloudformation describe-stacks --stack-name iam-transitive-tags --query "Stacks[0].Outputs[?OutputKey=='ChainedRoleArn'].OutputValue" --output text)
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name iam-transitive-tags --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text)

# Assume the first role with a tenant_id tag
TEMP_CREDS=$(aws sts assume-role --role-arn $ASSUMED_ROLE_ARN --role-session-name "TestSession" --tags Key=tenant_id,Value=tenant1)

# Extract credentials from the response
export AWS_ACCESS_KEY_ID=$(echo $TEMP_CREDS | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $TEMP_CREDS | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $TEMP_CREDS | jq -r '.Credentials.SessionToken')

# Now assume the chained role (the tenant_id tag will be passed transitively)
CHAINED_CREDS=$(aws sts assume-role --role-arn $CHAINED_ROLE_ARN --role-session-name "ChainedSession")

# Extract the new credentials
export AWS_ACCESS_KEY_ID=$(echo $CHAINED_CREDS | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $CHAINED_CREDS | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $CHAINED_CREDS | jq -r '.Credentials.SessionToken')

# Test access to the tenant-specific path in the S3 bucket
aws s3 cp test.txt s3://$BUCKET_NAME/tenant1/test.txt

# This should fail (different tenant path)
aws s3 cp test.txt s3://$BUCKET_NAME/tenant2/test.txt
```

## Security Considerations

This pattern is useful for:

- Multi-tenant SaaS applications
- Microservices that need to maintain tenant context
- Implementing least privilege access to resources
- Delegating access while maintaining tenant isolation

Remember that:

- Session tags must be explicitly allowed in the trust policy
- The `TransitiveTagKeys` parameter can be used to control which tags are allowed to be passed transitively
- Tag values can be restricted using condition keys

## Implementation Details

The CDK implementation:

1. Creates an AssumedRole that your current role can assume
2. Adds a trust policy to allow the `sts:TagSession` action with any `tenant_id` value
3. Creates a ChainedRole that can only be assumed by the AssumedRole
4. Configures S3 bucket permissions using a condition that references the `tenant_id` session tag

The S3 bucket policy uses a path pattern that includes the session tag:

```bash
s3:*" on "${bucket-arn}/${aws:PrincipalTag/tenant_id}/*"
```

This ensures that users can only access paths that match their tenant_id tag value.

## Limitations

- Session tags have a maximum size limit (check AWS documentation for current limits)
- Role chaining has a maximum depth limit
- Session tag values should be properly validated to prevent security issues

## References

- [AWS IAM Session Tags Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_session-tags.html)
- [Role Chaining with Session Tags](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_session-tags.html#id_session-tags_role-chaining)
- [AWS CDK IAM Module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam-readme.html)
