#!/bin/bash

export JWT_TOKEN='kHzlvLeh0jx46e9Tjm2Zi-2pRNCbzzaIvwM6gpa1SFyEmLWQ-eyJraWQiOiJNT3g0aFlGMXA2ZTUrRnEwMEJndzlNZ3BQTGlVZXF2aDFmZDhtdFJPQ0JjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1MzI0Zjg0Mi03MDQxLTcwNDItNWE2OC0wM2M5NWExYWY0NTYiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2V1LWNlbnRyYWwtMV9vRk5wUXRBUnAiLCJjb2duaXRvOnVzZXJuYW1lIjoiNTMyNGY4NDItNzA0MS03MDQyLTVhNjgtMDNjOTVhMWFmNDU2IiwiY3VzdG9tOnRlbmFudF9pZCI6InRlbmFudDAyMSIsIm9yaWdpbl9qdGkiOiIxNGUxOGVjZS1kNWM4LTQ3YTEtYjc5YS1kYzBlZGMyYWUyNDgiLCJhdWQiOiJmOWQ0dmVrN2Npdmhyazd1czlqYW90ZnJwIiwiZXZlbnRfaWQiOiIwYmIxMTgzMy0yNDc2LTQ1OGEtOWY4OC0wYWRlZGExNzA0NDUiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc1MjY3MDM5NCwiZXhwIjoxNzUyNjczOTk0LCJjdXN0b206cm9sZSI6IlVTRVIiLCJpYXQiOjE3NTI2NzAzOTQsImp0aSI6IjBkMTI3MzY3LTExMmMtNDdhOS05YzJiLTk2N2I2ZjI0YzM3NSJ9.htc9gTHx9fOwKUgbEViSSR83wtV3JQEcyY_yX0Ub0ew-7VPxGt8TjwZGWjcFWhR2twqp2gCmOcy9CkJK1C-xhPRrXusBisKqg9WpSUgxSdegmDCH4YUOKtiZDt2JluSWLpCXObo6uLzQ7hRlWoQZY1K4YQDbWB94wFmTHc2wx5P7IO5MMex-TunEQnlL-TiBXLLOWtUfU7yqOzmKUASoEIKg2WUFcdlgl5YeQeFgqCPTnEx2QW8Rh-0zvTxRXInGCuwH00O9pJs8yrjedIx58Du47ZN75xVaRBoV4GaGWGusxSTBAof0afhg48Z3a0RwmMGQPFMB8JVIFgtjUp91Kw'

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
