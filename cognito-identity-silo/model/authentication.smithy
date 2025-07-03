$version: "2.0"

namespace com.saasonaws

use aws.api#service
use aws.protocols#restJson1

@title("Authentication")
@restJson1
@aws.apigateway#integration(
    type: "aws_proxy"
    // Specifies the integration's HTTP method type (for example, POST). For
    // Lambda function invocations, the value must be POST.
    httpMethod: "POST"
    uri: "PLACEHOLDER"
    credentials: "PLACEHOLDER"
)
@service(sdkId: "Authentication", arnNamespace: "auth")
service Authentication {
    version: "2025-05-21"
    operations: [
        Auth
    ]
    errors: [
        smithy.framework#ValidationException
        ResourceNotFoundError
        InternalServerError
        UnauthorizedError
        ForbiddenError
    ]
}

@references([
    {
        resource: User
    }
])
structure AuthInput for User {
    @required
    $username

    @required
    $password
}

@http(method: "POST", uri: "/auth")
operation Auth {
    input: AuthInput

    output := {
        @required
        idToken: String

        @required
        accessToken: String

        @required
        refreshToken: String

        @required
        expiresIn: Integer
    }

    errors: [
        UnauthorizedError
        ForbiddenError
        ResourceNotFoundError
    ]
}
