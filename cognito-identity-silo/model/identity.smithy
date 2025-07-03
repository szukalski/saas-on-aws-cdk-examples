$version: "2.0"

namespace com.saasonaws

use aws.api#service
use aws.auth#sigv4
use aws.apigateway#authorizer
use aws.apigateway#authorizers
use aws.protocols#restJson1

@httpApiKeyAuth(name: "Authorization", in: "header")
@authorizers(
    authy: {
        scheme: httpApiKeyAuth
        type: "token"
        uri: "PLACEHOLDER"
        identitySource: "method.request.header.Authorization",
    }
)
@title("Identity")
@restJson1
@aws.apigateway#integration(
    type: "aws_proxy"
    // Specifies the integration's HTTP method type (for example, POST). For
    // Lambda function invocations, the value must be POST.
    httpMethod: "POST"
    uri: "PLACEHOLDER"
    credentials: "PLACEHOLDER"
)
@service(sdkId: "Identity", arnNamespace: "execute-api")
service Identity {
    version: "2025-05-21"
    operations: [
        Hello
    ]
    errors: [
        smithy.framework#ValidationException
        ResourceNotFoundError
        InternalServerError
        UnauthorizedError
        ForbiddenError
    ]
}

@readonly
@http(method: "GET", uri: "/hello")
operation Hello {
    input := {}
    output := {
        message: String
    }
}