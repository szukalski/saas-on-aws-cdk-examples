#!/bin/bash

set_my_role
STACK_NAME='iam-transitive-tags'
MY_ROLE=$(aws sts get-caller-identity --query "Arn" --output text)
ASSUMED_ROLE=$(get_cfn_output 'AssumedRoleArn')
CHAINED_ROLE=$(get_cfn_output 'ChainedRoleArn')
BUCKET_NAME=$(get_cfn_output 'BucketName')
TENANT_ID='tenant021'
ASSUMED_ROLE_CREDENTIALS=""
CHAINED_ROLE_CREDENTIALS=""
MY_ROLE_CREDENTIALS=""

get_cfn_output() {
    if [[ -z "$1" ]]; then
        echo "Usage: get_cfn_output <OutputKey>"
        return 1
    fi
    local output=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region eu-central-1 \
        --query 'Stacks[0].Outputs[?OutputKey==`'$1'`].OutputValue' \
        --output text 2>/dev/null)
    echo "${output%/}"
}

assume_role() {
    local role_arn=$1
    local session_name=$2
    local additional_config=$3

    aws sts assume-role \
        --role-arn "${role_arn}" \
        --role-session-name "${session_name}" \
        ${additional_config}

}

set_credentials(){
    export AWS_ACCESS_KEY_ID=$(echo $1|jq -r '.Credentials.AccessKeyId')
    export AWS_SECRET_ACCESS_KEY=$(echo $1|jq -r '.Credentials.SecretAccessKey')
    export AWS_SESSION_TOKEN=$(echo $1|jq -r '.Credentials.SessionToken')
}

get_caller_identity(){
    local user_id=$(aws sts get-caller-identity|jq -r '.UserId'|cut -d: -f2)
    echo "Current Identity: "$user_id
}

set_assume_role() {
    echo "Assuming role: ${ASSUMED_ROLE}"
    ASSUMED_ROLE_CREDENTIALS=$(assume_role "${ASSUMED_ROLE}" "AssumedRole")
    set_credentials "${ASSUMED_ROLE_CREDENTIALS}"
    get_caller_identity
}

set_assume_role_with_transitive_tags() {
    echo "Assuming role: ${ASSUMED_ROLE}"
    ASSUMED_ROLE_CREDENTIALS=$(aws sts assume-role \
        --role-arn "${ASSUMED_ROLE}" \
        --role-session-name "AssumedRoleWithTransitiveTags" \
        --tags Key=tenant_id,Value=$TENANT_ID \
        --transitive-tag-keys tenant_id)
    set_credentials "${ASSUMED_ROLE_CREDENTIALS}"
    get_caller_identity
}

set_chained_role() {
    echo "Assuming role: ${CHAINED_ROLE}"
    CHAINED_ROLE_CREDENTIALS=$(aws sts assume-role \
        --role-arn "${CHAINED_ROLE}" \
        --role-session-name "ChainedRole")
    set_credentials "${CHAINED_ROLE_CREDENTIALS}"
    get_caller_identity
}

set_my_role() {
    export AWS_ACCESS_KEY_ID=''
    export AWS_SECRET_ACCESS_KEY=''
    export AWS_SESSION_TOKEN=''
    get_caller_identity
}

upload_file() {
    aws s3 cp test.txt s3://${BUCKET_NAME}/$TENANT_ID/test.txt
}

download_file() {
    aws s3 cp s3://${BUCKET_NAME}/$TENANT_ID/test.txt test2.txt
    cat test2.txt && echo ""
    rm test2.txt
}

test_transitive_tags() {
    echo "Testing without transitive tags. This should fail"
    set_my_role
    echo "Assuming Assumed Role without transitive tags"
    set_assume_role
    echo "Assuming Chained Role"
    set_chained_role
    echo "Uploading file to S3. This should fail because no tenant_id tag is present on the chained role credentials."
    upload_file
    echo ""

    echo "Testing with transitive tags. This should succeed"
    set_my_role
    echo "Assuming Assumed Role with transitive tags"
    set_assume_role_with_transitive_tags
    echo "Assuming Chained Role"
    set_chained_role
    echo "Uploading file to S3. This should succeed because tenant_id tag is present on the chained role credentials."
    upload_file
    echo "Downloading file from S3. This should succeed because tenant_id tag is present on the chained role credentials."
    download_file
}
