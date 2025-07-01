$version: "2.0"

namespace com.saasonaws

use aws.api#service
use aws.auth#sigv4
use aws.protocols#restJson1

@title("UserMgmt")
@restJson1
@aws.apigateway#integration(
    type: "aws_proxy"
    // Specifies the integration's HTTP method type (for example, POST). For
    // Lambda function invocations, the value must be POST.
    httpMethod: "POST"
    uri: "PLACEHOLDER"
    credentials: "PLACEHOLDER"
)
@sigv4(name: "execute-api")
@service(sdkId: "UserMgmt", arnNamespace: "execute-api")
service UserMgmt {
    version: "2025-05-21"
    resources: [
        User
    ]
    errors: [
        smithy.framework#ValidationException
        ResourceNotFoundError
        InternalServerError
        UnauthorizedError
        ForbiddenError
    ]
}

enum UserRole {
    ADMIN = "admin"
    USER = "user"
}

resource User {
    identifiers: {
        username: String
    }
    properties: {
        role: UserRole
        password: String
        tenantId: TenantId
    }
    create: CreateUser
    read: ReadUser
    update: UpdateUser
    delete: DeleteUser
    list: ListUser
}

@references([
    {
        resource: User
    }
])
structure UserSchema for User {
    @required
    $username

    @required
    $role

    $tenantId
}

list UserList {
    member: UserSchema
}

@idempotent
@http(method: "POST", uri: "/user")
operation CreateUser {
    input := for User {
        $username

        $role

        $password
    }

    output := for User {
        @required
        $username

        @required
        $role
    }

    errors: [
        UnauthorizedError
        ForbiddenError
    ]
}

@readonly
@http(method: "GET", uri: "/user/{username}")
operation ReadUser {
    input := for User {
        @required
        @httpLabel
        $username
    }

    output := for User {
        @required
        $username

        @required
        $role

        $tenantId
    }

    errors: [
        ResourceNotFoundError
        UnauthorizedError
        ForbiddenError
    ]
}

@idempotent
@http(method: "PUT", uri: "/user/{username}")
operation UpdateUser {
    input := for User {
        @required
        @httpLabel
        $username

        $role
    }

    output := for User {
        @required
        $username

        @required
        $role
    }

    errors: [
        ResourceNotFoundError
        UnauthorizedError
        ForbiddenError
    ]
}

@idempotent
@http(method: "DELETE", uri: "/user/{username}")
operation DeleteUser {
    input := for User {
        @required
        @httpLabel
        $username
    }

    output := {}

    errors: [
        ResourceNotFoundError
        UnauthorizedError
        ForbiddenError
    ]
}

@readonly
@http(method: "GET", uri: "/user")
operation ListUser {
    input := {
        @httpQuery("nextToken")
        nextToken: String

        @httpQuery("maxResults")
        maxResults: Integer

        @httpQuery("role")
        role: UserRole
    }

    output := {
        items: UserList
        nextToken: String
    }

    errors: [
        UnauthorizedError
        ForbiddenError
    ]
}