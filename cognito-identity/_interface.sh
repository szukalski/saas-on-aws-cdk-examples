#!/bin/bash

get_authentication_api_url() {
    local url=$(aws cloudformation describe-stacks \
        --stack-name Authentication \
        --region eu-central-1 \
        --query 'Stacks[0].Outputs[?OutputKey==`AuthenticationApiUrl`].OutputValue' \
        --output text 2>/dev/null)
    echo "${url%/}"
}

get_user_pool_id() {
    local user_pool_id=$(aws cloudformation describe-stacks \
        --stack-name Identity \
        --region eu-central-1 \
        --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' \
        --output text 2>/dev/null)
    echo "$user_pool_id"
}

get_user_pool_client_id() {
    local client_id=$(aws cloudformation describe-stacks \
        --stack-name Identity \
        --region eu-central-1 \
        --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' \
        --output text 2>/dev/null)
    echo "$client_id"
}

auth() {
    local username="${1:-dave}"
    local password="${2:-Password123!}"
    local authentication_url=$(get_authentication_api_url)
    
    if [[ -z "$username" || -z "$password" ]]; then
        echo "Usage: auth <username> <password>"
        return 1
    fi
    
    if [[ -z "$authentication_url" ]]; then
        echo "Error: Could not retrieve Authentication API URL from CloudFormation"
        return 1
    fi
    
    echo "Authenticating user: $username"
    
    # Create JSON payload
    local json_payload=$(cat <<EOF
{
    "username": "success+${username}@simulator.amazonses.com",
    "password": "$password"
}
EOF
)
    
    # Make the authentication request
    local response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$json_payload" \
        "$authentication_url/auth")
    
    if [ $? -eq 0 ]; then
        echo "Authentication response:"
        echo "$response" | jq . 2>/dev/null || echo "$response"
    else
        echo "Failed to authenticate user: $username"
        return 1
    fi
}

create_user() {
    local username="${1:-dave}"
    local password="${2:-Password123!}"
    local tenant_id="${3:-tenant021}"
    local role="${4:-USER}"
    local user_pool_id=$(get_user_pool_id)
    
    if [[ -z "$username" || -z "$password" ]]; then
        echo "Usage: create_user <username> <password> [tenant_id] [role]"
        echo "  tenant_id: defaults to 'tenant-001'"
        echo "  role: defaults to 'user'"
        return 1
    fi
    
    if [[ -z "$user_pool_id" ]]; then
        echo "Error: Could not retrieve User Pool ID from CloudFormation"
        return 1
    fi
    
    echo "Creating user: $username with tenant_id: $tenant_id and role: $role"
    
    # Create the user with custom attributes
    aws cognito-idp admin-create-user \
        --user-pool-id "$user_pool_id" \
        --username "success+${username}@simulator.amazonses.com" \
        --user-attributes \
            Name=email,Value="success+${username}@simulator.amazonses.com" \
            Name=custom:tenantId,Value="$tenant_id" \
            Name=custom:role,Value="$role" \
        --temporary-password "$password" \
        --message-action SUPPRESS \
        --region eu-central-1
    
    if [ $? -eq 0 ]; then
        echo "User created successfully. Setting permanent password..."
        
        # Set permanent password
        aws cognito-idp admin-set-user-password \
            --user-pool-id "$user_pool_id" \
            --username "success+${username}@simulator.amazonses.com" \
            --password "$password" \
            --permanent \
            --region eu-central-1
            
        if [ $? -eq 0 ]; then
            echo "Password set successfully for user: $username"
            echo "Custom attributes set:"
            echo "  - tenantId: $tenant_id"
            echo "  - role: $role"
        else
            echo "Failed to set password for user: $username"
            return 1
        fi
    else
        echo "Failed to create user: $username"
        return 1
    fi
}
test_auth() {
    local username=${1:-dave}
    local password="${2:-Password123!}"
    create_user $username $password
    auth $username $password
}