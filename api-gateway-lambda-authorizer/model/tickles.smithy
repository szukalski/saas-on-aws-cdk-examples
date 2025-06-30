$version: "2.0"

namespace com.saasonaws

use aws.api#service
use aws.apigateway#authorizer
use aws.apigateway#authorizers
use aws.protocols#restJson1
use smithy.framework#ValidationException

@httpApiKeyAuth(name: "Authorization", in: "header")
@authorizers(
    authy: {
        scheme: httpApiKeyAuth
        type: "token"
        uri: "PLACEHOLDER"
        identitySource: "method.request.header.Authorization",
    }
)
@title("Tickles")
@restJson1
@aws.apigateway#integration(
    type: "aws_proxy"
    // Specifies the integration's HTTP method type (for example, POST). For
    // Lambda function invocations, the value must be POST.
    httpMethod: "POST"
    uri: "PLACEHOLDER"
    credentials: "PLACEHOLDER"
)
@service(sdkId: "Tickles", arnNamespace: "tickles")
service Tickles {
    version: "2025-05-21"
    operations: [
        Hello
    ]
    errors: [
        ValidationException
        InternalServerError
    ]
}

@authorizer("authy")
@http(method: "POST", uri: "/hello")
operation Hello {
    input := {}
    output := {
        message: String
    }
}

// An error indicating an internal server error
@httpError(500)
@error("server")
structure InternalServerError {
    @required
    message: String
}
