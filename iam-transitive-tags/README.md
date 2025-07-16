# IAM Transitive Tags

* An example of [chain roling with transitive tags](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_session-tags.html#id_session-tags_role-chaining).

´´´bash
export MY_ROLE_ARN=$(aws sts get-caller-identity --query "Arn" --output text)
cdk deploy --require-approval=never --context MY_ROLE_ARN=$MY_ROLE_ARN
´´´
