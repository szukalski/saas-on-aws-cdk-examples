#!/bin/bash

export JWT_TOKEN='eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImM5MjZlYmQ1NjNlMDg1MmU2NjI0NmVmNzBkZWViYmQ5In0.eyJzdWIiOiJjMzA0MTgxMi0wMDgxLTcwMTYtZmM3Yi1mOTdjY2RmOTUxZTgiLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tL2V1LWNlbnRyYWwtMV8wODAwODM4MzgzIiwiY29nbml0bzp1c2VybmFtZSI6ImRhdmUiLCJvcmlnaW5fanRpIjoiYTQ0YjRmODAtYzU2My00NTljLTkxY2YtMGY5NDkxZWZmMDM3IiwiY3VzdG9tOnRlbmFudElkIjoidGVuYW50MDIxIiwiYXVkIjoiNmZvZnQxdnI0NzdmNWc0aHJuOTZpZGwwbWYiLCJldmVudF9pZCI6IjU0NmYyOWU2LTI2YjItNDY5OC1iYjBiLTE1OGJiODY2NmNmMCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzUxMDI1ODkzLCJjdXN0b206cm9sZSI6IkFETUlOIiwiZXhwIjoxNzUxMDI5NDkzLCJpYXQiOjE3NTEwMjU4OTMsImp0aSI6IjY4YWU0ODczLTFmZmYtNDY0Yi1hZWUzLWFlZGVmYWIyMTQyNCJ9.kHzlvLeh0jx46e9Tjm2Zi-2pRNCbzzaIvwM6gpa1SFyEmLWQ-UE0rYWyhcKj6oyDbMlPMaeq9oZdGnWseXVGtA'

get_tickles_api_url() {
    local url=$(aws cloudformation describe-stacks \
        --stack-name Tickles \
        --region eu-central-1 \
        --query 'Stacks[0].Outputs[?OutputKey==`TicklesApiUrl`].OutputValue' \
        --output text 2>/dev/null)
    echo "${url%/}"
}

TICKLES_URL=$(get_tickles_api_url)

hello() {
    curl -X POST \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"key": "value"}' \
        $TICKLES_URL/hello
}
